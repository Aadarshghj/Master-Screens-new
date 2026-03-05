export const userReg = {
  save: () => "/api/v1/user-management/",
  get: () => `/api/v1/users`,
  delete: (identity: string) => `/api/v1/user-management/${identity}`,
  update: (identity: string) => `/api/v1/user-management/${identity}`,
  getById: (identity: string) => `/api/v1/user-management/${identity}`,
//   search: (params: {
//   userCode?: string;
//   userName?: string;
//   page?: number;
// }) =>
//   `/api/v1/users/search?userCode=${params.userCode ?? ""}&userName=${params.userName ?? ""}&page=${params.page ?? 0}`,
};
// http://localhost:8090/api/v1/users/60e45b4c-6df3-4266-a139-cd034d826b0c