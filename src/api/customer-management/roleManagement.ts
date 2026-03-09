export const roleManagement = {
  save: () => "/api/v1/user-roles-management/role",
  get: () => "/api/v1/users/role",
 
  getById: (identity: string) => `/api/v1/users/role/${identity}`,
};
