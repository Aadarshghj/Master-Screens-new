import type {
  CustomerGroupRequestDto,
  CustomerGroupResponseDto,
} from "@/types/customer-management/customer-group-master";
import { apiInstance } from "../../api-instance";
import { api } from "@/api";

export const customerGroupApiService = apiInstance.injectEndpoints({
  endpoints: build => ({
    saveCustomerGroup: build.mutation<
      CustomerGroupResponseDto,
      CustomerGroupRequestDto
    >({
      query: payload => ({
        url: api.customerGroup.save(),
        method: "POST",
        data: payload,
      }),
      invalidatesTags: ["CustomerGroup"],
    }),
    getCustomerMasterGroups: build.query<CustomerGroupResponseDto[], void>({
      query: () => ({
        url: api.customerGroup.get(),
        method: "GET",
      }),
      providesTags: ["CustomerGroup"],
    }),
    deleteCustomerGroup: build.mutation<void, string>({
      query: identity => ({
        url: `${api.customerGroup.get()}/${identity}`,
        method: "DELETE",
      }),
      invalidatesTags: ["CustomerGroup"],
    }),
  }),
});

export const {
  useSaveCustomerGroupMutation,
  useGetCustomerMasterGroupsQuery,
  useDeleteCustomerGroupMutation,
} = customerGroupApiService;
