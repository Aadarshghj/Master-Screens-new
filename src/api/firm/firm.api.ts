export const firm = {
  // Search firms
  searchFirm: () => "/api/v1/firms/search",

  // Firm CRUD operations
  createFirm: () => "/api/v1/firms",
  getFirmById: ({ firmId }: { firmId: string }) => `/api/v1/firms/${firmId}`,
  updateFirm: ({ firmId }: { firmId: string }) => `/api/v1/firms/${firmId}`,
  deleteFirm: ({ firmId }: { firmId: string }) => `/api/v1/firms/${firmId}`,

  // Firm details
  getFirmDetails: ({ firmId }: { firmId: string }) => `/api/v1/firms/${firmId}`,
  updateFirmDetails: ({ firmId }: { firmId: string }) =>
    `/api/v1/firms/${firmId}`,

  // Firm Status
  updateFirmStatus: ({ firmIdentity }: { firmIdentity: string }) =>
    `/api/v1/firms/${firmIdentity}/status`,

  // Associated persons
  getAssociatedPersons: ({ firmId }: { firmId: string }) =>
    `/api/v1/firms/${firmId}/associated-persons`,
  addAssociatedPerson: ({ firmId }: { firmId: string }) =>
    `/api/v1/firms/${firmId}/associated-persons`,
  updateAssociatedPerson: ({
    firmId,
    personId,
  }: {
    firmId: string;
    personId: string;
  }) => `/api/v1/firms/${firmId}/associated-persons/${personId}`,
  removeAssociatedPerson: ({
    firmId,
    personId,
  }: {
    firmId: string;
    personId: string;
  }) => `/api/v1/firms/${firmId}/associated-persons/${personId}`,

  // Bank Verification
  verifyBankAccount: () => "/ext/bank/account/verify",
  // verifyUpiId: () => "/ext/ekyc/upi/matching",
  verifyUpiId: (queryParams?: string) =>
    `/ext/ekyc/upi/matching${queryParams ?? ""}`,
  // IFSC Data
  getIfscData: ({ ifsc }: { ifsc: string }) =>
    `/api/v1/master/ifsc-codes/${ifsc}`,

  // Account Types and Statuses
  getAccountTypes: () => "/api/v1/master/account-types",
  getAccountStatuses: () => "/api/v1/master/account-statuses",

  // Business Information
  getBusinessInfo: ({ customerIdentity }: { customerIdentity: string }) =>
    `/api/v1/firms/${customerIdentity}/firm-business-info`,
  saveBusinessInfo: ({ firmId }: { firmId: string }) =>
    `/api/v1/firms/${firmId}/firm-business-info`,
  updateBusinessInfo: ({ firmId }: { firmId: string }) =>
    `/api/v1/firms/${firmId}/firm-business-info`,
  deleteBusinessInfo: ({ firmId }: { firmId: string }) =>
    `/api/v1/firms/${firmId}/firm-business-info`,

  // Firm Photos
  getFirmPhotos: ({ customerId }: { customerId: string }) =>
    `/api/v1/customers/${customerId}/firm-photos`,
  uploadFirmPhoto: ({ customerId }: { customerId: string }) =>
    `/api/v1/customers/${customerId}/firm-photo`,

  // KYC Documents
  getKycDocuments: ({ customerId }: { customerId: string }) =>
    `/api/v1/customers/${customerId}/getKyc`,
  uploadKycDocument: ({ customerId }: { customerId: string }) =>
    `/api/v1/customers/${customerId}/addKyc`,

  // DMS Upload
  uploadFirmPhotoToDMS: ({ customerId }: { customerId: string }) =>
    `/api/v1/dms/upload/customers/${customerId}/firm-photos`,
  uploadKycDocumentToDMS: ({ customerId }: { customerId: string }) =>
    `/api/v1/dms/upload/customers/${customerId}/kyc-documents`,

  // DMS File View
  getDMSFileView: () => "/api/v1/dms/file/view",

  // OTP Services
  sendOtp: () => "/api/v1/otp/send",

  // Firm Address
  saveFirmAddress: ({ firmId }: { firmId: string }) =>
    `/api/v1/firm/${firmId}/address`,
  updateFirmAddress: ({
    firmId,
    addressId,
  }: {
    firmId: string;
    addressId: string;
  }) => `/api/v1/firm/${firmId}/address/${addressId}`,
  getFirmAddresses: ({ firmId }: { firmId: string }) =>
    `/api/v1/firm/${firmId}/addresses`,
  deleteFirmAddress: ({
    firmId,
    addressId,
  }: {
    firmId: string;
    addressId: string;
  }) => `/api/v1/firm/${firmId}/address/${addressId}`,
  getFirmPincodeDetails: ({ pincode }: { pincode: string }) =>
    `/api/v1/master/pincodes/${pincode}`,

  // Customer Address (for firm use)
  getCustomerAddresses: ({ customerId }: { customerId: string }) =>
    `/api/v1/customers/${customerId}/addresses`,
  createCustomerAddress: ({ customerId }: { customerId: string }) =>
    `/api/v1/customers/${customerId}/addresses`,
  updateCustomerAddress: ({
    customerId,
    addressId,
  }: {
    customerId: string;
    addressId: string;
  }) => `/api/v1/customers/${customerId}/addresses/${addressId}`,
  deleteCustomerAddress: ({
    customerId,
    addressId,
  }: {
    customerId: string;
    addressId: string;
  }) => `/api/v1/customers/${customerId}/addresses/${addressId}`,
};
