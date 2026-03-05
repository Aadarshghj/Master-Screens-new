export const UserRoleMaster = {
  save: () => "/api/v1/user-roles-management/user-roles",
  // get: () => "/api/v1/users",
  get: () => `/api/v1/user-management/users/all?page=${0}&size=${20}`,
  getAssignedRoles: () => "/api/v1/users/user-role",
  GetById: (identity: string) => `/api/v1/users/user-role/${identity}`,
  UpdateById: (identity: string) => `/api/v1/users/user-role/${identity}`,
  Delete: (userId: string, roleId: string) =>
    `/api/v1/user-roles-management/users/${userId}/roles/${roleId}`,
  getPermissions: () => "/api/v1/master/permission-types",
  getAvailableRoles: () => "/api/v1/users/role",
};
