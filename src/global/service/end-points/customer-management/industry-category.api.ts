import type {
  IndustryCategoryType,
  IndustryCategoryResponseDto,
} from "@/types/customer-management/industry-category";
import { apiInstance } from "../../api-instance";
import { api } from "@/api";

export const industryCategoryApiService = apiInstance.injectEndpoints({
  endpoints: build => ({
    saveIndustryCategory: build.mutation<
      IndustryCategoryResponseDto,
      IndustryCategoryType
    >({
      query: payload => ({
        url: api.industryCategory.save(),
        method: "POST",
        data: payload,
      }),
      invalidatesTags: [{ type: "IndustryCategory", id: "LIST" }],
    }),

    getIndustryCategories: build.query<IndustryCategoryResponseDto[], void>({
      query: () => ({
        url: api.industryCategory.get(),
        method: "GET",
      }),
      providesTags: result =>
        result
          ? [
              ...result.map(item => ({
                type: "IndustryCategory" as const,
                id: item.identity,
              })),
              { type: "IndustryCategory", id: "LIST" },
            ]
          : [{ type: "IndustryCategory", id: "LIST" }],
    }),
    deleteIndustryCategory: build.mutation<void, string>({
      query: identity => ({
        url: `${api.industryCategory.get()}/${identity}`,
        method: "DELETE",
      }),
      invalidatesTags: (_r, _e, identity) => [
        { type: "IndustryCategory", id: identity },
        { type: "IndustryCategory", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useSaveIndustryCategoryMutation,
  useGetIndustryCategoriesQuery,
  useDeleteIndustryCategoryMutation,
} = industryCategoryApiService;
