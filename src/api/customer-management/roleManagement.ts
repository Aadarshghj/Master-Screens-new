export const roleManagement = {
  save: () => "/api/v1/users/role",
  get: () => "/api/v1/users/role",
  delete: (identity: string) => `/api/v1/users/role/${identity}`,
  update: (identity: string) => `/api/v1/users/role/${identity}`,
  getById: (identity: string) => `/api/v1/users/role/${identity}`,
};
