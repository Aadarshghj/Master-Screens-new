export const designation = {
  save: () => "/api/v1/master/designation",
  get: () => "/api/v1/master/designations",
  delete: (id: string) => `/api/v1/master/designation/${id}`,
};
