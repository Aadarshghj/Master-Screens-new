export const firmRole = {
  save: () => "/api/v1/master/firm-role",
  get: () => "/api/v1/master/firm-roles",
  delete: (identity: string) => `/api/v1/master/${identity}/firm-role`,
};
