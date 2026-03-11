export interface TenantType {
  id: string;
  tenantName: string;
  tenantCode: string;
  legalEntityName: string;
  tenantType: string;
  registrationNo: string;
  rbiRegistrationNumber?: string;
  panNumber: string;
  gstNumber?: string;
  cinNumber?: string;
  contactNumber: string;
  website?: string;
  businessEmail: string;
  chooseFile: File | null;
  tenantAddress?: TenantAddressType;
  attributes?: KeyColumn[];
  isActive: boolean;
}

export interface TenantAddressType {
  addressType?: string;
  streetLaneName: string;
  placeName?: string;
  pinCode?: number;
  country: string;
  state: string;
  district: string;
  postOffice?: string;
  city: string;
  landmark?: string;
  siteFactoryPremise?: string;
  nameOfTheOwner?: string;
  relationshipWithTenant?: string;
  landlineNumber?: string;
  timeZone?: string;
}

export interface Option {
  value: string;
  label: string;
}

export interface TenantRequestDto {
  tenantName: string;
  tenantCode: string;
  tenantAddress: string;
  isActive: boolean;
}

export interface TenantResponseDto {
  identity: string;
  tenantName: string;
  tenantCode: string;
  tenantAddress: string;
  isActive: boolean;
}

export interface KeyRow {
  key: string;
  value: string;
}

export interface KeyColumn {
  id: string;
  rows: KeyRow[];
}
