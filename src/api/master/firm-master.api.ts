export const firmMaster = {
  // Firm Types
  getFirmTypes: () => "/api/v1/master/firm-types",

  // Firm Roles
  getFirmRoles: () => "/api/v1/master/firm-roles",

  // Product/Industry Category
  getIndustryCategories: () => "/api/v1/master/industry_category",

  // Photo Caption
  getPhotoCaptions: () => "/api/v1/master/photo-caption",

  // Sectoral Performance
  getSectoralPerformances: () => "/api/v1/master/sectoral-performances",

  // Site Premises
  getSitePremises: () => "/api/v1/master/site-premises",

  // Seasonality
  getSeasonality: () => "/api/v1/master/seasonality",

  // Source of Income
  getSourceOfIncome: () => "/api/v1/master/source-of-income",

  // Canvassed Types
  getCanvassedTypes: () => "/api/v1/master/canvassed-types",

  // Account Types
  getAccountTypes: () => "/api/v1/master/account-types",

  // Account Statuses
  getAccountStatuses: () => "/api/v1/master/account-statuses",

  // Bank Verification
  verifyBankAccount: () => "/ext/bank/account/verify",
  // verifyUpiId: () => "/ext/ekyc/upi/matching",
  verifyUpiId: (queryParams?: string) =>
    `/ext/ekyc/upi/matching${queryParams ?? ""}`,
  // IFSC Data
  getIfscData: ({ ifsc }: { ifsc: string }) =>
    `/api/v1/master/ifsc-codes/${ifsc}`,

  // Bank Accounts
  // Bank Accounts - FIX: Use consistent parameter name
  getBankAccounts: ({ customerId }: { customerId: string }) =>
    `/api/v1/customers/${customerId}/bank-accounts/active`,

  // FIX: Change FirmId to customerId for consistency
  createBankAccount: ({ customerId }: { customerId: string }) =>
    `/api/v1/customers/${customerId}/bank-accounts`,
};
