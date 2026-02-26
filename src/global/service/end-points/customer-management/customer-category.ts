import type {
  CustomerCategoryData,
  CustomerCategoryFormData,
} from "@/types/customer-management/customer-category";
import { apiInstance } from "../../api-instance";
import { api } from "@/api";

export const customerCategoryApiService = apiInstance.injectEndpoints({
  endpoints: build => ({
    getCustomerCategoryData: build.query<CustomerCategoryData[], void>({
      query: () => ({
        url: api.customerCategory.get(),
        method: "GET",
      }),
      providesTags: ["CustomerCategory"],
    }),
    deleteCustomerCategory: build.mutation<void, string>({
      query: identity => ({
        url: api.customerCategory.delete(identity),
        method: "DELETE",
      }),
      invalidatesTags: ["CustomerCategory"],
    }),
    createCustomerCategory: build.mutation<
      void,
      Partial<CustomerCategoryFormData>
    >({
      query: payload => ({
        url: api.customerCategory.save(),
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["CustomerCategory"],
    }),
  }),
});

export const {
  useCreateCustomerCategoryMutation,
  useDeleteCustomerCategoryMutation,
  useGetCustomerCategoryDataQuery,
} = customerCategoryApiService;
