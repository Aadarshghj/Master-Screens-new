import type {
  WorkflowDefinitionSearchForm,
  SaveWorkflowDefinitionPayload,
  UpdateWorkflowDefinitionPayload,
  WorkflowDefinitionApiResponse,
  WorkflowDefinitionSearchResponse,
  PaginatedWorkflowDefinitionResponse,
  ModuleConfigOption,
} from "@/types/approval-workflow/workflow-definitions.types";
import { api } from "@/api";
import { apiInstance } from "../../api-instance";
import type { ConfigOption } from "@/types";

interface ModuleItem {
  moduleName: string;
  identity: string;
  isActive: boolean;
  subModules: SubModuleItem[];
}

interface SubModuleItem {
  subModuleName: string;
  identity: string;
  isActive: boolean;
  subModuleCode: string;
  modules: string;
}

interface WorkflowDefinitionResponse {
  workflowName: string;
  description: string;
  identity: string;
}
interface WorkflowActionResponse {
  name: string;
  description: string;
  identity: string;
}

export const workflowDefinitionsApiService = apiInstance.injectEndpoints({
  endpoints: build => ({
    saveWorkflowDefinition: build.mutation<
      WorkflowDefinitionApiResponse,
      SaveWorkflowDefinitionPayload
    >({
      query: payload => ({
        url: api.workflow.saveWorkflowDefinition(),
        method: "POST",
        data: payload,
      }),
    }),

    updateWorkflowDefinition: build.mutation<
      WorkflowDefinitionApiResponse,
      { definitionId: string; payload: UpdateWorkflowDefinitionPayload }
    >({
      query: ({ definitionId, payload }) => ({
        url: api.workflow.updateWorkflowDefinition({ definitionId }),
        method: "PUT",
        data: payload,
      }),
    }),

    deleteWorkflowDefinition: build.mutation<void, string>({
      query: definitionId => ({
        url: api.workflow.deleteWorkflowDefinition({ definitionId }),
        method: "DELETE",
      }),
    }),

    searchWorkflowDefinitions: build.query<
      WorkflowDefinitionSearchResponse,
      WorkflowDefinitionSearchForm
    >({
      query: params => {
        const queryParams = new URLSearchParams();

        if (params.module && params.module !== "all") {
          queryParams.append("moduleIdentity", params.module);
        }

        if (params.subModule && params.subModule !== "all") {
          queryParams.append("subModuleIdentity", params.subModule);
        }

        if (params.workflowName && params.workflowName.trim()) {
          queryParams.append("workflowName", params.workflowName.trim());
        }

        queryParams.append("page", params.page.toString());
        queryParams.append("size", params.size.toString());

        return {
          url: `${api.workflow.searchWorkflowDefinitions()}?${queryParams.toString()}`,
          method: "GET",
        };
      },
      transformResponse: (response: PaginatedWorkflowDefinitionResponse) => {
        return {
          content: response.content.map(item => ({
            definitionId: item.identity,
            identity: item.identity,
            moduleIdentity: item.moduleIdentity,
            module: item.moduleIdentity,
            moduleName: item.moduleName,
            subModuleIdentity: item.subModuleIdentity,
            subModule: item.subModuleIdentity,
            subModuleName: item.subModuleName,
            workflowName: item.workflowName,
            description: item.description || "",
            isActive: item.active,
            active: item.active,
            status: item.active ? "ACTIVE" : "INACTIVE",
            statusName: item.active ? "ACTIVE" : "INACTIVE",
          })),
          totalPages: response.totalPages,
          totalElements: response.totalElements,
          page: response.number,
          size: response.size,
        };
      },
    }),

    getModulesAndSubModules: build.query<ModuleConfigOption[], void>({
      query: () => ({
        url: api.workflow.getModules(),
        method: "GET",
      }),
      transformResponse: (response: ModuleItem[]): ModuleConfigOption[] => {
        return response.map(item => ({
          value: item.identity,
          label: item.moduleName,
          identity: item.identity,
          subModules: item.subModules.map(sub => ({
            identity: sub.identity,
            subModuleName: sub.subModuleName,
            subModuleCode: sub.subModuleCode,
            isActive: sub.isActive,
          })),
        }));
      },
    }),
    getSubModulesByModule: build.query<ConfigOption[], string>({
      query: moduleId => ({
        url: api.workflow.getSubModulesByModule({ moduleId }),
        method: "GET",
      }),
      transformResponse: (response: SubModuleItem[]) => {
        return response.map(item => ({
          value: item.identity,
          label: item.subModuleName,
          identity: item.identity,
        }));
      },
    }),

    getWorkflowDefinitionById: build.query<
      WorkflowDefinitionApiResponse,
      string
    >({
      query: definitionId => ({
        url: api.workflow.getWorkflowDefinitionById({ definitionId }),
        method: "GET",
      }),
    }),
    getWorkflowDefinitions: build.query<ConfigOption[], void>({
      query: () => ({
        url: api.workflow.getWorkflowDefinition(),
        method: "GET",
      }),
      transformResponse: (
        response: WorkflowDefinitionResponse[]
      ): ConfigOption[] => {
        return response.map(item => ({
          value: item.identity,
          label: item.workflowName,
          identity: item.identity,
        }));
      },
    }),
    getWorkflowAction: build.query<ConfigOption[], void>({
      query: () => ({
        url: api.workflow.getWorkflowAction(),
        method: "GET",
      }),
      transformResponse: (
        response: WorkflowActionResponse[]
      ): ConfigOption[] => {
        return response.map(item => ({
          value: item.identity,
          label: item.name,
          identity: item.identity,
        }));
      },
    }),
  }),
});

export const {
  useSaveWorkflowDefinitionMutation,
  useUpdateWorkflowDefinitionMutation,
  useDeleteWorkflowDefinitionMutation,
  useLazySearchWorkflowDefinitionsQuery,
  useLazyGetWorkflowDefinitionByIdQuery,
  useGetModulesAndSubModulesQuery,
  useLazyGetSubModulesByModuleQuery,
  useGetWorkflowDefinitionsQuery,
  useGetWorkflowActionQuery,
} = workflowDefinitionsApiService;
