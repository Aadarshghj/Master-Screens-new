export const branchType = {
  save: () => "/api/v1/master/branch-type",
  getBranches: () => "/api/v1/master/branch-type",
  update: (branchTypeIdentity: string) => `/api/v1/master/branch-type/${branchTypeIdentity}`,
  getById: (branchTypeIdentity: string) => `/api/v1/master/branch-type/${branchTypeIdentity}`,
  delete: (branchTypeIdentity: string) => `/api/v1/master/branch-type/${branchTypeIdentity}`,
};
