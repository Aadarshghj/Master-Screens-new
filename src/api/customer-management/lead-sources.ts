export const leadSources = {
  save: () => "/api/v1/master/lead-sources",
  get: () => "/api/v1/master/lead-sources",
  delete: (id: string) => `/api/v1/master/lead-sources/${id}`,
};
