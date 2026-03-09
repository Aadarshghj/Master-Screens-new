import { apiInstance } from "../../api-instance";
import { api } from "@/api";
import {
  type SourceOfIncomeResponseFormData,
  type SourceOfIncomeData,
  type SourceOfIncomeFormData,
} from "@/types/customer-management/source-income";

export const sourceOfIncomeApiService = apiInstance.injectEndpoints({
  endpoints: build => ({
    getSourceOfIncomeDetails: build.query<SourceOfIncomeData[], void>({
      query: () => ({
        url: api.sourceOfIncome.get(),
        method: "GET",
      }),
      providesTags: ["SourceOfIncome"],
    }),

    deleteSourceOfIncome: build.mutation<void, string>({
      query: identity => ({
        url: api.sourceOfIncome.delete(identity),
        method: "DELETE",
      }),
      invalidatesTags: ["SourceOfIncome"],
    }),

    createSourceOfIncome: build.mutation<void, Partial<SourceOfIncomeFormData>>(
      {
        query: payload => ({
          url: api.sourceOfIncome.save(),
          method: "POST",
          body: payload,
        }),
        invalidatesTags: ["SourceOfIncome"],
      }
    ),

   updateSourceOfIncome:build.mutation<
   SourceOfIncomeResponseFormData,
   {identity:string;payload:SourceOfIncomeFormData}>

({
  query:({identity,payload})=>({
    url:api.sourceOfIncome.update(identity),
    method:"PUT",
    data:payload 
  }),
  invalidatesTags:["SourceOfIncome"],
  }),
}),});

export const {
  useCreateSourceOfIncomeMutation,
  useGetSourceOfIncomeDetailsQuery,
  useDeleteSourceOfIncomeMutation,
  useUpdateSourceOfIncomeMutation,
} = sourceOfIncomeApiService;


