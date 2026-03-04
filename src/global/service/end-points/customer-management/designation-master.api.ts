import type {
  DesignationRoleMappingRequestDto,
  DesignationRoleMappingResponseDto,
  RoleDto,
} from "@/types/designation-role-mapping/designation-mapping";

import { apiInstance } from "../../api-instance";
import { api } from "@/api";

export interface DesignationRoleMapping {
  id: string;
  designationId: string;
  designationName: string;
  roleId: string;
  roleName: string;
  isActive: boolean;
}

export const designationRoleMappingApiService = apiInstance.injectEndpoints({
  endpoints: build => ({
    getAllRoles: build.query<RoleDto[], void>({
      query: () => ({
        url: api.designationRoleMapping.getRoles(),
        method: "GET",
      }),
    }),
    getPermissionTypes: build.query<
      {
        identity: string;
        permissionCode: string;
        permissionName: string;
        description: string;
        isActive: boolean;
      }[],
      void
    >({
      query: () => ({
        url: api.designationRoleMapping.getPermission(),
        method: "GET",
      }),
    }),
    saveDesignationRoleMapping: build.mutation<
      DesignationRoleMappingResponseDto,
      DesignationRoleMappingRequestDto
    >({
      query: payload => ({
        url: api.designationRoleMapping.save(),
        method: "POST",
        data: payload as unknown as Record<string, unknown>,
      }),
      invalidatesTags: ["DesignationRoleMapping"],
    }),

    getAllDesignationRoleMappings: build.query<DesignationRoleMapping[], void>({
      query: () => ({
        url: api.designationRoleMapping.getAll(),
        method: "GET",
      }),

      providesTags: ["DesignationRoleMapping"],

      transformResponse: (
        response: DesignationRoleMappingResponseDto[]
      ): DesignationRoleMapping[] =>
        response.map(item => ({
          id: item.identity,
          designationId: item.designationIdentity,
          designationName: item.designation,
          roleId: item.roleIdentity,
          roleName: item.role,
          isActive: item.isActive,
        })),
    }),

    getDesignationRoleMappingById: build.query<DesignationRoleMapping, string>({
      query: identity => ({
        url: api.designationRoleMapping.getById(identity),
        method: "GET",
      }),

      providesTags: ["DesignationRoleMapping"],

      transformResponse: (
        item: DesignationRoleMappingResponseDto
      ): DesignationRoleMapping => ({
        id: item.identity,
        designationId: item.designationIdentity,
        designationName: item.designation,
        roleId: item.roleIdentity,
        roleName: item.role,
        isActive: item.isActive,
      }),
    }),

    updateDesignationRoleMapping: build.mutation<
      DesignationRoleMappingResponseDto,
      { identity: string; payload: DesignationRoleMappingRequestDto }
    >({
      query: ({ identity, payload }) => ({
        url: api.designationRoleMapping.update(identity),
        method: "PUT",
        data: payload as unknown as Record<string, unknown>,
      }),
      invalidatesTags: ["DesignationRoleMapping"],
    }),

    deleteDesignationRoleMapping: build.mutation<void, string>({
      query: identity => ({
        url: api.designationRoleMapping.delete(identity),
        method: "DELETE",
      }),
      invalidatesTags: ["DesignationRoleMapping"],
    }),
  }),
});

export const {
  useSaveDesignationRoleMappingMutation,
  useGetAllDesignationRoleMappingsQuery,
  useLazyGetAllDesignationRoleMappingsQuery,
  useGetDesignationRoleMappingByIdQuery,
  useUpdateDesignationRoleMappingMutation,
  useDeleteDesignationRoleMappingMutation,
  useGetAllRolesQuery,
    useLazyGetDesignationRoleMappingByIdQuery,
} = designationRoleMappingApiService;
