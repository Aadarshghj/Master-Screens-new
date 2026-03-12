export const ornamentName = {
  get: () => "/api/v1/master/ornament-names",
  getById : (ornamentNameIdentity: string) => `/api/v1/master//ornament-names/${ornamentNameIdentity}`,
  save: () => "/api/v1/master/ornament-names",
  update: (identity: string) => `/api/v1/master/ornament-names/${identity}`,
  delete: (identity: string) => `/api/v1/master/ornament-names/${identity}`,
};

export const ornamentType = {
  getType: () => "/api/v1/master/ornament-types",
  getByTypeId: (identity:string) => `/api/v1/master/ornament-types/${identity}`
}