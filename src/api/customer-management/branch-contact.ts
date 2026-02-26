export const branchContact = {
  save: () => "/api/v1/master/branch-contacts",
  get: () => "/api/v1/master/branch-contact",
  delete: (identity: string) => `/api/v1/master/${identity}/branch-contacts`,
  getBranches: () => "/api/v1/master/branches",
};
