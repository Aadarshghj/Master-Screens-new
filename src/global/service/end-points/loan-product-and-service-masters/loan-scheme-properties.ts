import type {
  LoanSchemePropertyData,
  LoanSchemePropertySearchForm,
  SaveLoanSchemePropertyPayload,
  UpdateLoanSchemePropertyPayload,
  LoanSchemePropertyApiResponse,
  PaginatedLoanSchemePropertyResponse,
} from "@/types/loan-product-and-scheme-masters/loan-scheme-properties.types";
import { api } from "@/api";
import { apiInstance } from "../../api-instance";

export const loanSchemePropertiesApiService = apiInstance.injectEndpoints({
  endpoints: build => ({
    saveLoanSchemeProperty: build.mutation<
      LoanSchemePropertyApiResponse,
      SaveLoanSchemePropertyPayload
    >({
      query: payload => ({
        url: api.loan.saveLoanSchemeProperty(),
        method: "POST",
        data: payload,
      }),
    }),

    updateLoanSchemeProperty: build.mutation<
      LoanSchemePropertyApiResponse,
      { propertyId: string; payload: UpdateLoanSchemePropertyPayload }
    >({
      query: ({ propertyId, payload }) => ({
        url: api.loan.updateLoanSchemeProperty({ propertyId }),
        method: "PUT",
        data: payload,
      }),
    }),

    deleteLoanSchemeProperty: build.mutation<void, string>({
      query: propertyId => ({
        url: api.loan.deleteLoanSchemeProperty({ propertyId }),
        method: "DELETE",
      }),
    }),

    searchLoanSchemeProperties: build.query<
      {
        content: LoanSchemePropertyData[];
        totalPages: number;
        totalElements: number;
        currentPage: number;
      },
      LoanSchemePropertySearchForm
    >({
      query: searchParams => {
        const queryParams = new URLSearchParams();

        if (
          searchParams.loanProduct?.trim() &&
          searchParams.loanProduct !== "all"
        ) {
          queryParams.append(
            "productIdentity",
            searchParams.loanProduct.trim()
          );
        }
        if (searchParams.status?.trim() && searchParams.status !== "all") {
          queryParams.append("isActive", searchParams.status.trim());
        }
        if (searchParams.dataType?.trim() && searchParams.dataType !== "all") {
          queryParams.append("dataTypeIdentity", searchParams.dataType.trim());
        }
        if (
          searchParams.isRequired?.trim() &&
          searchParams.isRequired !== "all"
        ) {
          queryParams.append("isRequired", searchParams.isRequired.trim());
        }
        queryParams.append("size", (searchParams.size || 20).toString());
        queryParams.append("page", (searchParams.page || 0).toString());

        return {
          url: `${api.loan.searchLoanSchemeProperties()}?${queryParams.toString()}`,
          method: "GET",
        };
      },
      transformResponse: (response: PaginatedLoanSchemePropertyResponse) => {
        return {
          content: response.content.map(item => ({
            propertyId: item.propertyIdentity,
            identity: item.propertyIdentity,
            loanProduct: item.productId,
            productId: item.productId,
            loanProductName: "",
            propertyKey: item.propertyKey,
            property: item.propertyKey,
            propertyName: item.propertyName,
            dataType: item.dataType,
            dataTypeId: item.dataType,
            dataTypeName: "",
            defaultValue: item.defaultValue,
            // description: "",
            description: item.description || "",
            isRequired: item.isRequired,
            isActive: item.isActive,
            status: item.isActive ? "ACTIVE" : "INACTIVE",
            statusName: item.isActive ? "ACTIVE" : "INACTIVE",
          })),
          totalPages: response.totalPages,
          totalElements: response.totalElements,
          currentPage: response.number,
        };
      },
    }),
  }),
});

export const {
  useSaveLoanSchemePropertyMutation,
  useUpdateLoanSchemePropertyMutation,
  useDeleteLoanSchemePropertyMutation,
  useLazySearchLoanSchemePropertiesQuery,
} = loanSchemePropertiesApiService;
