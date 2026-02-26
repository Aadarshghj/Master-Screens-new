export const UserRoleMaster = {
  save: () => "/api/v1/users/user-role",
  get: () => "/api/v1/users",
  getAssignedRoles: () => "/api/v1/users/user-role",
  GetById: (identity: string) => `/api/v1/users/user-role/${identity}`,
  UpdateById: (identity: string) => `/api/v1/users/user-role/${identity}`,
  Delete: (identity: string) => `/api/v1/users/user-role/${identity}`,
  getPermissions: () => "/api/v1/master/permission-types",
  getAvailableRoles: () => "/api/v1/users/role",
};
