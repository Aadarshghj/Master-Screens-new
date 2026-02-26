export const userReg = {
  save: () => "/api/v1/users/",
  get: () => "/api/v1/users",
  delete: (identity: string) => `/api/v1/users/${identity}`,
  update: (identity: string) => `/api/v1/users/${identity}`,
  getById: (identity: string) => `/api/v1/users/${identity}`,
  search: (params: {
  userCode?: string;
  userName?: string;
  page?: number;
}) =>
  `/api/v1/users/search?userCode=${params.userCode ?? ""}&userName=${params.userName ?? ""}&page=${params.page ?? 0}`,
};