import type {
  LoanSchemeFormData,
  ApiResponse,
  SearchResponse,
} from "@/types/loan-product-and schema Stepper/create-loan-and-product.types";
import { apiInstance } from "../../api-instance";
import { api } from "@/api";

export const loanProductSchemeApiService = apiInstance.injectEndpoints({
  endpoints: build => ({
    createLoanScheme: build.mutation<ApiResponse, LoanSchemeFormData>({
      query: payload => ({
        url: api.loanStepper.createLoanScheme(),
        method: "POST" as const,
        body: payload as unknown as Record<string, unknown>,
      }),
    }),

    updateLoanScheme: build.mutation<
      ApiResponse,
      { schemeId: string; payload: Partial<LoanSchemeFormData> }
    >({
      query: ({ schemeId, payload }) => ({
        url: api.loanStepper.updateLoanScheme({ schemeId }),
        method: "PUT" as const,
        body: payload as unknown as Record<string, unknown>,
      }),
    }),

    searchLoanSchemes: build.mutation<
      SearchResponse,
      {
        loanProduct?: string;
        schemeName?: string;
        schemeCode?: string;
        schemeTypeName?: string;
        page?: number;
        size?: number;
      }
    >({
      query: payload => {
        const params: Record<string, string | number> = {};

        if (payload.loanProduct) {
          params.loanProductIdentity = payload.loanProduct;
        }

        if (payload.schemeName) {
          params.schemeName = payload.schemeName;
        }

        if (payload.schemeCode) {
          params.schemeCode = payload.schemeCode;
        }

        if (payload.schemeTypeName) {
          params.schemeTypeIdentity = payload.schemeTypeName;
        }

        if (payload.page !== undefined) {
          params.page = payload.page;
        }

        if (payload.size !== undefined) {
          params.size = payload.size;
        }

        return {
          url: api.loanStepper.searchLoanSchemes(),
          method: "GET" as const,
          params,
        };
      },
    }),

    getLoanSchemeById: build.query<ApiResponse<LoanSchemeFormData>, string>({
      query: schemeId => ({
        url: api.loanStepper.getLoanSchemeById({ schemeId }),
        method: "GET" as const,
      }),
    }),

    getSlabPeriodType: build.query<
      Array<{
        identity: string;
        slabPeriodTypeName: string;
        description: string;
      }>,
      void
    >({
      query: () => ({
        url: api.master.getSlabPeriodType(),
        method: "GET" as const,
      }),
    }),
  }),
});

export const {
  useCreateLoanSchemeMutation,
  useUpdateLoanSchemeMutation,
  useSearchLoanSchemesMutation,
  useGetLoanSchemeByIdQuery,
  useGetSlabPeriodTypeQuery,
} = loanProductSchemeApiService;
