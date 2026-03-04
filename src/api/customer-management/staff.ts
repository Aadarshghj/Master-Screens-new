export const staff = {
  save: () => "/api/v1/master/staff",
  get: () => "/api/v1/master/staff",
  delete: (identity: string) => `/api/v1/master/${identity}/staff`,
};
