export interface SupplierInformationType {
  id?: string;

  supplierName: string;
  tradeName?: string;
  supplierRiskCategory: string;

  panNumber: string;
  panFile?: File | string;
  panVerification?: boolean;

  gstRegistrationType: string;
  gstin?: string;
  gstinFile?: File | string;

  msmeRegistrationNo?: string;
  msmeFile?: File | string;
  msmeType?: string;

  cinOrLlpin?: string;
  cinFile?: File | string;

  incorporationDate: string;

  contactPersonName: string;
  designation?: string;

  isActive: boolean;
}
export interface SupplierContactManagementType{
  contactType:string;
  contactValue:string;
  isActive:boolean;
  isPrimary:boolean;
}

export interface SupplierAssetGroupType {
  assetGroup: string
  isActive: boolean
}

export interface AddressInfoType {
  addressLine1: string
  addressLine2: string
  pincode: string
  city: string
  state: string
  country: string
  
}

export interface BankInfoType {
  bankName: string
  branchName: string
  accountHolderName: string
  accountNumber: string
  confirmAccountNumber: string
  ifscCode: string
  pennyDropVerification: boolean
  defaultGstRate?: string
  isTds: boolean
  tdsSection?: string
  tdsRate?:string
  isReverseChange:boolean
}

export interface SupplierInformationRequestDto {
  supplierName: string;
  tradeName?: string;
  supplierRiskCategory: string;

  panNumber: string;
  gstRegistrationType: string;
  gstin?: string;

  msmeRegistrationNo?: string;
  msmeType?: string;

  cinOrLlpin?: string;

  incorporationDate: string;

  contactPersonName: string;
  designation?: string;

  isActive: boolean;
}
export interface SupplierInformationResponseDto {
  id: string;

  supplierName: string;
  tradeName?: string;
  supplierRiskCategory: string;

  panNumber: string;
  panFileUrl?: string;

  gstRegistrationType: string;
  gstin?: string;
  gstinFileUrl?: string;

  msmeRegistrationNo?: string;
  msmeFileUrl?: string;
  msmeType?: string;

  cinOrLlpin?: string;
  cinFileUrl?: string;

  incorporationDate: string;

  contactPersonName: string;
  designation?: string;

  isActive: boolean;
}

export interface SupplierContactType {
  id?: string;
  contactType: string;
  contactValue: string;
  isActive: boolean;
  isPrimary: boolean;
}

export interface Option {
    value: string;
  label: string;
}