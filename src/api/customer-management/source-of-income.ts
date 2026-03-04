export const sourceOfIncome = {
  save: () => "/api/v1/master/source-of-income",
  get: () => "/api/v1/master/source-of-income",
  delete: (identity: string) => `/api/v1/master/${identity}/source-of-income`,
};
