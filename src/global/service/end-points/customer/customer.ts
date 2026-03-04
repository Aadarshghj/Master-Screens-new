import { api } from "@/api";
import { apiInstance } from "../../api-instance";

export const customerApiService = apiInstance.injectEndpoints({
  endpoints: build => ({
    modifyCustomerStatus: build.mutation({
      query: (customerId: string) => ({
        url: api.customer.modifyCustomerStatus({ customerId }),
        method: "PATCH",
      }),
    }),
  }),
});

export const { useModifyCustomerStatusMutation } = customerApiService;
