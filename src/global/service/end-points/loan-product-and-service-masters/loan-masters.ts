import { api } from "@/api";
import { apiInstance } from "../../api-instance";

export interface ConfigOption {
  value: string;
  label: string;
  identity?: string;
}

interface LoanProductItem {
  loanProductName: string;
  description: string;
  identity: string;
  isActive: boolean;
}

interface DataTypeItem {
  dataTypeName: string;
  code: string;
  identity: string;
  isActive: boolean;
}
interface GLAccountTypeApiResponse {
  glAccountTypeIdentity: string;
  glAccountTypeName: string;
  glAccountTypeCode?: string;
  isActive: boolean;
}

interface RuleCategoryApiResponse {
  identity: string;
  ruleCategoryName: string;
  ruleCategoryCode?: string;
  isActive: boolean;
}

interface GLCategoryApiResponse {
  glCategoryIdentity: string;
  glCategoryName: string;
  glCategoryCode?: string;
  isActive: boolean;
}

export const loanMasterApiService = apiInstance.injectEndpoints({
  endpoints: build => ({
    getLoanProducts: build.query<ConfigOption[], void>({
      query: () => ({
        url: api.loan.getLoanProducts(),
        method: "GET",
      }),
      transformResponse: (response: LoanProductItem[]) => {
        return response
          .filter(
            item =>
              item.loanProductName &&
              item.loanProductName !== "" &&
              item.isActive
          )
          .filter(
            item =>
              item.loanProductName &&
              item.loanProductName !== "" &&
              item.isActive
          )
          .map(item => ({
            value: item.identity,
            label: item.loanProductName,
            identity: item.identity,
          }));
      },
    }),

    getDataTypes: build.query<ConfigOption[], void>({
      query: () => ({
        url: api.loan.getDataTypes(),
        method: "GET",
      }),
      transformResponse: (response: DataTypeItem[]) => {
        return response
          .filter(
            item =>
              item.dataTypeName && item.dataTypeName !== "" && item.isActive
          )
          .filter(
            item =>
              item.dataTypeName && item.dataTypeName !== "" && item.isActive
          )
          .map(item => ({
            value: item.identity,
            label: item.dataTypeName,
            identity: item.identity,
          }));
      },
    }),
    getGLAccountTypesOptions: build.query<ConfigOption[], void>({
      query: () => ({
        url: api.loan.getGLAccountTypesOptions(),
        method: "GET",
      }),
      transformResponse: (
        response: GLAccountTypeApiResponse[]
      ): ConfigOption[] => {
        return response
          .filter(item => item.isActive)
          .map(item => ({
            value: item.glAccountTypeIdentity,
            label: item.glAccountTypeName,
            identity: item.glAccountTypeIdentity,
          }));
      },
    }),

    getGLCategories: build.query<ConfigOption[], void>({
      query: () => ({
        url: api.loan.getGLCategories(),
        method: "GET",
      }),
      transformResponse: (
        response: GLCategoryApiResponse[]
      ): ConfigOption[] => {
        return response
          .filter(item => item.isActive)
          .filter(item => item.isActive)
          .map(item => ({
            value: item.glCategoryIdentity,
            label: item.glCategoryName,
            identity: item.glCategoryIdentity,
          }));
      },
    }),
    getRuleCategories: build.query<ConfigOption[], void>({
      query: () => ({
        url: api.loan.getRuleCategories(),
        method: "GET",
      }),
      transformResponse: (response: RuleCategoryApiResponse[]) => {
        return response.map(item => ({
          value: item.identity,
          label: item.ruleCategoryName,
          identity: item.identity,
        }));
      },
    }),
  }),
});

export const {
  useGetGLAccountTypesOptionsQuery,
  useGetGLCategoriesQuery,
  useGetLoanProductsQuery,
  useGetDataTypesQuery,
  useGetRuleCategoriesQuery,
} = loanMasterApiService;
