export const riskCategories = {
  save: () => "/api/v1/master/risk-categories",
  get: () => "/api/v1/master/risk-category",
  delete: (riskCatId: string) => `/api/v1/master/risk-categories/${riskCatId}`,
};
