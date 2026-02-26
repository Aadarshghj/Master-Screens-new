export const documentRequirementDefaultFormValues = {
  loanScheme: "",
  document: "",
  acceptanceLevel: "",
  mandatoryStatus: false,
};

export const DOCUMENT_OPTIONS = [
  { value: "Aadhar Card", label: "Aadhar Card" },
  { value: "PAN Card", label: "PAN Card" },
  { value: "Income Certificate", label: "Income Certificate" },
  { value: "Bank Statement", label: "Bank Statement" },
  { value: "Passport", label: "Passport" },
  { value: "Voter ID", label: "Voter ID" },
  { value: "Driving License", label: "Driving License" },
];

export const ACCEPTANCE_LEVEL_OPTIONS = [
  { value: "Pre-disbursement", label: "Pre-disbursement" },
  { value: "Post-disbursement", label: "Post-disbursement" },
  { value: "Application", label: "Application" },
  { value: "Verification", label: "Verification" },
];

export const DOCUMENT_REQUIREMENT_VALIDATION_RULES = {
  REQUIRED_FIELDS: {
    document: "Document is required",
    acceptanceLevel: "Acceptance level is required",
  },
};

export const DOCUMENT_REQUIREMENT_FIELD_LABELS = {
  loanScheme: "Loan Scheme",
  document: "Document",
  acceptanceLevel: "Acceptance Level",
  mandatory: "Mandatory",
  documentName: "Document Name",
  mandatoryStatus: "Mandatory Status",
  createdBy: "Created By",
  status: "Status",
};

// types/document-requirement.types.ts
export interface DocumentRequirementFormData {
  loanScheme: string;
  document: string;
  acceptanceLevel: string;
  mandatoryStatus: boolean;
}

export interface DocumentRequirement {
  id: string;
  documentName: string;
  acceptanceLevel: string;
  mandatoryStatus: boolean;
  createdBy: string;
  status: boolean;
}

export interface DocumentRequirementProps {
  onComplete?: () => void;
  onSave?: () => void;
}
