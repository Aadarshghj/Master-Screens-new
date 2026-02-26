import { apiInstance } from "../../api-instance";
import { api } from "@/api";
import type {
  TenantType,
  TenantRequestDto,
  TenantResponseDto,
} from "../../../../types/customer-management/tenant";

export const tenantApiService = apiInstance.injectEndpoints({
  endpoints: build => ({
    saveTenant: build.mutation<TenantResponseDto, TenantRequestDto>({
      query: payload => ({
        url: api.tenant.save(),
        method: "POST",
        data: payload as unknown as Record<string, void>
      }),
      invalidatesTags: ["Tenant"],
    }),

    getMasterTenants: build.query<TenantType[], void>({
      query: () => ({
        url: api.tenant.get(),
        method: "GET",
      }),
      providesTags: ["Tenant"],

      transformResponse: (response: TenantResponseDto[]): TenantType[] =>
        response.map(item => ({
          id: item.identity,
          tenantName: item.tenantName,
          tenantCode: item.tenantCode,
          isActive: item.isActive,
        })),
    }),

    getTenantById: build.query<TenantType, string>({
      query: tenantId => ({
        url: api.tenant.getById(tenantId),
        method: "GET",
      }),
      transformResponse: (item: TenantResponseDto): TenantType => ({
        id: item.identity,
        tenantName: item.tenantName,
        tenantCode: item.tenantCode,
        isActive: item.isActive,
      }),
    }),

    updateTenant: build.mutation<
      TenantType,
      { id: string; payload: TenantRequestDto }
    >({
      query: ({ id, payload }) => ({
        url: api.tenant.update(id),
        method: "PUT",
        data: payload as unknown as Record<string, void>
      }),
      transformResponse: (item: TenantResponseDto): TenantType => ({
        id: item.identity,
        tenantName: item.tenantName,
        tenantCode: item.tenantCode,
        isActive: item.isActive,
      }),
      invalidatesTags: ["Tenant"],
    }),

    deleteTenant: build.mutation<void, string>({
      query: tenantId => ({
        url: api.tenant.delete(tenantId),
        method: "DELETE",
      }),
      invalidatesTags: ["Tenant"],
    }),
  }),
});

export const {
  useSaveTenantMutation,
  useLazyGetMasterTenantsQuery,
  useDeleteTenantMutation,
  useLazyGetTenantByIdQuery,
  useUpdateTenantMutation,
} = tenantApiService;
