export const moduleMgmt = {
  get: () => "/api/v1/master/modules",
  getById : (moduleIdentity: string) => `/api/v1/master/modules/${moduleIdentity}`,
  save: () => "/api/v1/master/modules",
  update: (moduleIdentity: string) => `/api/v1/master/modules/${moduleIdentity}`,
  delete: (moduleIdentity: string) => `/api/v1/master/modules/${moduleIdentity}`,
};