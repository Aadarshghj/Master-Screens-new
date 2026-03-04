import type { AdminUnitTypeOption } from "@/types/organisation/admin-unit";
import { apiInstance } from "../../api-instance";
import { unitType } from "@/api/organisation/unit-type";

interface AdminUnitTypeDto {
  name: string;
  code: string;
  description?: string;
  hierarchyLevel: number;
  identity: string;
  isActive: boolean;
}

export const adminUnitTypeApiService = apiInstance.injectEndpoints({
  endpoints: build => ({
    getAdminUnitTypes: build.query<AdminUnitTypeOption[], void>({
      query: () => ({ url: unitType.getUnitType(), method: "GET" }),
      providesTags: ["AdminUnitType"],

      transformResponse: (res: AdminUnitTypeDto[]): AdminUnitTypeOption[] =>
        res.map(item => ({
          label: item.name,
          value: item.identity,
          code: item.code,
          hierarchyLevel: item.hierarchyLevel,
          isActive: item.isActive,
        })),
    }),
  }),
});

export const { useGetAdminUnitTypesQuery, useLazyGetAdminUnitTypesQuery } =
  adminUnitTypeApiService;
