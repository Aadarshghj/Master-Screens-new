import type {
  FirmRoleData,
  FirmRoleType,
} from "@/types/customer-management/firm-role";
import { apiInstance } from "../../api-instance";
import { api } from "@/api";

export const firmRoleApiService = apiInstance.injectEndpoints({
  endpoints: build => ({
    getFirmRole: build.query<FirmRoleData[], void>({
      query: () => ({
        url: api.firmRole.get(),
        method: "GET",
      }),
      providesTags: ["FirmRole"],
    }),
    deleteFirmRole: build.mutation<void, string>({
      query: identity => ({
        url: api.firmRole.delete(identity),
        method: "DELETE",
      }),
      invalidatesTags: ["FirmRole"],
    }),
    createFirmRole: build.mutation<void, Partial<FirmRoleType>>({
      query: payload => ({
        url: api.firmRole.save(),
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["FirmRole"],
    }),
  }),
});

export const {
  useGetFirmRoleQuery,
  useCreateFirmRoleMutation,
  useDeleteFirmRoleMutation,
} = firmRoleApiService;
