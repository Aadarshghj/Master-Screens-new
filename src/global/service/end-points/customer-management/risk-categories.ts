import type {
  RiskCategoryRequestDto,
  RiskCategoryResponseDto,
  RiskCategoryType,
} from "@/types/customer-management/risk-category";
import { apiInstance } from "../../api-instance";
import { api } from "@/api";

export const riskCategoryApiService = apiInstance.injectEndpoints({
  endpoints: build => ({
    saveRiskCategory: build.mutation<
      RiskCategoryResponseDto,
      RiskCategoryRequestDto
    >({
      query: payload => ({
        url: api.riskCategories.save(),
        method: "POST",
        data: payload,
      }),
      invalidatesTags: ["RiskCategory"],
    }),

    getMasterRiskCategories: build.query<RiskCategoryType[], void>({
      query: () => ({
        url: api.riskCategories.get(),
        method: "GET",
      }),
      providesTags: ["RiskCategory"],

      transformResponse: (
        response: RiskCategoryResponseDto[]
      ): RiskCategoryType[] =>
        response.map(item => ({
          id: item.identity,
          riskCategoryName: item.category,
          riskCategoryCode: item.code,
        })),
    }),

    deleteRiskCategory: build.mutation<void, string>({
      query: riskCatId => ({
        url: api.riskCategories.delete(riskCatId),
        method: "DELETE",
      }),
      invalidatesTags: ["RiskCategory"],
    }),
  }),
});

export const {
  useSaveRiskCategoryMutation,
  useGetMasterRiskCategoriesQuery,
  useLazyGetMasterRiskCategoriesQuery,
  useDeleteRiskCategoryMutation,
} = riskCategoryApiService;
