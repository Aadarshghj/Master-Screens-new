import { apiInstance } from "../../api-instance";
import { UserRoleMaster } from "@/api/customer-management/userRoleMaster";
import type {
  ApiMasterRole,
  ApiUserRoleMapping,
  AssignedRole,
  SaveRolePayload,
} from "@/types/user-role-mapping/user-mapping";
import type { ApiPermissionType } from "@/types/user-role-mapping/user-mapping";

export const userRoleApiService = apiInstance.injectEndpoints({
  endpoints: build => ({
    getUserRoles: build.query<AssignedRole[], void>({
      query: () => ({
        url: UserRoleMaster.get(),
        method: "GET",
      }),
      providesTags: ["UserRole"],
    }),
    getPermissionTypes: build.query<ApiPermissionType[], void>({
      query: () => ({
        url: UserRoleMaster.getPermissions(),
        method: "GET",
      }),
      providesTags: ["UserRole"],
    }),

    getAssignedRoles: build.query<AssignedRole[], void>({
      query: () => ({
        url: UserRoleMaster.getAssignedRoles(),
        method: "GET",
      }),
      providesTags: ["UserRole"],
    }),
    getAvailableRoles: build.query<ApiMasterRole[], void>({
      query: () => ({
        url: "/api/v1/users/role",
        method: "GET",
      }),
      providesTags: ["UserRole"],
    }),

    createUserRole: build.mutation<void, SaveRolePayload>({
      query: payload => ({
        url: UserRoleMaster.save(),
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["UserRole"],
    }),

    getUserRoleMappingById: build.query<ApiUserRoleMapping[], string>({
      query: identity => ({
        url: UserRoleMaster.GetById(identity),
        method: "GET",
      }),
      providesTags: (_result, _error, identity) => [
        { type: "UserRole", id: identity },
        "UserRole",
      ],
    }),

    updateUserRole: build.mutation<
      void,
      { id: string; data: Partial<AssignedRole> }
    >({
      query: ({ id, data }) => ({
        url: UserRoleMaster.UpdateById(id),
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        "UserRole",
        { type: "UserRole", id },
      ],
    }),

    deleteUserRole: build.mutation<void, string>({
      query: identity => ({
        url: UserRoleMaster.Delete(identity),
        method: "DELETE",
      }),
      invalidatesTags: ["UserRole"],
    }),
  }),
});

export const {
  useGetUserRolesQuery,
  useGetAssignedRolesQuery,
  useCreateUserRoleMutation,
  useUpdateUserRoleMutation,
  useDeleteUserRoleMutation,
  useGetPermissionTypesQuery,
  useGetAvailableRolesQuery,
  useGetUserRoleMappingByIdQuery,
  useLazyGetUserRoleMappingByIdQuery,
} = userRoleApiService;
