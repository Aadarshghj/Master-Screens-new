export interface empanelmentHeader {
  empanelmentDate: string
  empanelmentBy: string
  description: string
  validuptoDate: string
}

export interface supplierDetails {
  supplierNameSearch: string
  registrationNumber: string
  email: string
  contact: string
  empanelmentType: string
}

export interface empanelItem {
  itemName: string
  model: string
  amount: string
}

export interface termsConditions {
  termsAndConditions: string
}

export interface authorizationDocument {
  document: File | null
}

export interface empanelItemOption {
  value: string
  label: string
}

export interface SupplierSearchForm {
  supplierName: string
  tradeName: string
  panNumber: string
  gstNumber: string
}
export interface supplierEmpanelmentForm {
  empanelmentDate: string
  empanelmentBy: string
  description: string
  validuptoDate: string

  supplierNameSearch: string
  registrationNumber: string
  email: string
  contact: string
  empanelmentType: string
  amount: string 
  termsAndConditions: string
  document: File | null

  empanelItems: empanelItem[]
}

export interface SupplierSearchResult {
  
  supplierName: string
  tradeName: string
  panNumber: string
  gstNumber: string
  msmeRegistrationNo: string
  address: string
  city: string
  state: string
  country: string
  pincode: string
}
export interface SupplierData {
  supplierName: string
  tradeName: string
  panNumber: string
  gstNumber: string
}