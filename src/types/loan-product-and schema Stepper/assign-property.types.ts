// Property Value Types - Base type with all attributes
export interface PropertyValueData {
  identity?: string | null;
  propertyIdentity: string;
  loanScheme: string;
  propertyKey: string;
  propertyName: string;
  defaultValue: string | number;
  dataType: string;
  propertyValue: string | null;
  glAccountId: string | null;
  glAccountIdentity: string | null;
  glAccountName?: string | null;
  status: boolean;
  isActive: boolean;
  isRequired: boolean;
  loanProductName?: string;
  loanSchemeName?: string;
}

// Derived types using Pick utility
export type PropertyValue = Pick<
  PropertyValueData,
  | "loanScheme"
  | "propertyKey"
  | "defaultValue"
  | "propertyValue"
  | "glAccountId"
  | "glAccountName"
  | "status"
> & {
  propertyValue: string; // Override to make non-nullable for UI
};

export type AssignPropertyFormData = Pick<
  PropertyValueData,
  "loanSchemeName"
> & {
  loanSchemeName: string; // Override to make required for form
};

export type PropertyValueItem = Pick<
  PropertyValueData,
  | "identity"
  | "propertyIdentity"
  | "propertyKey"
  | "propertyName"
  | "defaultValue"
  | "dataType"
  | "propertyValue"
  | "glAccountIdentity"
  | "glAccountId"
  | "glAccountName"
  | "isActive"
  | "isRequired"
>;

export type LoanSchemePropertyValueRequest = Pick<
  PropertyValueData,
  "propertyIdentity" | "propertyValue" | "glAccountIdentity" | "isActive"
> & {
  propertyValue: string; // Override to make non-nullable for API
  glAccountIdentity: string; // Override to make non-nullable for API
};

// API Response types
export interface LoanSchemePropertyValueResponse {
  schemeIdentity: string;
  schemeName: string;
  propertyValues: PropertyValueItem[];
}

// Non-derived types (external interfaces)
export interface AssignPropertyValuesProps {
  onComplete?: () => void;
  onIncomplete?: () => void;
  loanProductFromStepper?: string;
  loanSchemeFromStepper?: string;
  onSave?: () => void;
  onUnsavedChanges?: (hasChanges: boolean) => void;
}

export interface GLAccountItem {
  identity: string;
  glCode: string;
  glName: string;
  level: number;
}

export interface PropertyValuesTableProps {
  tableData: PropertyValue[];
  handlePropertyValueChange: (index: number, value: string) => void;
  handleGLAccountChange: (index: number, glAccountId: string) => void;
  handleGLAccountNameChange: (index: number, glAccountName: string) => void;
  handleStatusChange: (index: number, checked: boolean) => void;
  glAccountOptions: GLAccountItem[];
  touchedFields: Set<number>;
}
