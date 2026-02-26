// Assign Attribute Types - Base type with all attributes
export interface AttributeValueData {
  identity?: string | null;
  schemeIdentity: string;
  schemeName: string;
  attributeIdentity: string;
  attributeKey: string;
  attributeName: string;
  defaultValue: string | number | boolean;
  dataType: string;
  attributeValue: string | null;
  status: boolean;
  isActive: boolean;
  isRequired: boolean;
  loanProductName?: string;
  loanSchemeName?: string;
  productIdentity?: string;
  productName?: string;
  active?: boolean;
}

// Derived types using Pick utility
export type AssignAttributeFormData = Pick<
  AttributeValueData,
  "loanProductName" | "loanSchemeName"
> & {
  loanProductName: string; // Override to make required for form
  loanSchemeName: string; // Override to make required for form
};

export type AttributeValue = Pick<
  AttributeValueData,
  | "schemeIdentity"
  | "schemeName"
  | "attributeName"
  | "defaultValue"
  | "attributeValue"
  | "status"
> & {
  attributeValue: string;
  listValues?: string[];
};

export type AttributeValueItem = Pick<
  AttributeValueData,
  "attributeIdentity" | "attributeValue" | "active"
> & {
  attributeValue: string; // Override to make non-nullable for API
  active: boolean; // Map from status/isActive
};

export type AttributeValueApiItem = Pick<
  AttributeValueData,
  | "identity"
  | "attributeIdentity"
  | "attributeKey"
  | "attributeName"
  | "defaultValue"
  | "dataType"
  | "attributeValue"
  | "isActive"
  | "isRequired"
>;

export type AttributeValueFormApiItem = Pick<
  AttributeValueData,
  | "attributeIdentity"
  | "attributeName"
  | "defaultValue"
  | "attributeValue"
  | "status"
  | "isActive"
  | "identity"
>;

// API Request/Response types
export interface LoanSchemeAttributeValueRequest {
  attributeValues: AttributeValueItem[];
}

export interface LoanSchemeAttributeValueResponse {
  success: boolean;
  message?: string;
  data?: {
    schemeIdentity: string;
    schemeName: string;
    productIdentity: string;
    productName: string;
    attributeValues: AttributeValueApiItem[];
  };
}

export interface AttributeValuesFormResponse {
  productName?: string;
  schemeName?: string;
  attributeValues?: AttributeValueFormApiItem[];
}

export interface AssignAttributePayload {
  loanProduct: string;
  loanScheme: string;
  attributes: {
    attributeName: string;
    defaultValue: string | number | boolean;
    attributeValue: string | number | boolean;
    status: boolean;
  }[];
}

// Non-derived types (external interfaces)
export interface AssignAttributeValuesProps {
  onComplete?: () => void;
  onIncomplete?: () => void;
  loanProductFromStepper?: string;
  loanSchemeFromStepper?: string;
  onSave?: () => void;
  schemeId?: string;
  onUnsavedChanges?: (hasChanges: boolean) => void;
}
