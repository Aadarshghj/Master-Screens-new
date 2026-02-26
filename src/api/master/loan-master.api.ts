// Master Data APIs
export const loanMaster = {
  getLoanProducts: () => "/api/v1/master/loan-products",
  getSchemeTypes: () => "/api/v1/master/scheme-types",
  getPeriodTypes: () => "/api/v1/master/period-types",
  getInterestTypes: () => "/api/v1/master/interest-types",
  getPenalInterestBases: () => "/api/v1/master/penal-interest-bases",
  getRebateBases: () => "/api/v1/master/rebate-bases",
  getDataTypes: () => "/api/v1/master/data-types",
  getAttributeStatus: () => "/api/v1/master/attribute-status",
};
