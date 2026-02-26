export interface GLAccountTypeFormData {
  glCategory: string;
  glAccountType: string;
  glAccountId: string;
  isActive: boolean;
}

export interface GLAccountTypeApiResponse {
  glAccountTypeIdentity: string;
  category: string;
  glAccountType: string;
  glAccountIdentity: string | null;
  glAccountName: string | null;
  isActive: boolean;
}

export interface GLAccountTypeMutationPayload {
  loanSchemeGlTypeGlMappingDtos: Array<{
    glAccountTypeIdentity: string;
    glAccountIdentity: string | null;
    isActive: boolean;
  }>;
  [key: string]: unknown;
}

export interface GLAccountTypeData {
  glAccountTypeId: string;
  category: string;
  glAccountType: string;
  glAccountId: string | null;
  glAccountName: string | null;
  isActive: boolean;
  isEdited?: boolean;
}

export interface GLAccountSearchResult {
  identity: string;
  glCode: string;
  glName: string;
  level: number;
}

export interface GLAccountTypeFormProps {
  readonly?: boolean;
}

export interface GLAccountTypeState {
  isReady: boolean;
  isEditMode: boolean;
  currentGLAccountTypeId: string | null;
}
