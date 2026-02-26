export interface BranchType {
  branchTypeIdentity?: string;
  branchTypeCode: string;
  branchTypeName: string;
  branchTypeDesc?: string;
  isActive?: boolean;
}

export type BranchTypeRequestDto = {
    branchTypeCode: string;
    branchTypeName: string;
    description?: string;
}

export type BranchTypeResponseDto = {
  identity: string;
  code: string;
  name: string;
  description?: string;
  isActive: boolean;
}

export interface Option {
  value: string;
  label: string;
}