export const customer = {
  maskAadhar: () => "/ext/ekyc/masking",
  vaultMask: ({ maskuid }: { maskuid: string }) =>
    `/ext/vault/maskuid?uid=${maskuid}`, // New vault API endpoint with query param
  aadharOtpSend: ({ aadhaarNumber }: { aadhaarNumber: string }) =>
    `/api/v1/otp/send?aadhaarNumber=${aadhaarNumber}`,
  aadharOtpValidate: () => "/ext/ekyc/otp",
  aadharOtpVerify: ({
    initiationTransactionId,
    otp,
  }: {
    initiationTransactionId: string;
    otp: string;
  }) =>
    `/ext/ekyc/otp/verify?initiationTransactionId=${initiationTransactionId}&otp=${otp}`,

  upiMatching: () => "/ext/ekyc/upi/matching",
  nameMatching: () => "/ext/ekyc/name/matching",
  validateKyc: ({
    idNumber,
    kycId,
    dob,
  }: {
    idNumber: string;
    kycId: number;
    dob?: string;
  }) => {
    const dobParam = dob ? `&dob=${dob}` : "";
    return `/ext/ekyc/validate/kyc?idNumber=${idNumber}&kycId=${kycId}${dobParam}`;
  },

  getKycData: () => "/api/kyc-data",
  getKyc: ({ customerId }: { customerId: string }) =>
    `/api/v1/customers/${customerId}/getKyc`,
  getCkycData: () => "/api/ckyc-data",
  getCustomerData: () => "/api/customer-data",
  getDocumentTypes: () => "/api/v1/master/document-types",
  submitKyc: () => "/api/v1/customers/addKyc",
  updateKyc: ({ customerId }: { customerId: string }) =>
    `/api/v1/customers/${customerId}/addKyc`,
  deleteKyc: ({ customerId, kycId }: { customerId: string; kycId: string }) =>
    `/api/v1/customers/${customerId}/${kycId}/deleteKyc`,

  imageVerify: () => "/ext/forensic/image/verify",
  livenessCheck: () => "/ext/forensic/image/liveness",
  getUploadedPhotos: () => "/ext/ekyc/photo/documents",
  photoAccuracy: ({ queryParams }: { queryParams: string }) =>
    `/customer/photo/accuracy${queryParams}`,
  livenessDetection: ({ queryParams }: { queryParams: string }) =>
    `/customer/photo/liveness-detection${queryParams}`,
  getPhotoById: ({ customerId }: { customerId: string }) =>
    `/api/v1/customers/${customerId}/photo`,
  savePhoto: ({ customerId }: { customerId: string }) =>
    `/api/v1/customers/${customerId}/photo`,
  deletePhoto: ({
    customerId,
    photoIdentity,
  }: {
    customerId: string;
    photoIdentity: string;
  }) => `/api/v1/customers/${customerId}/photo/${photoIdentity}/delete`,

  // Search endpoints
  searchCkyc: () => "/api/ckyc/search",
  searchCustomer: () => "/api/v1/customers/search",

  // basic information
  createBasic: () => "/api/v1/customers/basic",
  getBasic: () => "/api/v1/customers/basicinfo",
  getBasicById: ({ customerId }: { customerId: string }) =>
    `/api/v1/customers/${customerId}/basic`,
  updateBasic: ({ customerId }: { customerId: string }) =>
    `/api/v1/customers/${customerId}/basic`,
  getBasicInfoConfig: () => "/api/basic-info-config",

  getNotificationPreferences: ({ customerId }: { customerId: string }) =>
    `/api/v1/customers/${customerId}/notification-preferences`,
  setNotificationPreferences: ({ customerId }: { customerId: string }) =>
    `/api/v1/customers/${customerId}/notification-preferences`,
  createNotificationPreferences: ({ customerId }: { customerId: string }) =>
    `/api/v1/customers/${customerId}/notification-preferences`,

  // contacts
  getContacts: ({ customerId }: { customerId: string }) =>
    `/api/v1/customers/${customerId}/contacts`,
  createContact: ({ customerId }: { customerId: string }) =>
    `/api/v1/customers/${customerId}/contacts`,
  updateContact: ({
    customerId,
    contactId,
  }: {
    customerId: string;
    contactId: string;
  }) => `/api/v1/customers/${customerId}/contacts/${contactId}`,
  sendOtp: () => "/api/v1/otp/send",
  verifyOtp: ({ requestId }: { requestId: string }) =>
    `/api/v1/otp/${requestId}/verify`,

  // additional info
  getAdditionalInfo: ({ customerId }: { customerId: string }) =>
    `/api/v1/customers/${customerId}/additional`,

  updateAdditionalInfo: ({ customerId }: { customerId: string }) =>
    `/api/v1/customers/${customerId}/additional`,
  addressVerification: () => "/api/v1/customers/verification/additional",
  // addresses
  getAddressesId: ({ customerId }: { customerId: string }) =>
    `/api/v1/customers/${customerId}/addresses`,
  getCustomerAddress: ({ customerId }: { customerId: string }) =>
    `/api/v1/customers/${customerId}/addresses`,
  getUploadedAddressDocuments: ({ customerId }: { customerId: string }) =>
    `/api/v1/customers/${customerId}/documents`,
  createAddress: ({ customerId }: { customerId: string }) =>
    `/api/v1/customers/${customerId}/addresses`,
  createPermanantAddressTrue: ({ customerId }: { customerId: string }) =>
    `/api/v1/customers/${customerId}/addresses`,
  proofValidation: ({ queryParams }: { queryParams: string }) =>
    `/api/v1/customers/${queryParams}/addresses`,
  geolocationAccuracy: ({ queryParams }: { queryParams: string }) =>
    `/api/v1/address/geolocation-accuracy${queryParams}`,
  updateAddress: ({
    customerId,
    addressId,
  }: {
    customerId: string;
    addressId: string;
  }) => `/api/v1/customers/${customerId}/addresses/${addressId}`,
  deleteAddress: ({
    customerId,
    addressId,
  }: {
    customerId: string;
    addressId: string;
  }) => `/api/v1/customers/${customerId}/addresses/${addressId}`,
  getAddressOptions: () => "/api/v1/master/address-types",

  // Bank Accounts
  getBankAccounts: ({ customerId }: { customerId: string }) =>
    `/api/v1/customers/${customerId}/bank-accounts/active`,
  createBankAccount: ({ customerId }: { customerId: string }) =>
    `/api/v1/customers/${customerId}/bank-accounts`,
  verifyBankAccount: () => "/ext/bank/account/verify",
  verifyUpiId: ({ queryParams }: { queryParams: string }) =>
    `/ext/ekyc/upi/matching${queryParams}`,
  getBankAccountConfig: () => "/customer/bank-account/config",
  checkDuplicateBankAccount: ({ accountNumber }: { accountNumber: string }) =>
    `/api/v1/customers/bank-accounts/check-duplicate?accountNumber=${encodeURIComponent(accountNumber)}`,
  // nominees
  getNominees: ({ customerId }: { customerId: string }) =>
    `/api/v1/customers/${customerId}/nominees`,
  createNominee: ({ customerId }: { customerId: string }) =>
    `/api/v1/customers/${customerId}/nominees`,

  updateNominee: ({
    customerId,
    nomineeId,
  }: {
    customerId: string;
    nomineeId: string;
  }) => `/api/v1/customers/${customerId}/nominees/${nomineeId}`,

  deleteNominee: ({
    customerId,
    nomineeId,
  }: {
    customerId: string;
    nomineeId: string;
  }) => `/api/v1/customers/${customerId}/nominees/${nomineeId}`,

  getNomineeById: ({
    customerId,
    nomineeId,
  }: {
    customerId: string;
    nomineeId: string;
  }) => `/api/v1/customers/${customerId}/nominees/${nomineeId}`,

  getActiveNominees: ({ customerId }: { customerId: string }) =>
    `/api/v1/customers/${customerId}/nominees/active`,

  validateNomineeShare: ({ customerId }: { customerId: string }) =>
    `/api/v1/customers/${customerId}/nominees/validate-share`,

  // Additional & Optional endpoints
  getAdditionalOptional: ({ customerId }: { customerId: string }) =>
    `/api/v1/customers/${customerId}/additional`,
  saveAdditionalOptional: ({ customerId }: { customerId: string }) =>
    `/api/v1/customers/${customerId}/additional`,
  getAdditionalOptionalConfig: () => "/api/additional-optional-config",
  getMoreDetailsConfig: ({ customerId }: { customerId: string }) =>
    `/api/v1/customers/${customerId}/additional`,
  getAdditionalReferenceNames: ({
    tenantIdentity,
  }: {
    tenantIdentity: string;
  }) => `/api/v1/customers/${tenantIdentity}/additional-reference-names`,

  getForm60ById: ({ customerId }: { customerId: string }) =>
    `/api/v1/customers/${customerId}/form60`,
  createForm60: ({ customerId }: { customerId: string }) =>
    `/api/v1/customers/${customerId}/form60`,
  updateForm60: ({
    customerId,
    form60Id,
  }: {
    customerId: string;
    form60Id: string;
  }) => `/api/v1/customers/${customerId}/form60/${form60Id}`,
  getForm60History: ({ customerId }: { customerId: string }) =>
    `/api/v1/customers/${customerId}/form60/history`,

  downloadForm60: ({
    customerId,
    form60Id,
  }: {
    customerId: string;
    form60Id: string;
  }) => `/api/v1/customers/${customerId}/form60/${form60Id}/download`,
  previewForm60: ({
    customerId,
    form60Id,
  }: {
    customerId: string;
    form60Id: string;
  }) => `/api/v1/customers/${customerId}/form60/${form60Id}/preview`,
  uploadForm60: ({
    customerId,
    form60Id,
  }: {
    customerId: string;
    form60Id: string;
  }) => `/api/v1/customers/${customerId}/form60/${form60Id}/upload`,

  // Guardian search
  getGuardian: ({ customerCode }: { customerCode: string }) =>
    `/api/v1/customers/${customerCode}/guardian`,
  searchGuardian: ({ customerId }: { customerId: string }) =>
    `/api/v1/customers/${customerId}/guardian`,
  getGuardianById: ({ guardianId }: { guardianId: string }) =>
    `/api/v1/customers/${guardianId}/identity/guardian`,

  // Update promotional opt out
  updatePromotionalOptOut: ({ customerId }: { customerId: string }) =>
    `/api/v1/customers/${customerId}/promotional-opt-out`,

  // Get all customer details
  getAllDetails: ({ customerId }: { customerId: string }) =>
    `/api/v1/customers/${customerId}/allDetails`,

  // Canvasser search
  searchCanvasser: ({
    canvassedTypeId,
    canvasserName,
  }: {
    canvassedTypeId: string;
    canvasserName: string;
  }) => `/api/v1/customers/${canvassedTypeId}/${canvasserName}`,

  // Get canvasser details by ID
  getCanvasserById: ({
    canvassedTypeId,
    canvasserStaffId,
  }: {
    canvassedTypeId: string;
    canvasserStaffId: string;
  }) =>
    `/api/v1/customers/${canvassedTypeId}/${canvasserStaffId}/canvasser/name`,

  modifyCustomerStatus: ({ customerId }: { customerId: string }) =>
    `/api/v1/customers/${customerId}/status`,
};
