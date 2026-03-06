export const subModule = {
  save: () => "/api/v1/master/sub-modules",
  get: () => "/api/v1/master/sub-module",

  delete: (identity: string) => `/api/v1/master/sub-modules/${identity}`,
  put: (identity: string) => `/api/v1/master/sub-modules/${identity}`,
};

export const moduleApi = {
  getAll: () => "/api/v1/master/modules",
};
