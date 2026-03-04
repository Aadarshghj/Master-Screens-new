export const purposes = {
  save: () => "/api/v1/master/purposes",
  get: () => "/api/v1/master/purpose",
  delete: (purposeId: string) => `/api/v1/master/purposes/${purposeId}`,
};
