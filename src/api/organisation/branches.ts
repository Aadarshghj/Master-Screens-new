export const branches = {
  getAll: () => "/api/v1/master/branches",
  getById: (id: string) => `/api/v1/master/${id}/branches`,
  getByCode: (code: string) => `/api/v1/master/branches/code/${code}`,
  search: (params: { branchName?: string; branchCode?: string }) => {
    const query = new URLSearchParams();
    if (params.branchName) query.append("branchName", params.branchName);
    if (params.branchCode) query.append("branchCode", params.branchCode);
    return `/api/v1/master/branches/search?${query.toString()}`;
  },
  save: () => "/api/v1/master/branches",
  update: (id: string) => `/api/v1/master/${id}/branches`,
  delete: (id: string) => `/api/v1/master/${id}/branches`,
  getStatus: () => "/api/v1/master/branch-status",
  getStatusById: (id: string) => `/api/v1/master/branch-status/${id}`,
  getCategory: () => "/api/v1/master/branch-category",
  getBranchTypes: () => "/api/v1/master/branch-type",
  getParent: (adminUnitTypeIdentity: string) =>
    `/api/v1/master/${adminUnitTypeIdentity}/parent`,
  getTimezones: () => "/api/v1/master/timezones",
  getTimezoneById: (id: string) => `/api/v1/master/timezones/${id}`,
  getPermissionTypes: () => "/api/v1/master/permission-types",
  getNextBranchCode: () => "/api/v1/master/branches/next-code",
};
