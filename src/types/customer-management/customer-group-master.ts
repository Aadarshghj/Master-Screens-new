export interface CustomerGroupFormType {
  customerGroupName: string;
  customerGroupCode: string;
}

export interface CustomerGroupRequestDto {
  customerGroup: string;
  code: string;
}

export interface CustomerGroupResponseDto {
  id: string;
  customerGroup: string;
  code: string;
}
