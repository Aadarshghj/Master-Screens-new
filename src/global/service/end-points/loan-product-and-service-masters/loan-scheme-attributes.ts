import type {
  LoanSchemeAttributeData,
  LoanSchemeAttributeSearchForm,
  SaveLoanSchemeAttributePayload,
  UpdateLoanSchemeAttributePayload,
  LoanSchemeAttributeApiResponse,
  LoanSchemeAttributeSearchResponse,
  PaginatedLoanSchemeAttributeResponse,
} from "@/types/loan-product-and-scheme-masters/loan-scheme-attributes.types";
import { api } from "@/api";
import { apiInstance } from "../../api-instance";

export const loanSchemeAttributesApiService = apiInstance.injectEndpoints({
  endpoints: build => ({
    getLoanSchemeAttributes: build.query<LoanSchemeAttributeData[], void>({
      query: () => ({
        url: api.loan.getLoanSchemeAttributes(),
        method: "GET",
      }),
      transformResponse: (
        response: LoanSchemeAttributeApiResponse[]
      ): LoanSchemeAttributeData[] => {
        return response.map(item => ({
          attributeId: item.identity,
          loanProduct: item.productIdentity,
          loanProductName: "",
          attributeKey: item.attributeKey,
          attributeName: item.attributeName,
          dataType: item.dataType,
          dataTypeName: "",
          defaultValue: item.defaultValue,
          description: item.description,
          isRequired: item.required,
          isActive: item.active,
          takeoverBtiScheme: item.takeoverBtiScheme,
          status: item.active ? "ACTIVE" : "INACTIVE",
          statusName: item.active ? "ACTIVE" : "INACTIVE",
        }));
      },
    }),

    saveLoanSchemeAttribute: build.mutation<
      LoanSchemeAttributeApiResponse,
      SaveLoanSchemeAttributePayload
    >({
      query: payload => ({
        url: api.loan.saveLoanSchemeAttribute(),
        method: "POST",
        data: payload,
      }),
    }),

    updateLoanSchemeAttribute: build.mutation<
      LoanSchemeAttributeApiResponse,
      { attributeId: string; payload: UpdateLoanSchemeAttributePayload }
    >({
      query: ({ attributeId, payload }) => ({
        url: api.loan.updateLoanSchemeAttribute({ attributeId }),
        method: "PUT",
        data: payload,
      }),
    }),

    deleteLoanSchemeAttribute: build.mutation<void, string>({
      query: attributeId => ({
        url: api.loan.deleteLoanSchemeAttribute({ attributeId }),
        method: "DELETE",
      }),
    }),

    searchLoanSchemeAttributes: build.query<
      LoanSchemeAttributeSearchResponse,
      LoanSchemeAttributeSearchForm
    >({
      query: params => {
        const queryParams = new URLSearchParams();

        if (params.loanProduct) {
          queryParams.append("productIdentity", params.loanProduct);
        }
        if (params.attributeName) {
          queryParams.append("attributeName", params.attributeName);
        }
        if (params.status) {
          queryParams.append("active", params.status);
        }
        if (params.dataType) {
          queryParams.append("dataType", params.dataType);
        }
        if (params.required) {
          queryParams.append("required", params.required);
        }

        queryParams.append("page", params.page.toString());
        queryParams.append("size", params.size.toString());

        return {
          url: `${api.loan.searchLoanSchemeAttributes()}?${queryParams.toString()}`,
          method: "GET",
        };
      },
      transformResponse: (response: PaginatedLoanSchemeAttributeResponse) => {
        return {
          content: response.content.map(item => ({
            attributeId: item.identity,
            identity: item.identity,
            productIdentity: item.productIdentity,
            loanProduct: item.productIdentity,
            loanProductName: "",
            attributeKey: item.attributeKey,
            attributeName: item.attributeName,
            dataType: item.dataType,
            dataTypeName: "",
            defaultValue: item.defaultValue,
            description: item.description,
            isRequired: item.required,
            isActive: item.active,
            takeoverBtiScheme: item.takeoverBtiScheme,
            active: item.active,
            required: item.required,
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

    getLoanSchemeAttributeById: build.query<
      LoanSchemeAttributeApiResponse,
      string
    >({
      query: attributeId => ({
        url: api.loan.getLoanSchemeAttributeById({ attributeId }),
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetLoanSchemeAttributesQuery,
  useSaveLoanSchemeAttributeMutation,
  useUpdateLoanSchemeAttributeMutation,
  useDeleteLoanSchemeAttributeMutation,
  useLazySearchLoanSchemeAttributesQuery,
  useLazyGetLoanSchemeAttributeByIdQuery,
} = loanSchemeAttributesApiService;
