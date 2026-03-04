// service/endpoints/workflow/workflow-amount.ts

import { api } from "@/api";
import { apiInstance } from "../../api-instance";
import type {
  WorkflowAmountResponse,
  WorkflowAmountFormData,
  WorkflowAmountSearchParams,
  WorkflowAmountRule,
  OptionType,
} from "@/types/approval-workflow/workflow-amount.types";

export const workflowAmountApi = apiInstance.injectEndpoints({
  endpoints: builder => ({
    // Get all workflows for dropdown
    getWorkflowsForAmount: builder.query<OptionType[], void>({
      query: () => ({
        url: api.workflow.getWorkflowsForAmount(),
        method: "GET",
      }),
      transformResponse: (
        response: { identity: string; workflowName: string }[]
      ) => {
        return response.map(item => ({
          value: item.identity,
          label: item.workflowName,
        }));
      },
      providesTags: ["Workflows"],
    }),

    // Get all approval flows for dropdown
    getApprovalFlows: builder.query<OptionType[], void>({
      query: () => ({
        url: api.workflow.getApprovalFlows(),
        method: "GET",
      }),
      transformResponse: (
        response:
          | { content?: { identity: string; roleName: string }[] }
          | { identity: string; roleName: string }[]
      ) => {
        // Handle paginated response structure
        const data = Array.isArray(response)
          ? response
          : response.content || [];
        return data.map((item: { identity: string; roleName: string }) => ({
          value: item.identity,
          label: item.roleName,
        }));
      },
      providesTags: ["ApprovalFlows"],
    }),

    // Get assigned roles by workflow
    getAssignedRolesByWorkflow: builder.query<OptionType[], string>({
      query: workflowIdentity => ({
        url: api.workflow.getAssignedRolesByWorkflow({ workflowIdentity }),
        method: "GET",
      }),
      transformResponse: (
        response:
          | {
              content?: Array<{
                roleIdentity?: string;
                identity?: string;
                id?: string;
                roleName?: string;
                name?: string;
              }>;
            }
          | Array<{
              roleIdentity?: string;
              identity?: string;
              id?: string;
              roleName?: string;
              name?: string;
            }>
      ) => {
        const data = Array.isArray(response)
          ? response
          : response.content || [];

        return data.map(item => ({
          value: item.roleIdentity || item.identity || item.id || "",
          label: item.roleName || item.name || "",
        }));
      },
      providesTags: ["Roles"],
    }),

    getAmountOnOptions: builder.query<OptionType[], void>({
      query: () => ({
        url: api.workflow.getAmountOnOptions(),
        method: "GET",
      }),
      transformResponse: (response: { identity: string; name: string }[]) => {
        return response.map(item => ({
          value: item.identity,
          label: item.name,
        }));
      },
      providesTags: ["AmountOnOptions"],
    }),

    // Search workflow amount rules with filters
    searchWorkflowAmountRules: builder.query<
      WorkflowAmountResponse,
      WorkflowAmountSearchParams
    >({
      query: params => ({
        url: api.workflow.searchWorkflowAmountRules({
          workflow: params.workflow,
          page: params.page,
          size: params.size,
        }),
        method: "GET",
      }),
      providesTags: ["WorkflowAmountRules"],
    }),

    // Create workflow amount rule
    createWorkflowAmountRule: builder.mutation<
      WorkflowAmountRule,
      WorkflowAmountFormData
    >({
      query: data => {
        const payload = {
          workflowIdentity: data.workflow,
          fromAmount:
            parseFloat(String(data.fromAmount).replace(/,/g, "")) || 0,
          toAmount: parseFloat(String(data.toAmount).replace(/,/g, "")) || 0,
          amountOn: data.amountOn,
          approvalFlow: data.approvalFlow,
          active: data.active,
        };
        return {
          url: api.workflow.createWorkflowAmountRule(),
          method: "POST",
          data: payload,
        };
      },
      invalidatesTags: ["WorkflowAmountRules"],
    }),

    // Update workflow amount rule
    updateWorkflowAmountRule: builder.mutation<
      WorkflowAmountRule,
      { identity: string; data: WorkflowAmountFormData }
    >({
      query: ({ identity, data }) => ({
        url: api.workflow.updateWorkflowAmountRule({ identity }),
        method: "PUT",
        data: {
          workflowIdentity: data.workflow,
          fromAmount:
            parseFloat(String(data.fromAmount).replace(/,/g, "")) || 0,
          toAmount: parseFloat(String(data.toAmount).replace(/,/g, "")) || 0,
          amountOn: data.amountOn,
          approvalFlow: data.approvalFlow,
          active: data.active,
        },
      }),
      invalidatesTags: ["WorkflowAmountRules"],
    }),

    // Delete workflow amount rule
    deleteWorkflowAmountRule: builder.mutation<void, string>({
      query: identity => ({
        url: api.workflow.deleteWorkflowAmountRule({ identity }),
        method: "DELETE",
      }),
      invalidatesTags: ["WorkflowAmountRules"],
    }),

    // Toggle active status
    toggleWorkflowAmountRuleStatus: builder.mutation<
      WorkflowAmountRule,
      { identity: string; active: boolean }
    >({
      query: ({ identity, active }) => ({
        url: api.workflow.toggleWorkflowAmountRuleStatus({ identity }),
        method: "PATCH",
        body: { active },
      }),
      invalidatesTags: ["WorkflowAmountRules"],
    }),
  }),
});

export const {
  useGetWorkflowsForAmountQuery,
  useGetApprovalFlowsQuery,
  useGetAssignedRolesByWorkflowQuery,
  useLazyGetAssignedRolesByWorkflowQuery,
  useGetAmountOnOptionsQuery,
  useSearchWorkflowAmountRulesQuery,
  useCreateWorkflowAmountRuleMutation,
  useUpdateWorkflowAmountRuleMutation,
  useDeleteWorkflowAmountRuleMutation,
  useToggleWorkflowAmountRuleStatusMutation,
} = workflowAmountApi;
