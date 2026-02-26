export const bank = {
  save: () => "/api/v1/master/bank",
  get: () => "/api/v1/master/banks",
  getCountries: () => "/api/v1/master/countries",
  delete: (id: string) => `/api/v1/master/${id}/bank`,
};
