import { apiInstance } from "../../api-instance";
import { api } from "@/api";
import type {
  LoanSchemePropertyValueRequest,
  LoanSchemePropertyValueResponse,
  GLAccountItem as GLAccount,
} from "@/types/loan-product-and schema Stepper/assign-property.types";

export const loanSchemePropertyValuesApiService = apiInstance.injectEndpoints({
  endpoints: build => ({
    getLoanSchemePropertyValues: build.query<
      LoanSchemePropertyValueResponse,
      string
    >({
      query: schemeIdentity => ({
        url: api.loanStepper.getLoanSchemePropertyValues({ schemeIdentity }),
        method: "GET" as const,
      }),
      providesTags: ["LoanSchemePropertyValues"],
    }),

    createLoanSchemePropertyValues: build.mutation<
      LoanSchemePropertyValueResponse,
      { schemeIdentity: string; payload: LoanSchemePropertyValueRequest[] }
    >({
      query: ({ schemeIdentity, payload }) => ({
        url: api.loanStepper.createLoanSchemePropertyValues({ schemeIdentity }),
        method: "POST" as const,
        data: payload as unknown as Record<string, unknown>,
      }),
      invalidatesTags: ["LoanSchemePropertyValues"],
    }),

    updateLoanSchemePropertyValues: build.mutation<
      LoanSchemePropertyValueResponse,
      { schemeIdentity: string; payload: LoanSchemePropertyValueRequest[] }
    >({
      query: ({ schemeIdentity, payload }) => ({
        url: api.loanStepper.updateLoanSchemePropertyValues({ schemeIdentity }),
        method: "PUT" as const,
        data: payload as unknown as Record<string, unknown>,
      }),
      invalidatesTags: ["LoanSchemePropertyValues"],
    }),

    getGLAccounts: build.query<GLAccount[], string | undefined>({
      query: search => ({
        url: api.loanStepper.getGLAccounts({ search }),
        method: "GET" as const,
      }),
    }),
  }),
});

export const {
  useGetLoanSchemePropertyValuesQuery,
  useCreateLoanSchemePropertyValuesMutation,
  useUpdateLoanSchemePropertyValuesMutation,
  useGetGLAccountsQuery,
} = loanSchemePropertyValuesApiService;
