export interface UserType {
  userTypeIdentity: string;
  userTypeCode: string;
  userTypeName: string;
  userTypeDesc?: string;
  isAdmin: boolean;
  isActive: boolean;
}

export type UserTypeRequestDto = {
  userTypeName: string;
  description?: string;
  isAdmin: boolean;
};

export interface Option {
  value: string;
  label: string;
}
