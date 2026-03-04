export const loanStepper = {
  // Loan Product Scheme APIs
  createLoanScheme: () => "/api/v1/master/loan-schemes",
  updateLoanScheme: ({ schemeId }: { schemeId: string }) =>
    `/api/v1/master/loan-schemes/${schemeId}`,
  getLoanSchemes: () => "/api/v1/loan/schemes",
  getLoanSchemeById: ({ schemeId }: { schemeId: string }) =>
    `/api/v1/master/loan-schemes/${schemeId}`,
  searchLoanSchemes: () => "/api/v1/master/loan-schemes/search",
  deleteLoanScheme: ({ schemeId }: { schemeId: string }) =>
    `/api/v1/loan/schemes/${schemeId}`,
  getLoanSchemeStatusApprovals: ({ schemeId }: { schemeId: string }) =>
    `/api/v1/master/loan-schemes/${schemeId}/status`,

  // Loan Scheme Attribute Values APIs
  getLoanSchemeAttributeValues: ({
    schemeIdentity,
  }: {
    schemeIdentity: string;
  }) => `/api/v1/master/loan-schemes/${schemeIdentity}/attribute-values`,
  createLoanSchemeAttributeValues: ({
    schemeIdentity,
  }: {
    schemeIdentity: string;
  }) => `/api/v1/master/loan-schemes/${schemeIdentity}/attribute-values`,
  updateLoanSchemeAttributeValues: ({
    schemeIdentity,
  }: {
    schemeIdentity: string;
  }) => `/api/v1/master/loan-schemes/${schemeIdentity}/attribute-values`,

  // Loan Scheme Property Values APIs
  getLoanSchemePropertyValues: ({
    schemeIdentity,
  }: {
    schemeIdentity: string;
  }) => `/api/v1/master/loan-schemes/${schemeIdentity}/property-values`,
  createLoanSchemePropertyValues: ({
    schemeIdentity,
  }: {
    schemeIdentity: string;
  }) => `/api/v1/master/loan-schemes/${schemeIdentity}/property-values`,
  updateLoanSchemePropertyValues: ({
    schemeIdentity,
  }: {
    schemeIdentity: string;
  }) => `/api/v1/master/loan-schemes/${schemeIdentity}/property-values`,

  // GL Accounts API
  getGLAccounts: ({ search }: { search?: string } = {}) =>
    `/api/v1/master/gl-accounts/get-gl/level-four${search ? `?search=${search}` : ""}`,

  // LTV On API
  getLTVOnOptions: () => "/api/v1/master/loan-schemes/ltv-on",

  // LTV Slabs API
  createLTVSlabs: ({ schemeId }: { schemeId: string }) =>
    `/api/v1/master/loan-schemes/${schemeId}/ltv-slabs`,
  getLTVSlabs: ({ schemeId }: { schemeId: string }) =>
    `/api/v1/master/loan-schemes/${schemeId}/ltv-slabs`,
  updateLTVSlab: ({ schemeId, slabId }: { schemeId: string; slabId: string }) =>
    `/api/v1/master/loan-schemes/${schemeId}/ltv-slabs/${slabId}`,
  deleteLTVSlab: ({ schemeId, slabId }: { schemeId: string; slabId: string }) =>
    `/api/v1/master/loan-schemes/${schemeId}/ltv-slabs/${slabId}`,

  // Interest Slabs API
  createInterestSlab: ({ schemeId }: { schemeId: string }) =>
    `/api/v1/master/loan-schemes/${schemeId}/interest-slabs`,
  getInterestSlab: ({
    schemeId,
    slabId,
  }: {
    schemeId: string;
    slabId: string;
  }) => `/api/v1/master/loan-schemes/${schemeId}/interest-slabs/${slabId}`,
  getInterestSlabs: ({ schemeId }: { schemeId: string }) =>
    `/api/v1/master/loan-schemes/${schemeId}/interest-slabs`,
  updateInterestSlab: ({
    schemeId,
    slabId,
  }: {
    schemeId: string;
    slabId: string;
  }) => `/api/v1/master/loan-schemes/${schemeId}/interest-slabs/${slabId}`,
  deleteInterestSlab: () =>
    "/api/v1/master/loan-schemes/{schemeIdentity}/interest-slabs/{slabIdentity}",

  // GL Mappings API
  createGLMapping: ({ schemeId }: { schemeId: string }) =>
    `/api/v1/master/loan-schemes/${schemeId}/gl-mappings`,
  getGLMappings: ({ schemeId }: { schemeId: string }) =>
    `/api/v1/master/loan-schemes/${schemeId}/gl-mappings`,
  getGLMappingByType: ({
    schemeId,
    glTypeId,
  }: {
    schemeId: string;
    glTypeId: string;
  }) =>
    `/api/v1/master/loan-schemes/${schemeId}/gl-mappings/gl-type/${glTypeId}`,
  getGLTypes: () => "/api/v1/master/loan-schemes/gl-type/gl-mapping/active",
  getGLAccountsByType: ({ glTypeId }: { glTypeId: string }) =>
    `/api/v1/master/loan-schemes/gl-account/level-four/${glTypeId}`,

  updateGLMapping: ({
    schemeId,
    mappingId,
  }: {
    schemeId: string;
    mappingId: string;
  }) => `/api/v1/master/loan-schemes/${schemeId}/gl-mappings/${mappingId}`,
  deleteGLMapping: ({
    schemeId,
    mappingId,
  }: {
    schemeId: string;
    mappingId: string;
  }) => `/api/v1/master/loan-schemes/${schemeId}/gl-mappings/${mappingId}`,

  // Document Requirements API
  createDocumentRequirement: ({ schemeId }: { schemeId: string }) =>
    `/api/v1/master/loan-schemes/${schemeId}/document-requirements`,
  getDocumentRequirements: ({ schemeId }: { schemeId: string }) =>
    `/api/v1/master/loan-schemes/${schemeId}/document-requirements`,
  updateDocumentRequirement: ({
    schemeId,
    requirementId,
  }: {
    schemeId: string;
    requirementId: string;
  }) =>
    `/api/v1/master/loan-schemes/${schemeId}/document-requirements/${requirementId}`,
  deleteDocumentRequirement: ({
    schemeId,
    requirementId,
  }: {
    schemeId: string;
    requirementId: string;
  }) =>
    `/api/v1/master/loan-schemes/${schemeId}/document-requirements/${requirementId}`,
  getAcceptanceLevels: () =>
    "/api/v1/master/loan-schemes/document-requirements/acceptance-level",
  getDocuments: () => "/api/v1/master/loan-schemes/documents",

  // Business Rules API
  getMasterBusinessRules: () => "/api/v1/master/business-rules",
  createBusinessRule: ({ schemeId }: { schemeId: string }) =>
    `/api/v1/master/loan-schemes/${schemeId}/business-rules`,
  getBusinessRules: ({ schemeId }: { schemeId: string }) =>
    `/api/v1/master/loan-schemes/${schemeId}/business-rules`,
  getSchemeBusinessRules: ({
    schemeId,
    page = 0,
    size = 20,
  }: {
    schemeId: string;
    page?: number;
    size?: number;
  }) =>
    `/api/v1/master/scheme-business-rules?schemeIdentity=${schemeId}&page=${page}&size=${size}`,
  updateBusinessRule: ({
    schemeId,
    ruleId,
  }: {
    schemeId: string;
    ruleId: string;
  }) => `/api/v1/master/loan-schemes/${schemeId}/business-rules/${ruleId}`,
  deleteBusinessRule: ({
    schemeId,
    ruleId,
  }: {
    schemeId: string;
    ruleId: string;
  }) => `/api/v1/master/loan-schemes/${schemeId}/business-rule/${ruleId}`,

  // Recovery Priorities API
  createRecoveryPriorities: ({ schemeId }: { schemeId: string }) =>
    `/api/v1/master/loan-schemes/${schemeId}/recovery-priorities`,
  getRecoveryPriorities: ({ schemeId }: { schemeId: string }) =>
    `/api/v1/master/loan-schemes/${schemeId}/recovery-priorities`,
  updateRecoveryPriorities: ({ schemeId }: { schemeId: string }) =>
    `/api/v1/master/loan-schemes/${schemeId}/recovery-priorities`,
  deleteRecoveryPriority: ({
    schemeId,
    priorityId,
  }: {
    schemeId: string;
    priorityId: string;
  }) =>
    `/api/v1/master/loan-schemes/${schemeId}/recovery-priorities/${priorityId}`,

  // Charge Slabs API
  createChargeSlab: ({ schemeId }: { schemeId: string }) =>
    `/api/v1/master/loan-schemes/${schemeId}/charge-slabs`,
  getChargeSlabs: ({
    schemeId,
    active,
  }: {
    schemeId: string;
    active?: boolean;
  }) =>
    `/api/v1/master/loan-schemes/${schemeId}/charge-slabs${active ? "?active=true" : ""}`,
  getSchemeChargeSlabs: ({
    schemeId,
    page = 0,
    size = 20,
  }: {
    schemeId: string;
    page?: number;
    size?: number;
  }) =>
    `/api/v1/master/loan-schemes/scheme-charge-slabs?schemeIdentity=${schemeId}&page=${page}&size=${size}`,
  updateChargeSlab: ({
    schemeId,
    slabId,
  }: {
    schemeId: string;
    slabId: string;
  }) => `/api/v1/master/loan-schemes/${schemeId}/charge-slabs/${slabId}`,
  deleteChargeSlab: ({
    schemeId,
    slabId,
  }: {
    schemeId: string;
    slabId: string;
  }) => `/api/v1/master/loan-schemes/${schemeId}/charge-slabs/${slabId}`,

  // Charge Slab Master Data APIs
  getCharges: () => "/api/v1/master/charges",
  getRateTypes: () => "/api/v1/master/rate-type",
  getChargeOnOptions: () => "/api/v1/master/calculation-bases",
};
