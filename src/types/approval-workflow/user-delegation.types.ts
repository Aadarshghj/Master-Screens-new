// types/user-delegation.ts

export interface UserDelegation {
  identity?: string;
  userDelegationIdentity?: string;
  fromUser?: string; // For backward compatibility
  toUser?: string; // For backward compatibility
  fromUserIdentity?: string; // Actual API field
  toUserIdentity?: string; // Actual API field
  fromUserName?: string;
  fromUserCode?: string;
  toUserName?: string;
  toUserCode?: string;
  startDate: string;
  endDate: string;
  module?: string; // For backward compatibility
  moduleIdentity?: string; // Actual API field
  reason: string;
  active: boolean;
  status?: string;
  createdDate?: string;
  modifiedDate?: string;
  tenantIdentity?: string;
}

export interface UserDelegationFormData {
  fromUser: string;
  toUser: string;
  startDate: string;
  endDate: string;
  module: string;
  reason: string;
  active: boolean;
}

export interface UserDelegationResponse {
  content: UserDelegation[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

export interface UserDelegationSearchParams {
  fromUser?: string;
  toUser?: string;
  page?: number;
  size?: number;
}

export interface OptionType {
  value: string;
  label: string;
  identity?: string;
  [key: string]: unknown;
}

export interface UserDelegationFormProps {
  readonly?: boolean;
}
