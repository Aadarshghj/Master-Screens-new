export const designationRoleMapping = {
  getAll: () => "/api/v1/master/designation-role-mapping",
  getRoles: () => "/api/v1/users/role",
  getPermission: () => "/api/v1/master/permission-types",

  getById: (identity: string) =>
    `/api/v1/master/designation-role-mapping/${identity}`,

  save: () => "/api/v1/master/designation-role-mapping",

  update: (identity: string) =>
    `/api/v1/master/designation-role-mapping/${identity}`,

  delete: (identity: string) =>
    `/api/v1/master/designation-role-mapping/${identity}`,
};
