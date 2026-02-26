import type { FirmData, FirmType } from "@/types/customer-management/firm-type";
import { apiInstance } from "../../api-instance";
import { api } from "@/api";
export const firmTypeApiService = apiInstance.injectEndpoints({
  endpoints: build => ({
    getFirmData: build.query<FirmType[], void>({
      query: () => ({
        url: api.firmType.get(),
        method: "GET",
      }),
      providesTags: ["FirmType"],
    }),
    deleteFirmData: build.mutation<void, string>({
      query: identity => ({
        url: api.firmType.delete(identity),
        method: "DELETE",
      }),
      invalidatesTags: ["FirmType"],
    }),
    createFirmType: build.mutation<void, Partial<FirmData>>({
      query: payload => ({
        url: api.firmType.save(),
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["FirmType"],
    }),
  }),
});

export const {
  useGetFirmDataQuery,
  useDeleteFirmDataMutation,
  useCreateFirmTypeMutation,
} = firmTypeApiService;
