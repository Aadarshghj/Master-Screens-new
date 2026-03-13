export const loanSchemeType = {
  save: () => "/api/v1/master/scheme-types",
  get: () => "/api/v1/master/scheme-types",
  delete: (id: string) => `/api/v1/master/scheme-types/${id}`,
  update: (id: string) => `/api/v1/master/scheme-types/${id}`,
};
