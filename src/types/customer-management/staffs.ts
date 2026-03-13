export interface StaffData {
  staffName: string;
  staffCode: string;
  email: string;
  contactPhone: string;
  isAppUser: boolean;
  contactAddress: string;
  appUserRefId: string;
  identity: string;
}

export interface StaffFormData {
  staffName: string;
  staffCode: string;
  reportingToIdentity: string;
  contactAddress: string;
  contactPhone: string;
  email: string;
  isAppUser: boolean;
  appUserRefId: string;
}
export interface Option {
  value: string;
  label: string;
}

export interface AppUsersResponseDto {
  identity: string;
  userName: string;
}

