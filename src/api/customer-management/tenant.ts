export const tenant = {
  save: () => "/api/v1/tenants/",
  get: () => "/api/v1/tenants",
  getById: (id: string) => `/api/v1/tenants/${id}`,
  delete: (id: string) => `/api/v1/tenants/${id}`,
  update: (id: string) => `/api/v1/tenants/${id}`,  
};
