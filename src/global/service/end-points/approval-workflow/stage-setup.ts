import { apiInstance } from "../../api-instance";
import { api } from "@/api";
import type {
  WorkflowStageResponse,
  WorkflowStageFormData,
  WorkflowStage,
  OptionType,
  WorkflowResponse,
} from "@/types/approval-workflow/workflow-stagesetup";

export const workflowStagesApiService = apiInstance.injectEndpoints({
  endpoints: build => ({
    getWorkflows: build.query<OptionType[], void>({
      query: () => ({
        url: api.workflow.getWorkflowDefinition(),
        method: "GET",
      }),
      transformResponse: (response: WorkflowResponse[]) => {
        if (Array.isArray(response)) {
          const filtered = response.filter(
            (item: WorkflowResponse) => item.identity && item.workflowName
          );

          const mapped = filtered.map((item: WorkflowResponse) => ({
            value: item.identity,
            label: item.workflowName,
          }));

          return mapped;
        }

        return [];
      },
      providesTags: ["Workflows"],
    }),

    getRoles: build.query<OptionType[], void>({
      query: () => ({
        url: api.workflow.getAssignedRoles(),
        method: "GET",
      }),
      transformResponse: (response: {
        content?: { identity: string; roleName: string }[];
      }) => {
        if (response && response.content && Array.isArray(response.content)) {
          const filtered = response.content.filter(
            item => item.identity && item.roleName
          );

          const mapped = filtered.map(item => ({
            value: item.identity,
            label: item.roleName,
          }));

          return mapped;
        }

        return [];
      },
      providesTags: ["Roles"],
    }),

    getWorkflowStages: build.query<WorkflowStageResponse, { workflow: string }>(
      {
        query: ({ workflow }) => ({
          url: api.workflow.filterWorkflowStages({
            workflowIdentity: workflow || undefined,
          }),
          method: "GET",
        }),
        transformResponse: (response: WorkflowStageResponse) => {
          if (response && response.content && Array.isArray(response.content)) {
            response.content = response.content.map(stage => {
              return {
                ...stage,
                identity: stage.workflowStageIdentity || stage.identity,
              };
            });
          }
          return response;
        },
        providesTags: ["WorkflowStages"],
      }
    ),

    createWorkflowStage: build.mutation<WorkflowStage, WorkflowStageFormData>({
      query: formData => {
        console.log("🔍 Raw form data received:", formData);

        // Force clean object creation with only required properties
        const { workflow, levelName, assignedToRole, finalLevel } = formData;
        const payload = Object.freeze({
          workflowIdentity: workflow,
          levelName: levelName,
          assignedRoleIdentity: assignedToRole,
          isFinalLevel: finalLevel,
        });

        console.log("🔍 Final payload being sent:", payload);

        return {
          url: api.workflow.saveWorkflowStage(),
          method: "POST",
          data: payload,
        };
      },
      invalidatesTags: ["WorkflowStages"],
    }),

    updateWorkflowStage: build.mutation<
      WorkflowStage,
      { identity: string; data: WorkflowStageFormData }
    >({
      query: ({ identity, data: formData }) => {
        console.log("🔍 Raw update form data received:", formData);

        // Force clean object creation with only required properties
        const { workflow, levelName, assignedToRole, finalLevel } = formData;
        const payload = Object.freeze({
          workflowIdentity: workflow,
          levelName: levelName,
          assignedRoleIdentity: assignedToRole,
          isFinalLevel: finalLevel,
        });

        console.log("🔍 Final update payload being sent:", payload);

        return {
          url: api.workflow.updateWorkflowStage({ identity }),
          method: "PUT",
          data: payload,
        };
      },
      invalidatesTags: ["WorkflowStages"],
    }),

    deleteWorkflowStage: build.mutation<void, string>({
      query: identity => ({
        url: api.workflow.deleteWorkflowStage({ identity }),
        method: "DELETE",
      }),
      invalidatesTags: ["WorkflowStages"],
    }),

    getLevelOrders: build.query<OptionType[], string>({
      query: workflow => ({
        url: api.workflow.getLevelOrders({ workflow }),
        method: "GET",
      }),
      transformResponse: (response: WorkflowStage[]) => {
        if (Array.isArray(response)) {
          return response
            .filter((item: WorkflowStage) => item.levelOrder)
            .map((item: WorkflowStage) => ({
              value: item.levelOrder || "",
              label: `Level ${item.levelOrder}`,
            }));
        }
        return [];
      },
    }),
  }),
});

export const {
  useGetWorkflowsQuery,
  useGetRolesQuery,
  useGetWorkflowStagesQuery,
  useCreateWorkflowStageMutation,
  useUpdateWorkflowStageMutation,
  useDeleteWorkflowStageMutation,
  useGetLevelOrdersQuery,
} = workflowStagesApiService;
