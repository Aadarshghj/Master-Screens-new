import type {
  LoanSchemeTypeRequestDto,
  LoanSchemeTypeResponseDto,
} from "@/types/customer-management/loan-scheme-type";
import { apiInstance } from "../../api-instance";
import { api } from "@/api";

export const loanSchemeTypeApiService = apiInstance.injectEndpoints({
  endpoints: build => ({
    saveLoanSchemeType: build.mutation<
      LoanSchemeTypeResponseDto,
      LoanSchemeTypeRequestDto
    >({
      query: payload => ({
        url: api.loanSchemeType.save(),
        method: "POST",
        data: payload,
      }),
      invalidatesTags: ["LoanSchemeType"],
    }),

    updateLoanSchemeType: build.mutation<
  LoanSchemeTypeResponseDto,
  LoanSchemeTypeRequestDto & { id: string }
>({
  query: ({ id, ...payload }) => ({
    url: api.loanSchemeType.update(id),
    method: "PUT",
    data: payload,
  }),
  invalidatesTags: ["LoanSchemeType"],
}),

    getMasterLoanSchemeType: build.query<LoanSchemeTypeResponseDto[], void>({
      query: () => ({
        url: api.loanSchemeType.get(),
        method: "GET",
      }),
      providesTags: ["LoanSchemeType"],

    }),

    deleteLoanSchemeType: build.mutation<void, string>({
      query: id => ({
        url: api.loanSchemeType.delete(id),
        method: "DELETE",
      }),
      invalidatesTags: ["LoanSchemeType"],
    }),
  }),
});

  export const {
  useSaveLoanSchemeTypeMutation,
  useUpdateLoanSchemeTypeMutation,
  useGetMasterLoanSchemeTypeQuery,
  useDeleteLoanSchemeTypeMutation,
} = loanSchemeTypeApiService;
