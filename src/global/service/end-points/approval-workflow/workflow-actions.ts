import type {
  WorkflowActionData,
  WorkflowActionSearchForm,
  SaveWorkflowActionPayload,
  UpdateWorkflowActionPayload,
  WorkflowActionApiResponse,
  WorkflowActionSearchResponse,
  PaginatedWorkflowActionResponse,
} from "@/types/approval-workflow/workflow-actions.types";
import { api } from "@/api";
import { apiInstance } from "../../api-instance";
import type { ConfigOption } from "@/types";

interface LinkedStageItem {
  levelName: string;
  workflowStageIdentity: string;
  isActive: boolean;
}

export const workflowActionsApiService = apiInstance.injectEndpoints({
  endpoints: build => ({
    getWorkflowActions: build.query<WorkflowActionData[], void>({
      query: () => ({
        url: api.workflow.getWorkflowActions(),
        method: "GET",
      }),
      transformResponse: (
        response: WorkflowActionApiResponse[]
      ): WorkflowActionData[] => {
        return response.map(item => ({
          actionId: item.identity,
          workflow: item.workflowIdentity,
          workflowName: "",
          linkedStage: item.linkedStageIdentity,
          linkedStageName: item.linkedStageName,
          actionName: item.actionName,
          nextLevel: item.nextLevelIdentity,
          nextLevelStageName: item.nextLevelStageName,
          terminalAction: item.terminalAction,
          workflowIdentity: item.workflowIdentity,
          linkedStageIdentity: item.linkedStageIdentity,
          nextLevelIdentity: item.nextLevelIdentity,
        }));
      },
    }),

    getWorkflowActionsInTable: build.query<
      {
        content: WorkflowActionData[];
        totalPages: number;
        totalElements: number;
        number: number;
      },
      { page?: number; size?: number }
    >({
      query: ({ page = 0, size = 10 } = {}) => ({
        url: `${api.workflow.getWorkflowActionsInTable()}?page=${page}&size=${size}`,
        method: "GET",
      }),
      transformResponse: (response: PaginatedWorkflowActionResponse) => {
        return {
          content: response.content.map(item => ({
            actionId: item.identity,
            identity: item.identity,
            workflow: item.workflowIdentity,
            workflowName: "",
            linkedStage: item.linkedStageIdentity,
            linkedStageName: item.linkedStageName,
            actionName: item.actionName,
            nextLevel: item.nextLevelIdentity,
            nextLevelStageName: item.nextLevelStageName,
            terminalAction: item.terminalAction,
            workflowIdentity: item.workflowIdentity,
            linkedStageIdentity: item.linkedStageIdentity,
            nextLevelIdentity: item.nextLevelIdentity,
          })),
          totalPages: response.totalPages,
          totalElements: response.totalElements,
          number: response.number,
        };
      },
    }),

    saveWorkflowAction: build.mutation<
      WorkflowActionApiResponse,
      SaveWorkflowActionPayload
    >({
      query: payload => ({
        url: api.workflow.saveWorkflowAction(),
        method: "POST",
        data: payload,
      }),
    }),

    updateWorkflowAction: build.mutation<
      WorkflowActionApiResponse,
      { actionId: string; payload: UpdateWorkflowActionPayload }
    >({
      query: ({ actionId, payload }) => ({
        url: api.workflow.updateWorkflowAction({ actionId }),
        method: "PUT",
        data: payload,
      }),
    }),

    deleteWorkflowAction: build.mutation<void, string>({
      query: actionId => ({
        url: api.workflow.deleteWorkflowAction({ actionId }),
        method: "DELETE",
      }),
    }),

    searchWorkflowActions: build.query<
      WorkflowActionSearchResponse,
      WorkflowActionSearchForm
    >({
      query: params => {
        const queryParams = new URLSearchParams();

        if (params.workflow && params.workflow !== "all") {
          queryParams.append("workflowIdentity", params.workflow);
        }

        queryParams.append("page", params.page.toString());
        queryParams.append("size", params.size.toString());

        return {
          url: `${api.workflow.searchWorkflowActions()}?${queryParams.toString()}`,
          method: "GET",
        };
      },
      transformResponse: (response: PaginatedWorkflowActionResponse) => {
        return {
          content: response.content.map(item => ({
            actionId: item.identity,
            identity: item.identity,
            workflowIdentity: item.workflowIdentity,
            workflow: item.workflowIdentity,
            workflowName: "",
            linkedStage: item.linkedStageIdentity,
            linkedStageIdentity: item.linkedStageIdentity,
            linkedStageName: item.linkedStageName,
            actionName: item.actionName,
            nextLevel: item.nextLevelIdentity,
            nextLevelIdentity: item.nextLevelIdentity,
            nextLevelStageName: item.nextLevelStageName,
            terminalAction: item.terminalAction,
          })),
          totalPages: response.totalPages,
          totalElements: response.totalElements,
          page: response.number,
          size: response.size,
        };
      },
    }),

    autoPopulateWorkflowActions: build.mutation<void, string>({
      query: workflowIdentity => ({
        url: api.workflow.autoPopulateWorkflowActions({ workflowIdentity }),
        method: "POST",
      }),
    }),

    getLinkedStages: build.query<ConfigOption[], string>({
      query: workflowIdentity => ({
        url: api.workflow.getLinkedStages({ workflowIdentity }),
        method: "GET",
      }),
      transformResponse: (response: LinkedStageItem[]): ConfigOption[] => {
        return response.map(item => ({
          label: item.levelName,
          value: item.workflowStageIdentity,
          identity: item.workflowStageIdentity,
        }));
      },
    }),
  }),
});

export const {
  useGetWorkflowActionsQuery,
  useGetWorkflowActionsInTableQuery,
  useSaveWorkflowActionMutation,
  useUpdateWorkflowActionMutation,
  useDeleteWorkflowActionMutation,
  useLazySearchWorkflowActionsQuery,
  useLazyGetLinkedStagesQuery,
  useAutoPopulateWorkflowActionsMutation,
} = workflowActionsApiService;
