import type {
  LoanBusinessRuleData,
  LoanBusinessRuleSearchForm,
  SaveLoanBusinessRulePayload,
  UpdateLoanBusinessRulePayload,
  LoanBusinessRuleApiResponse,
  LoanBusinessRuleSearchResponse,
  PaginatedLoanBusinessRuleResponse,
} from "@/types/loan-product-and-scheme-masters/business-rules.types";
import { api } from "@/api";
import { apiInstance } from "../../api-instance";

export const loanBusinessRulesApiService = apiInstance.injectEndpoints({
  endpoints: build => ({
    getLoanBusinessRules: build.query<LoanBusinessRuleData[], void>({
      query: () => ({
        url: api.loan.getLoanBusinessRules(),
        method: "GET",
      }),
      transformResponse: (
        response: LoanBusinessRuleApiResponse[]
      ): LoanBusinessRuleData[] => {
        return response.map(item => ({
          ruleId: item.identity || "",
          loanProduct: item.productIdentity || "",
          loanProductName: "",
          ruleCode: item.ruleCode,
          ruleName: item.ruleName,
          ruleCategory: item.ruleCategoryIdentity || "",
          ruleCategoryName: item.ruleCategoryName || "",
          categoryIdentity: item.ruleCategoryIdentity || "",
          conditionExpression: item.conditionExpression,
          actionExpression: item.actionExpression,
          isActive: item.active ?? false,
          active: item.active ?? false,
          status: item.active ? "ACTIVE" : "INACTIVE",
          statusName: item.active ? "ACTIVE" : "INACTIVE",
          productIdentity: item.productIdentity || "",
          identity: item.identity || "",
        }));
      },
    }),

    saveLoanBusinessRule: build.mutation<
      LoanBusinessRuleApiResponse,
      SaveLoanBusinessRulePayload
    >({
      query: payload => ({
        url: api.loan.saveLoanBusinessRule(),
        method: "POST",
        data: payload,
      }),
    }),

    updateLoanBusinessRule: build.mutation<
      LoanBusinessRuleApiResponse,
      { ruleId: string; payload: UpdateLoanBusinessRulePayload }
    >({
      query: ({ ruleId, payload }) => ({
        url: api.loan.updateLoanBusinessRule({ ruleId }),
        method: "PUT",
        data: payload,
      }),
    }),

    deleteLoanBusinessRule: build.mutation<void, string>({
      query: ruleId => ({
        url: api.loan.deleteLoanBusinessRule({ ruleId }),
        method: "DELETE",
      }),
    }),

    searchLoanBusinessRules: build.query<
      LoanBusinessRuleSearchResponse,
      LoanBusinessRuleSearchForm
    >({
      query: params => {
        const queryParams = new URLSearchParams();

        if (params.loanProduct && params.loanProduct !== "all") {
          queryParams.append("loanProductIdentity", params.loanProduct);
        }

        if (params.category && params.category !== "all") {
          queryParams.append("ruleCategoriesIdentity", params.category);
        }

        if (params.status && params.status !== "all") {
          queryParams.append("status", params.status);
        }

        if (params.ruleCode && params.ruleCode.trim()) {
          queryParams.append("ruleCode", params.ruleCode.trim());
        }

        if (params.ruleName && params.ruleName.trim()) {
          queryParams.append("ruleName", params.ruleName.trim());
        }

        queryParams.append("page", params.page.toString());
        queryParams.append("size", params.size.toString());

        return {
          url: `${api.loan.searchLoanBusinessRules()}?${queryParams.toString()}`,
          method: "GET",
        };
      },
      transformResponse: (response: PaginatedLoanBusinessRuleResponse) => {
        return {
          content: response.content.map(item => ({
            ruleId: item.identity,
            identity: item.identity,
            productIdentity: item.productIdentity,
            loanProduct: item.productIdentity,
            loanProductName: "",
            ruleCode: item.ruleCode,
            ruleName: item.ruleName,
            ruleCategory: item.ruleCategoryIdentity,
            ruleCategoryName: item.ruleCategoryName,
            categoryIdentity: item.ruleCategoryIdentity,
            conditionExpression: item.conditionExpression,
            actionExpression: item.actionExpression,
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

    getLoanBusinessRuleById: build.query<LoanBusinessRuleApiResponse, string>({
      query: ruleId => ({
        url: api.loan.getLoanBusinessRuleById({ ruleId }),
        method: "GET",
      }),
    }),
    searchRulesByCode: build.query<
      LoanBusinessRuleData[],
      { searchTerm: string }
    >({
      query: ({ searchTerm }) => ({
        url: `${api.loan.searchBusinessRules()}?ruleCode=${encodeURIComponent(searchTerm)}`,
        method: "GET",
      }),
      transformResponse: (
        response: LoanBusinessRuleData[]
      ): LoanBusinessRuleData[] => {
        if (Array.isArray(response)) {
          return response;
        }
        if (response && typeof response === "object" && "content" in response) {
          return (
            (response as { content: LoanBusinessRuleData[] }).content || []
          );
        }
        return [];
      },
    }),

    searchRulesByName: build.query<
      LoanBusinessRuleData[],
      { searchTerm: string }
    >({
      query: ({ searchTerm }) => ({
        url: `${api.loan.searchBusinessRules()}?ruleName=${encodeURIComponent(searchTerm)}`,
        method: "GET",
      }),
      transformResponse: (
        response: LoanBusinessRuleData[]
      ): LoanBusinessRuleData[] => {
        if (Array.isArray(response)) {
          return response;
        }
        if (response && typeof response === "object" && "content" in response) {
          return (
            (response as { content: LoanBusinessRuleData[] }).content || []
          );
        }
        return [];
      },
    }),
  }),
});

export const {
  useGetLoanBusinessRulesQuery,
  useSaveLoanBusinessRuleMutation,
  useUpdateLoanBusinessRuleMutation,
  useDeleteLoanBusinessRuleMutation,
  useLazySearchLoanBusinessRulesQuery,
  useLazyGetLoanBusinessRuleByIdQuery,
  useLazySearchRulesByCodeQuery,
  useLazySearchRulesByNameQuery,
} = loanBusinessRulesApiService;
