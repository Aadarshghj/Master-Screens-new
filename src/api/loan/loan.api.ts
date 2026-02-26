export const loan = {
  getLoanSchemeAttributes: () => "/api/v1/master/loan/scheme-attributes",
  saveLoanSchemeAttribute: () => "/api/v1/master/loan-scheme-attributes",
  updateLoanSchemeAttribute: ({ attributeId }: { attributeId: string }) =>
    `/api/v1/master/loan-scheme-attributes/${attributeId}`,
  deleteLoanSchemeAttribute: ({ attributeId }: { attributeId: string }) =>
    `/api/v1/master/loan-scheme-attributes/${attributeId}`,
  getLoanSchemeAttributeById: ({ attributeId }: { attributeId: string }) =>
    `/api/v1/master/loan-scheme-attributes/${attributeId}`,
  searchLoanSchemeAttributes: () => "/api/v1/master/loan-scheme-attributes",
  getLoanProducts: () => "/api/v1/master/loan-products",
  getDataTypes: () => "/api/v1/master/data-types",
  getLoanSchemeProperties: () => "/loan/scheme-properties",
  saveLoanSchemeProperty: () => "/api/v1/master/loan-scheme-properties",
  updateLoanSchemeProperty: ({ propertyId }: { propertyId: string }) =>
    `/api/v1/master/loan-scheme-properties/${propertyId}`,
  deleteLoanSchemeProperty: ({ propertyId }: { propertyId: string }) =>
    `/api/v1/master/loan-scheme-properties/${propertyId}`,
  searchLoanSchemeProperties: () =>
    "/api/v1/master/loan-scheme-properties/search",
  getGLAccountTypes: () => "/api/v1/master/loan-schemes/gl-type/gl-mapping",
  saveGLAccountType: () => "/api/v1/master/loan-schemes/gl-type/gl-mapping",
  updateGLAccountType: ({ glAccountTypeId }: { glAccountTypeId: string }) =>
    `/loan/gl-account-types/${glAccountTypeId}`,
  deleteGLAccountType: ({ glAccountTypeId }: { glAccountTypeId: string }) =>
    `/loan/gl-account-types/${glAccountTypeId}`,
  searchGLAccountTypes: () => "/api/v1/master/loan-schemes/gl-type/gl-mapping",
  searchGLAccountsThree: () => "/api/v1/master/gl-accounts/get-gl/level-three",
  getGLCategories: () => "/loan/masters/gl-categories",
  getGLAccountTypesOptions: () => "/loan/masters/gl-account-types",
  getLoanBusinessRules: () => "/loan/business-rules",
  saveLoanBusinessRule: () => "/api/v1/master/business-rules",
  updateLoanBusinessRule: ({ ruleId }: { ruleId: string }) =>
    `/api/v1/master/business-rules/${ruleId}`,
  deleteLoanBusinessRule: ({ ruleId }: { ruleId: string }) =>
    `/api/v1/master/business-rules/${ruleId}`,
  searchLoanBusinessRules: () => "/api/v1/master/business-rules/search",
  getLoanBusinessRuleById: ({ ruleId }: { ruleId: string }) =>
    `/api/v1/master/business-rules/${ruleId}`,
  getRuleCategories: () => "/api/v1/master/rule-categories",
  searchBusinessRules: () => "/api/v1/master/rule-categories",
  getChargeDetails: () => "/api/v1/master/charge-details",
  saveChargeDetails: () => "/api/v1/master/charge-details",
  updateChargeDetails: ({ chargeId }: { chargeId: string }) =>
    `/api/v1/master/charge-details/${chargeId}`,
  deleteChargeDetails: ({ chargeId }: { chargeId: string }) =>
    `/api/v1/master/charge-details/${chargeId}`,
  getCalculationBase: () => "/api/v1/master/calculation-bases",
  getCalculationType: () => "/api/v1/master/calculation-types",
  getChargeSlabGLAccount: () => "/api/v1/master/month-amount-types", // test
  getCalculationCriteria: () => "/api/v1/master/calculation-criteria",
  getMonthAmountTypes: () => "/api/v1/master/month-amount-types",
  getModules: () => "/api/v1/master/modules",
  getSubModulesByModule: ({ moduleId }: { moduleId: string }) =>
    `/api/v1/master/sub-module?moduleIdentity=${moduleId}`,
  searchGLAccountsLevelFour: ({ search }: { search?: string } = {}) =>
    `/api/v1/master/gl-accounts/get-gl/level-four${search ? `?search=${search}` : ""}`,
  searchChargeDetails: () => "/api/v1/master/charges/search",
  getChargeDetailsById: ({ chargeId }: { chargeId: string }) =>
    `/api/v1/master/charge-details/${chargeId}`,
  saveChargeMasterConfiguration: () => "/api/v1/master/charge-details",
  saveChargeMaster: () => "/api/v1/master/charges",
  getZones: () => "/api/v1/master/zones",
  getStateZoneConfig: () => "/api/v1/master/state-zone-config",
  getTaxTreatments: () => "/api/v1/master/tax-treatments",
  getSingleTaxMethods: () => "/api/v1/master/single-tax-methods",
};
