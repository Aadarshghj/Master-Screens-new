export interface AdminUnitTypeDto {
  name: string;
  description: string;
  code: string;
  hierarchyLevel: number;
  identity: string;
  isActive: boolean;
}

export interface AdminUnitTypeOption {
  label: string;
  value: string;
  code: string;
  hierarchyLevel: number;
}

export interface BranchStatusDto {
  identity: string;
  branchStatusName: string;
  branchStatusCode: string;
  description: string;
  isActive: boolean;
}

export interface BranchCategoryDto {
  identity: string;
  branchCategoryName: string;
  branchCategoryCode: string;
  description: string;
  isActive: boolean;
}

export interface DropdownDto {
  identity: string;
  name: string;
  code?: string;
  description?: string;
  isActive?: boolean;
  languageName: string;
}

export interface ParentBranchDto {
  identity: string;
  branchName: string;
  branchCode: string;
}

export interface BranchResponseDto {
  identity: string;
  id:string;
  message: string;
  branchCode: string;
  branchName: string;
  branchShortName: string;
  branchStatusIdentity: string;
  adminUnitTypeIdentity: string;
  branchTypeIdentity: string;
  branchCategoryIdentity: string;
  parentBranchIdentity: string | null;
  parentBranchName: string | null;
  mergedToBranchIdentity: string | null;
  mergedToBranchName: string | null;
  registrationDate: string;
  openingDate: string;
  closingDate: string | null;
  dateOfShift: string | null;
  mergedOn: string | null;
  doorNumber: string;
  addressLine1: string;
  addressLine2: string;
  landmark: string;
  placeName: string;
  pincodeIdentity: string;
  pincode: string;
  stateIdentity: string;
  stateName: string;
  districtIdentity: string;
  districtName: string;
  postOfficeIdentity: string;
  postOffice: string;
  locationCode: string;
  parentAdminCode: string;
  micrCode: string;
  ifscCode: string;
  swiftBicCode: string;
  bsrCode: string;
  baseCurrency: string;
  isMainBranchInLocation: boolean;
  isSplitPremises: boolean;
  localClearingMember: boolean;
  nationalClearingMember: boolean;
  highValueClearingMember: boolean;
  timezone: string;
  isActive: boolean;
  longitude: number | null;
  latitude: number | null;
  language?: string;
  authDealerCode?: string;
  tbaMainKey?: string;
  regDirectoryCode?: string;
  sizeId?: number;
  numExtensionCounters?: number;
  linkServiceMainBranchId?: number;
  numSplitPremises?: number;
  numOfficersAvailable?: number;
  clearingBasedOnMicr?: boolean;
  cashMgmtBranch?: boolean;
  rtgsDepEnabled?: boolean;
  authDealForex?: boolean;
  authForeignCurrencyDeposit?: boolean;
  ddIssueAllowed?: boolean;
  ttIssueAllowed?: boolean;
  dedicatedIssueOperations?: string;
}

export interface BranchCreatePayload {
  branchCode: string;
  branchName: string;
  branchShortName: string;
  branchStatusIdentity: string;
  adminUnitTypeIdentity: string;
  branchTypeIdentity?: string;
  branchCategoryIdentity?: string;
  postOfficeIdentity?: string;
  parentBranchIdentity?: string | null;
  registrationDate: string;
  openingDate: string;
  closingDate?: string | null;
  dateOfShift?: string | null;
  mergedOnDate?: string | null;
  mergedToIdentity?: string | null;
  language?: string;
  timezone: string;
  doorNumber: string;
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  placeName?: string;
  baseCurrencyCode: string;
  locationCode?: string;
  parentAdminCode?: string;
  micrCode?: string;
  ifscCode?: string;
  swiftBicCode?: string;
  bsrCode?: string;
  authDealerCode?: string;
  tbaMainKey?: string;
  regDirectoryCode?: string;
  sizeId?: number;
  numExtensionCounters?: number;
  isMainBranchInLocation: boolean;
  linkServiceMainBranchId?: number;
  isSplitPremises: boolean;
  numSplitPremises?: number;
  localClearingMember: boolean;
  nationalClearingMember: boolean;
  highValueClearingMember: boolean;
  numOfficersAvailable?: number;
  clearingBasedOnMicr?: boolean;
  cashMgmtBranch?: boolean;
  rtgsDepEnabled?: boolean;
  authDealForex?: boolean;
  authForeignCurrencyDeposit?: boolean;
  ddIssueAllowed?: boolean;
  ttIssueAllowed?: boolean;
  dedicatedIssueOperations?: string;
  latitude?: number | null;
  longitude?: number | null;
}

export interface AdminUnitDetails {
  identity?: string;
  adminUnitTypeIdentity: string;

  branchCode?: string;
  branchName?: string;
  branchShortName?: string;
  branchStatusIdentity?: string;
  branchTypeIdentity?: string;
  branchCategoryIdentity?: string;
  parentBranchIdentity?: string | null;
  parentBranchName?: string | null;

  mergedToBranchIdentity?: string | null;
  mergedToBranchName?: string | null;
  mergedOn?: string | null;

  registrationDate?: string | null;
  openingDate?: string | null;
  closingDate?: string | null;
  dateOfShift?: string | null;

  doorNumber?: string;
  addressLine1?: string;
  addressLine2?: string;
  landmark?: string;
  placeName?: string;

  pincodeIdentity?: string;
  pincode?: string;
  postOfficeIdentity?: string;
  postOffice?: string;
  districtIdentity?: string;
  districtName?: string;
  stateIdentity?: string;
  stateName?: string;
  cityIdentity?: string;
  cityName?: string;
  countryIdentity?: string;
  countryName?: string;
  language?: string;

  latitude?: number | null;
  longitude?: number | null;
  timezone?: string;

  locationCode?: string;
  parentAdminCode?: string;
  micrCode?: string;
  ifscCode?: string;
  swiftBicCode?: string;
  bsrCode?: string;
  authDealerCode?: string;
  tbaMainKey?: string;
  regDirectoryCode?: string;

  sizeId?: number;
  numExtensionCounters?: number;
  linkServiceMainBranchId?: number;
  numSplitPremises?: number;
  numOfficersAvailable?: number;

  baseCurrency?: string;
  isMainBranchInLocation?: boolean;
  isActive?: boolean;

  isSplitPremises?: boolean;
  localClearingMember?: boolean;
  nationalClearingMember?: boolean;
  highValueClearingMember?: boolean;
  clearingBasedOnMicr?: boolean;
  cashMgmtBranch?: boolean;
  rtgsDepEnabled?: boolean;
  authDealForex?: boolean;
  authForeignCurrencyDeposit?: boolean;
  ddIssueAllowed?: boolean;
  ttIssueAllowed?: boolean;
  dedicatedIssueOperations?: string;
}

export interface PincodeDetails {
  pincodeIdentity: string;
  postOfficeIdentity: string;
  postOffice: string;
  cityIdentity: string;
  cityName: string;
  districtIdentity: string;
  districtName: string;
  stateIdentity: string;
  stateName: string;
  countryIdentity: string;
  countryName: string;
  language: string;
}

export interface PostOfficeDto {
  officeName: string;
  identity: string;
}

export interface PincodeApiResponse {
  pincode: string;
  districtName: string;
  districtIdentity?: string;
  stateName: string;
  stateIdentity?: string;
  postOffices: PostOfficeDto[];
  latitude: number;
  longitude: number;
  identity: string;
}

export interface TimezoneDto {
  identity: string;
  timezoneName: string;
  utcOffset: string;
  name: string;
  isActive: boolean;
}