export interface AddressTypeMaster {
  addressType: string;
  context: string;
  isMandatory: boolean;
  isActive: boolean;
     identity?: string;
}

export interface AddressTypeMasterRequestDto {
  addressType: string;
  context: string;
  isMandatory: string;
  isActive: boolean;
}

export interface AddressTypeMasterResponseDto {
  addressType: string;
  context: string;
  isMandatory: string;
  isActive: boolean;
  identity: string;
}
