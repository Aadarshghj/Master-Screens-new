import type {
  SupplierInformationType,
  SupplierContactManagementType,
  SupplierAssetGroupType,
  AddressInfoType,
  BankInfoType,

} from "@/types/asset-management-system/supplier-management/supplier-information"

export const DEFAULT_SUPPLIER_DETAILS: SupplierInformationType = {
  supplierName: "",
  tradeName: "",
  supplierRiskCategory: "",
  panNumber: "",
  gstRegistrationType: "",
  gstin: "",
  msmeRegistrationNo: "",
  msmeType: "",
  cinOrLlpin: "",
  incorporationDate: "",
  contactPersonName: "",
  designation: "",
  isActive: true
}

export const DEFAULT_CONTACT: SupplierContactManagementType = {
  contactType: "",
  contactValue: "",
  isActive:true,
  isPrimary:false,
}
export const DEFAULT_ASSET_GROUP: SupplierAssetGroupType = {
  assetGroup: "",
  isActive:true,
}
export const DEFAULT_ADDRESS: AddressInfoType = {
  addressLine1: "",
  addressLine2: "",
  pincode: "",
  city: "",
  state: "",
  country: ""
}

export const DEFAULT_BANK: BankInfoType = {
  bankName: "",
  branchName: "",
  accountHolderName: "",
  accountNumber: "",
  confirmAccountNumber: "",
  ifscCode: "",
  pennyDropVerification: false,//
  defaultGstRate: "",
  isTds: false,//
  tdsSection: "",//
  tdsRate: "", 
  isReverseChange: false
}