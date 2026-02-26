import type {
  WorkflowStageRequestDto,
  WorkflowStageResponseDto,
  WorkflowStagesPageResponse,
} from "@/types/admin/workflow-stages";
import { apiInstance } from "../../api-instance";
import { api } from "@/api";

export const workflowStagesApiService = apiInstance.injectEndpoints({
  endpoints: build => ({
    saveWorkflowStage: build.mutation<
      WorkflowStageResponseDto,
      WorkflowStageRequestDto
    >({
      query: payload => ({
        url: api.workflowStages.save(),
        method: "POST",
        data: payload,
      }),
    }),

    updateWorkflowStage: build.mutation<
      WorkflowStageResponseDto,
      { stageId: string; payload: WorkflowStageRequestDto }
    >({
      query: ({ stageId, payload }) => ({
        url: api.workflowStages.update(stageId),
        method: "PUT",
        data: payload,
      }),
    }),

    getWorkflowStages: build.query<
      WorkflowStagesPageResponse,
      { workflowId: string; page: number; size: number }
    >({
      query: ({ workflowId, page, size }) => ({
        url: api.workflowStages.getByWorkflow(workflowId),
        method: "GET",
        params: {
          workflow: workflowId,
          page,
          size,
        },
      }),
    }),

    getWorkflowStageById: build.query<
      WorkflowStageResponseDto,
      { stageId: string }
    >({
      query: ({ stageId }) => ({
        url: api.workflowStages.getById(stageId),
        method: "GET",
      }),
    }),
  }),
});

export const {
  useSaveWorkflowStageMutation,
  useUpdateWorkflowStageMutation,
  useGetWorkflowStagesQuery,
  useLazyGetWorkflowStagesQuery,
  useGetWorkflowStageByIdQuery,
} = workflowStagesApiService;
