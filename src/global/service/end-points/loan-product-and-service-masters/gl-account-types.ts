import type {
  GLAccountTypeData,
  GLAccountTypeMutationPayload,
  GLAccountTypeApiResponse,
  GLAccountSearchResult,
} from "@/types/loan-product-and-scheme-masters/gl-account-types.types";
import { api } from "@/api";
import { apiInstance } from "../../api-instance";

export const glAccountTypesApiService = apiInstance.injectEndpoints({
  endpoints: build => ({
    getGLAccountTypes: build.query<GLAccountTypeData[], void>({
      query: () => ({
        url: api.loan.getGLAccountTypes(),
        method: "GET",
      }),
      transformResponse: (
        response: GLAccountTypeApiResponse[]
      ): GLAccountTypeData[] => {
        return response.map(item => ({
          glAccountTypeId: item.glAccountTypeIdentity,
          category: item.category,
          glAccountType: item.glAccountType,
          glAccountId: item.glAccountIdentity,
          glAccountName: item.glAccountName,
          isActive: item.isActive,
          isEdited: false,
        }));
      },
    }),

    saveGLAccountTypes: build.mutation<
      { message: string },
      GLAccountTypeMutationPayload
    >({
      query: payload => ({
        url: api.loan.saveGLAccountType(),
        method: "POST" as const,
        data: payload as Record<string, unknown>,
      }),
    }),

    updateGLAccountTypes: build.mutation<
      { message: string },
      GLAccountTypeMutationPayload
    >({
      query: payload => ({
        url: api.loan.saveGLAccountType(),
        method: "PUT" as const,
        data: payload as Record<string, unknown>,
      }),
    }),

    searchGLAccountsThree: build.query<GLAccountSearchResult[], string>({
      query: searchTerm => ({
        url: `${api.loan.searchGLAccountsThree()}?search=${encodeURIComponent(searchTerm)}`,
        method: "GET",
      }),
      transformResponse: (
        response: GLAccountSearchResult[]
      ): GLAccountSearchResult[] => {
        if (Array.isArray(response)) {
          return response;
        }
        if (response && typeof response === "object" && "content" in response) {
          return (
            (response as { content: GLAccountSearchResult[] }).content || []
          );
        }
        return [];
      },
    }),
  }),
});

export const {
  useGetGLAccountTypesQuery,
  useSaveGLAccountTypesMutation,
  useUpdateGLAccountTypesMutation,
  useLazySearchGLAccountsThreeQuery,
} = glAccountTypesApiService;
