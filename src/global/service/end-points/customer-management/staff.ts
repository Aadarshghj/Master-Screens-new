import type {
  StaffData,
  StaffFormData,
} from "@/types/customer-management/staffs";
import { apiInstance } from "../../api-instance";
import { api } from "@/api";
export const staffApiService = apiInstance.injectEndpoints({
  endpoints: build => ({
    getStaffDetails: build.query<StaffData[], void>({
      query: () => ({
        url: api.staff.get(),
        method: "GET",
      }),
      providesTags: ["Staff"],
    }),
    deleteStaff: build.mutation<void, string>({
      query: identity => ({
        url: api.staff.delete(identity),
        method: "DELETE",
      }),
      invalidatesTags: ["Staff"],
    }),
    createStaff: build.mutation<void, Partial<StaffFormData>>({
      query: payload => ({
        url: api.staff.save(),
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Staff"],
    }),
  }),
});

export const {
  useCreateStaffMutation,
  useGetStaffDetailsQuery,
  useDeleteStaffMutation,
} = staffApiService;
