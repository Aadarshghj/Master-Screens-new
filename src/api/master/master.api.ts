export const master = {
  getSalutationTypes: () => "/api/v1/master/salutation-types",
  getGenders: () => "/api/v1/master/genders",
  getMaritalStatus: () => "/api/v1/master/marital-status",
  getTaxCategories: () => "/api/v1/master/tax-category",
  getCustomerStatuses: () => "/api/v1/master/customer-statuses",
  getNationalities: () => "/api/v1/master/nationalities",
  getOccupations: () => "/api/v1/master/occupations",
  getBranches: () => "/api/v1/master/branches",
  getLanguages: () => "/api/v1/master/languages",

  // Contact Information Dropdowns
  getContactTypes: () => "/api/v1/master/contact-types",
  getAddressTypes: () => {
    return "/api/v1/master/address-types?active=true&context=FIRM_REGISTRATION";
  },

  getAddressProofTypes: () => "/api/v1/master/address-proof-type",
  getRelationships: () => "/api/v1/master/relationships",

  // Additional Information Dropdowns
  getDesignations: () => "/api/v1/master/designations",
  getSourceOfIncome: () => "/api/v1/master/source-of-income",
  getResidentialStatuses: () => "/api/v1/master/residential-statuses",
  getAssetTypes: () => "/api/v1/master/asset-types",
  getBanks: () => "/api/v1/master/banks",
  getCanvassedTypes: () => "/api/v1/master/canvassed-types",
  getReferralSource: () => "/api/v1/master/referral_source",
  getEducationLevels: () => "/api/v1/master/education-level",
  getCustomerGroup: () => "/api/v1/master/customer-group",
  getRiskCategory: () => "/api/v1/master/risk-category",
  getCustomerCategory: () => "/api/v1/master/customer-category",
  getSitePremise: () => "/api/v1/master/site-premises",
  getEntityTypes: () => "/api/v1/master/entity-types",
  // PEP (Politically Exposed Person) Related
  getPepCategories: () => "/api/v1/master/pep-categories",
  getPepRelationships: () => "/api/v1/master/pep-relationships",
  getPepVerificationSource: () => "/api/v1/master/pep-verification-source",

  // Document and KYC Related
  getDocumentMaster: () => "/api/v1/master/document-master",
  getDocumentTypes: () => "/api/v1/master/document-types",
  getKycTypes: () => "/api/v1/master/document-types-usage",
  getDocumentTypesUsage: ({ context }: { context: string }) =>
    `/api/v1/master/document-types-usage?context=${context}`,
  // Account Related
  getAccountStatuses: () => "/api/v1/master/account-statuses",
  getAccountTypes: () => "/api/v1/master/account-types",

  // Other Master Data
  getPurpose: () => "/api/v1/master/purpose",
  getBranchContact: () => "/api/v1/master/branch-contact",
  getBranchWeekSchedule: () => "/api/v1/master/branch-week-schedule",

  // nominee
  getNomineeRelationships: () => "/api/v1/master/relationships",
  getGuardianRelationships: () => "/api/v1/master/guardian-relationships",

  getPostOffices: ({ pincode }: { pincode: string }) =>
    `/api/v1/master/pincodes/${pincode}`,
  getLocationByPincode: ({ pincode }: { pincode: string }) =>
    `/api/v1/master/pincodes/${pincode}`,

  getPincodeDetails: ({ pincode }: { pincode: string }) =>
    `/api/v1/master/pincodes/${pincode}`,

  getIfscData: ({ ifsc }: { ifsc: string }) =>
    `/api/v1/master/ifsc-codes/${ifsc}`,

  // Seasonality endpoint
  getSeasonality: () => "/api/v1/master/seasonality",

  // Slab Period Type endpoint
  getSlabPeriodType: () => "/api/v1/master/slab-period-type",
};
