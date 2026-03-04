import { apiInstance } from "../../api-instance";
import { api } from "@/api";
import type {
  sectoralPerformanceData,
  sectoralPerformanceFormData,
} from "@/types/customer-management/sectoral-performance";
export const sectoralPerformancesApiService = apiInstance.injectEndpoints({
  endpoints: build => ({
    getSectoralPerformance: build.query<sectoralPerformanceData[], void>({
      query: () => ({
        url: api.sectoralPerformances.get(),
        method: "GET",
      }),
      providesTags: ["SectoralPerformances"],
    }),
    deleteSectoralPerformance: build.mutation<void, string>({
      query: identity => ({
        url: api.sectoralPerformances.delete(identity),
        method: "DELETE",
      }),
      invalidatesTags: ["SectoralPerformances"],
    }),
    createSectoralPerformance: build.mutation<
      void,
      Partial<sectoralPerformanceFormData>
    >({
      query: payload => ({
        url: api.sectoralPerformances.save(),
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["SectoralPerformances"],
    }),
  }),
});

export const {
  useGetSectoralPerformanceQuery,
  useCreateSectoralPerformanceMutation,
  useDeleteSectoralPerformanceMutation,
} = sectoralPerformancesApiService;
