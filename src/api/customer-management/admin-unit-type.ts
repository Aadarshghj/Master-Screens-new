export const adminUnitType = {
  get: () => "/api/v1/master/admin-unit-type",
  getById : (adminUnitTypeIdentity: string) => `/api/v1/master/admin-unit-type/${adminUnitTypeIdentity}`,
  save: () => "/api/v1/master/admin-unit-type",
  update: (identity: string) => `/api/v1/master/admin-unit-type/${identity}`,
  delete: (adminUnitTypeIdentity: string) => `/api/v1/master/admin-unit-type/${adminUnitTypeIdentity}`,
};