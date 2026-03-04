import { apiInstance } from "../../api-instance";
import { api } from "@/api";
import type { ConfigOption } from "@/types";
import type {
  AprovalQueueResponse,
  ModuleItem,
  WorkflowActionRequest,
  WorkflowActionResponse,
  WorkflowDefinitionItem,
} from "@/types/approval-workflow/approval-queue.types";
import type {
  BranchData,
  StatusData,
} from "@/types/approval-workflow/user-leave-status.types";

export const ApprovalQueueApiService = apiInstance.injectEndpoints({
  endpoints: build => ({
    filterApprovalQueue: build.query<
      AprovalQueueResponse,
      {
        branchIdentity?: string;
        moduleIdentity?: string;
        subModuleIdentity?: string;
        referenceNo?: string;
        status?: string;
        sort?: string;
        workflowIdentity?: string;
        page?: number;
        size?: number;
      }
    >({
      query: ({
        branchIdentity,
        moduleIdentity,
        subModuleIdentity,
        referenceNo,
        status,
        sort,
        workflowIdentity,
        page,
        size,
      }) => ({
        url: api.workflow.filterApprovalQueue(),
        method: "GET",
        params: {
          ...(branchIdentity && { branchIdentity }),
          ...(moduleIdentity && { moduleIdentity }),
          ...(subModuleIdentity && { subModuleIdentity }),
          ...(referenceNo && { referenceNo }),
          ...(status && { status }),
          ...(sort && { sort }),
          ...(workflowIdentity && { workflowIdentity }),
          ...(page !== undefined && { page }),
          ...(size !== undefined && { size }),
        },
      }),
      providesTags: ["ApprovalQueue"],
    }),
    getModules: build.query<ConfigOption[], void>({
      query: () => ({
        url: api.workflow.getModules(),
        method: "GET",
      }),
      transformResponse: (response: ModuleItem[]) => {
        return response.map(item => ({
          value: item.identity,
          label: item.moduleName,
          identity: item.identity,
        }));
      },
    }),
    getWorkflow: build.query<ConfigOption[], void>({
      query: () => ({
        url: api.workflow.workflowDefnitions(),
        method: "GET",
      }),
      transformResponse: (response: WorkflowDefinitionItem[]) => {
        return response.map(item => ({
          value: item.identity,
          label: item.workflowName,
          identity: item.identity,
        }));
      },
    }),
    getBranch: build.query<ConfigOption[], void>({
      query: () => ({
        url: api.workflow.getBranch(),
        method: "GET",
      }),
      transformResponse: (response: BranchData): ConfigOption[] => {
        return response?.content.map(item => ({
          value: item.identity ?? "",
          label: item.branchName ?? "",
          identity: item.identity ?? "",
        }));
      },
    }),
    getUsersStatus: build.query<ConfigOption[], void>({
      query: () => ({
        url: api.workflow.getUserStatus(),
        method: "GET",
      }),
      transformResponse: (response: StatusData[]): ConfigOption[] => {
        return response.map(item => ({
          value: item.statusCode ?? "",
          label: item.status ?? "",
          identity: item.statusCode ?? "",
        }));
      },
    }),
    approveWorkflow: build.mutation<
      WorkflowActionResponse,
      WorkflowActionRequest
    >({
      query: data => ({
        url: api.workflow.approveWorkflow(),
        method: "POST",
        data: data as unknown as Record<string, unknown>,
      }),
      invalidatesTags: ["ApprovalQueue"],
    }),
  }),
});

export const {
  useFilterApprovalQueueQuery,
  useGetModulesQuery,
  useGetWorkflowQuery,
  useGetBranchQuery,
  useGetUsersStatusQuery,
  useApproveWorkflowMutation,
} = ApprovalQueueApiService;
