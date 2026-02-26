import { apiInstance } from "../../api-instance";
import { api } from "@/api";

export const LoanApprovalApiService = apiInstance.injectEndpoints({
  endpoints: build => ({
    getLoanSchemeStatus: build.query<
      { status: string; message?: string },
      string
    >({
      query: schemeId => ({
        url: api.loanStepper.getLoanSchemeStatusApprovals({ schemeId }),
        method: "PATCH",
      }),
    }),

    sendLoanSchemeForApproval: build.mutation<
      { success: boolean; message: string },
      string
    >({
      query: schemeId => ({
        url: api.loanStepper.getLoanSchemeStatusApprovals({ schemeId }),
        method: "PATCH",
      }),
    }),
  }),
});

export const {
  useGetLoanSchemeStatusQuery,
  useSendLoanSchemeForApprovalMutation,
} = LoanApprovalApiService;
