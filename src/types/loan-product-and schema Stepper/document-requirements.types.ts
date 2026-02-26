// Document Requirement Types - Base type with all attributes
export interface DocumentRequirementData {
  id: string;
  loanScheme: string;
  document: string;
  documentIdentity: string;
  documentName: string;
  acceptanceLevel: string;
  acceptanceLevelIdentity: string;
  acceptanceLevelName?: string;
  mandatoryStatus: boolean;
  mandatory: boolean;
  createdBy: string;
  status: boolean;
  isActive: boolean;
  createdOn: string;
  updatedOn: string;
  createdAt: string;
  updatedAt: string;
}

// Derived types using Pick utility
export type DocumentRequirementFormData = Pick<
  DocumentRequirementData,
  "loanScheme" | "document" | "acceptanceLevel" | "mandatoryStatus"
>;

export type DocumentRequirementTableData = Pick<
  DocumentRequirementData,
  | "id"
  | "documentIdentity"
  | "acceptanceLevelIdentity"
  | "documentName"
  | "acceptanceLevel"
  | "mandatoryStatus"
  | "createdBy"
  | "status"
  | "createdOn"
  | "updatedOn"
>;

export type DocumentRequirementPayload = Pick<
  DocumentRequirementData,
  "documentIdentity" | "acceptanceLevelIdentity" | "mandatory" | "isActive"
>;

export type DocumentRequirementResponse = Pick<
  DocumentRequirementData,
  | "id"
  | "documentIdentity"
  | "acceptanceLevelIdentity"
  | "documentName"
  | "acceptanceLevelName"
  | "mandatory"
  | "isActive"
  | "createdAt"
  | "updatedAt"
>;

// Non-derived types (external interfaces)
export interface DocumentRequirementProps {
  onComplete?: () => void;
  onSave?: () => void;
  onUnsavedChanges?: (hasChanges: boolean) => void;
}

export interface DocumentOption {
  value: string;
  label: string;
}

export interface AcceptanceLevelOption {
  value: string;
  label: string;
}
