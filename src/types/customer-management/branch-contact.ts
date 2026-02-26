export interface BranchContactData {
  value: string;
  channel: string;
  branchId: string;
  remarks: string;
  isPrimary: boolean;
  identity: string;
  branchIdentity?: string;
}
export interface BranchContactFormData {
  branch: string;
  channel: string;
  value: string;
  isPrimary: boolean;
  remarks: string;
}

export interface BranchData {
  branchId: number;
  tenantId: number;
  branchCode: string;
  branchName: string;
  branchShortName: string;
  branchTypeId: number;
  statusId: number;
  parentBranchId: number;
  adminUnitType: string;
  parentAdminCode: string;
  locationCode: string;
  openingDate: string;
  closingDate: string | null;
  dateOfShift: string | null;
  categoryId: number;
  sizeId: number;
  numExtensionCounters: number;
  isMainBranchInLocation: boolean;
  linkServiceMainBranchId: string | null;
  isSplitPremises: boolean;
  numSplitPremises: string | null;
  localClearingMember: boolean;
  nationalClearingMember: boolean;
  highValueClearingMember: boolean;
  numOfficersAvailable: number;
  micrCode: string;
  ifscCode: string;
  swiftBicCode: string;
  bsrCode: string;
  clearingBasedOnMicr: boolean;
  cashMgmtBranch: boolean;
  rtgsDepEnabled: boolean;
  authDealForex: boolean;
  authForeignCurrencyDeposit: boolean;
  ddIssueAllowed: boolean;
  ttIssueAllowed: boolean;
  baseCurrencyCode: string;
  authDealerCode: string;
  tbaMainKey: string;
  regDirectoryCode: string;
  dedicatedIssueOperations: string | null;
  doorNumber: string;
  addressLine1: string;
  addressLine2: string;
  landmark: string;
  placeName: string;
  postOfficeId: number;
  cityId: number;
  districtId: number;
  stateId: number;
  countryId: number;
  pincodeId: number;
  pincode: string | null;
  latitude: number;
  longitude: number;
  timezone: string;
  identity: string;
  stateDto: {
    stateId: number;
    state: string;
    isActive: boolean;
    identity: string;
  };
  branchTypeDto: {
    branchTypeId: number;
    code: string;
    name: string;
    description: string;
    isActive: boolean;
    identity: string;
  };
  statusDto: string | null;
  postOfficesDto: {
    postOfficeId: number;
    pincode: string | null;
    officeName: string;
    officeType: string;
    deliveryStatus: string;
    taluk: string | null;
    region: string;
    division: string;
    latitude: number;
    longitude: number;
    identity: string;
  };
  countryDto: {
    countryId: number;
    country: string;
    isActive: boolean;
    identity: string;
  };
  districtDto: {
    districtId: number;
    district: string;
    isActive: boolean;
    identity: string;
  };
  citiesDto: {
    cityId: number;
    city: string;
    isActive: boolean;
    identity: string;
  };
}
