// GL Mapping Types - Base type with all attributes
export interface GLMappingData {
  id: string;
  loanScheme: string;
  glAccountType: string;
  glAccount: string;
  glAccountTypeName: string;
  glAccountName: string;
  createdOn: string;
  updatedOn: string;
  createdAt: string;
  updatedAt: string;
}

// Derived types using Pick utility
export type GLMappingFormData = Pick<
  GLMappingData,
  "loanScheme" | "glAccountType" | "glAccount"
>;

export type GLMappingTableData = Pick<
  GLMappingData,
  | "id"
  | "glAccountType"
  | "glAccount"
  | "glAccountTypeName"
  | "glAccountName"
  | "createdOn"
  | "updatedOn"
>;

export type GLMappingPayload = Pick<
  GLMappingData,
  "glAccountType" | "glAccount"
>;

export type GLMappingResponse = Pick<
  GLMappingData,
  | "id"
  | "glAccountType"
  | "glAccount"
  | "glAccountTypeName"
  | "glAccountName"
  | "createdAt"
  | "updatedAt"
> & {
  schemeName?: string;
};

// Non-derived types (external interfaces)
export interface GLMappingsProps {
  onComplete?: () => void;
  onSave?: () => void;
  onUnsavedChanges?: (hasChanges: boolean) => void;
}

export interface GLTypeOption {
  value: string;
  label: string;
}

export interface GLAccountOption {
  value: string;
  label: string;
}

// API Types (aliases for consistency)
export type GLType = GLTypeOption;
export type GLAccount = GLAccountOption;
