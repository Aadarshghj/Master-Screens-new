export const menuModuleMapping = {
  save: () => "/api/v1/master/menu-module-mapping",
  get: () => "/api/v1/master/menu-module-mapping",
  delete: (id: string) => `/api/v1/master/menu-module-mapping/${id}`,
  update: (id: string) => `/api/v1/master/menu-module-mapping/${id}`,
};
export const menuDetails = {
  get: () => "/api/v1/master/menu-details",
};
export const modules = {
  get: () => "/api/v1/master/modules",
};