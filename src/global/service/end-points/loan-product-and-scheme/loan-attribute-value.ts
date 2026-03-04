import { apiInstance } from "../../api-instance";
import { api } from "@/api";
import type {
  LoanSchemeAttributeValueRequest,
  LoanSchemeAttributeValueResponse,
} from "@/types/loan-product-and schema Stepper/assign-attribute.types";

export const loanSchemeAttributeValuesApiService = apiInstance.injectEndpoints({
  endpoints: build => ({
    getLoanSchemeAttributeValues: build.query<
      LoanSchemeAttributeValueResponse,
      string
    >({
      query: schemeIdentity => ({
        url: api.loanStepper.getLoanSchemeAttributeValues({ schemeIdentity }),
        method: "GET" as const,
      }),
    }),

    createLoanSchemeAttributeValues: build.mutation<
      LoanSchemeAttributeValueResponse,
      { schemeIdentity: string; payload: LoanSchemeAttributeValueRequest }
    >({
      query: ({ schemeIdentity, payload }) => ({
        url: api.loanStepper.createLoanSchemeAttributeValues({
          schemeIdentity,
        }),
        method: "POST" as const,
        data: payload as unknown as Record<string, unknown>,
      }),
    }),

    updateLoanSchemeAttributeValues: build.mutation<
      LoanSchemeAttributeValueResponse,
      { schemeIdentity: string; payload: LoanSchemeAttributeValueRequest }
    >({
      query: ({ schemeIdentity, payload }) => ({
        url: api.loanStepper.updateLoanSchemeAttributeValues({
          schemeIdentity,
        }),
        method: "PUT" as const,
        data: payload as unknown as Record<string, unknown>,
      }),
    }),
  }),
});

export const {
  useGetLoanSchemeAttributeValuesQuery,
  useCreateLoanSchemeAttributeValuesMutation,
  useUpdateLoanSchemeAttributeValuesMutation,
} = loanSchemeAttributeValuesApiService;
