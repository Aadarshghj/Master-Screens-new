import { apiInstance } from "../../api-instance";
import type {
  RoleManagementResponseDto,
  RoleManagementType,
  RoleManagementRequestDto,
} from "@/types/customer-management/role-management";
import { api } from "@/api";

export const roleManagementApiService = apiInstance.injectEndpoints({
  endpoints: build => ({
    saveRoleManagement: build.mutation<
      RoleManagementType,
      RoleManagementRequestDto
    >({
      query: payload => ({
        url: api.roleManagement.save(),
        method: "POST",
        data: payload,
      }),
      invalidatesTags: ["RoleManagement"],
    }),

    getMasterRoleManagement: build.query<RoleManagementType[], void>({
      query: () => ({
        url: api.roleManagement.get(),
        method: "GET",
      }),
      providesTags: ["RoleManagement"],

      transformResponse: (
        response: RoleManagementResponseDto[]
      ): RoleManagementType[] =>
        response.map(item => ({
          roleName: item.roleName,
          roleShortDesc: item.roleShortDesc,
          isActive: item.isActive,
          identity: item.identity,
        })),
    }),

    getRoleById: build.query<RoleManagementType, string>({
      query: identity => ({
        url: api.roleManagement.getById(identity),
        method: "GET",
      }),
      providesTags: ["RoleManagement"],

      transformResponse: (
        response: RoleManagementResponseDto
      ): RoleManagementType => ({
        roleName: response.roleName,
        roleShortDesc: response.roleShortDesc,
        isActive: response.isActive,
        identity: response.identity,
      }),
    }),

    updateRoleManagement: build.mutation<
      RoleManagementResponseDto,
      { identity: string; payload: RoleManagementRequestDto }
    >({
      query: ({ identity, payload }) => ({
        url: api.roleManagement.update(identity),
        method: "PUT",
        data: payload,
      }),
      invalidatesTags: ["RoleManagement"],
    }),

    deleteRoleManagement: build.mutation<void, string>({
      query: roleName => ({
        url: api.roleManagement.delete(roleName),
        method: "DELETE",
      }),
      invalidatesTags: ["RoleManagement"],
    }),
  }),
});

export const {
  useSaveRoleManagementMutation,
  useUpdateRoleManagementMutation,
  useLazyGetRoleByIdQuery,
  useGetMasterRoleManagementQuery,
  useDeleteRoleManagementMutation,
} = roleManagementApiService;
