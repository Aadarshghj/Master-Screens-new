import { apiInstance } from "../../api-instance";
import { api } from "@/api";

export const businessRulesApiService = apiInstance.injectEndpoints({
  endpoints: build => ({
    getMasterBusinessRules: build.query({
      query: () => ({
        url: api.loanStepper.getMasterBusinessRules(),
        method: "GET",
      }),
      transformResponse: (response: unknown) => {
        const data = Array.isArray(response)
          ? response
          : (response as { data?: unknown[] })?.data || [];
        return data.map(
          (item: {
            identity?: string;
            id?: string;
            ruleName?: string;
            name?: string;
            businessRuleName?: string;
          }) => ({
            value: item.identity || item.id || "",
            label: item.ruleName || item.name || item.businessRuleName || "",
          })
        );
      },
    }),

    getBusinessRules: build.query({
      query: ({ schemeId }) => ({
        url: api.loanStepper.getBusinessRules({ schemeId }),
        method: "GET",
      }),
      transformResponse: (response: unknown) => {
        const responseObj = response as
          | { schemeName?: string; content?: unknown[]; data?: unknown[] }
          | unknown[];
        const schemeName = Array.isArray(responseObj)
          ? undefined
          : responseObj.schemeName;
        const data = Array.isArray(responseObj)
          ? responseObj
          : responseObj.content || responseObj.data || [];

        const transformed = data.map((item: unknown) => {
          const typedItem = item as {
            identity: string;
            businessRuleIdentity: string;
            executionOrder: number;
            effectiveFrom: string;
            effectiveTo: string;
            isActive?: boolean;
            active?: boolean;
            status?: boolean;
            createdAt: string;
            updatedAt: string;
          };
          return {
            id: typedItem.identity,
            businessRuleIdentity: typedItem.businessRuleIdentity,
            executionOrder: typedItem.executionOrder,
            effectiveFrom: typedItem.effectiveFrom,
            effectiveTo: typedItem.effectiveTo,
            isActive:
              typedItem.isActive ??
              typedItem.active ??
              typedItem.status ??
              false,
            createdAt: typedItem.createdAt,
            updatedAt: typedItem.updatedAt,
          };
        });

        return { businessRules: transformed, schemeName };
      },
      providesTags: ["BusinessRule"],
    }),

    createBusinessRule: build.mutation({
      query: ({ schemeId, payload }) => ({
        url: api.loanStepper.createBusinessRule({ schemeId }),
        method: "POST",
        data: payload,
      }),
      invalidatesTags: ["BusinessRule"],
    }),

    updateBusinessRule: build.mutation({
      query: ({ schemeId, ruleId, payload }) => ({
        url: api.loanStepper.updateBusinessRule({ schemeId, ruleId }),
        method: "PUT",
        data: payload,
      }),
      invalidatesTags: ["BusinessRule"],
    }),

    deleteBusinessRule: build.mutation({
      query: ({ schemeId, ruleId }) => ({
        url: api.loanStepper.deleteBusinessRule({ schemeId, ruleId }),
        method: "DELETE",
      }),
      invalidatesTags: ["BusinessRule"],
    }),
  }),
});

export const {
  useGetMasterBusinessRulesQuery,
  useGetBusinessRulesQuery,
  useCreateBusinessRuleMutation,
  useUpdateBusinessRuleMutation,
  useDeleteBusinessRuleMutation,
} = businessRulesApiService;
