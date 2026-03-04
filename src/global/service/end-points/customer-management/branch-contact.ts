import type {
  BranchContactData,
  BranchContactFormData,
  BranchData,
} from "@/types/customer-management/branch-contact";
import { apiInstance } from "../../api-instance";
import { api } from "@/api";
export const branchContactApiService = apiInstance.injectEndpoints({
  endpoints: build => ({
    getBranchContactDetails: build.query<BranchContactData[], void>({
      query: () => ({
        url: api.branchContact.get(),
        method: "GET",
      }),
      providesTags: ["BranchContact"],
    }),
    deleteBranchContact: build.mutation<void, string>({
      query: identity => ({
        url: api.branchContact.delete(identity),
        method: "DELETE",
      }),
      invalidatesTags: ["BranchContact"],
    }),
    createBranchContact: build.mutation<void, Partial<BranchContactFormData>>({
      query: payload => ({
        url: api.branchContact.save(),
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["BranchContact"],
    }),
    getBranchData: build.query<BranchData[], void>({
      query: () => ({
        url: api.branchContact.getBranches(),
        method: "GET",
      }),
    }),
  }),
});

export const {
  useCreateBranchContactMutation,
  useGetBranchContactDetailsQuery,
  useDeleteBranchContactMutation,
  useGetBranchDataQuery,
} = branchContactApiService;
