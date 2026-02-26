export const customerCategory = {
  save: () => "/api/v1/master/customer-categories",
  get: () => "/api/v1/master/customer-category",
  delete: (identity: string) =>
    `/api/v1/master/customer-categories/${identity}`,
};
