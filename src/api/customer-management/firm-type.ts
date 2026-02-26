export const firmType = {
  save: () => "/api/v1/master/firm-types",
  get: () => "/api/v1/master/firm-types",
  delete: (identity: string) => `/api/v1/master/firm-types/${identity}`,
};
