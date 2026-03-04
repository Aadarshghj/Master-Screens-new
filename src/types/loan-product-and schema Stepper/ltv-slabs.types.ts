// LTV Slab Types - Base type with all attributes
export interface LTVSlabData {
  id: string;
  loanScheme: string;
  fromAmount: number | string;
  toAmount: number | string;
  ltvPercentage: number | string;
  ltvOn: string;
  ltvOnIdentity: string;
  ltvOnTypeName?: string;
  active: boolean;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
  created_at?: string;
  updated_at?: string;
}

// Derived types using Pick utility
export type LTVSlabFormData = Pick<
  LTVSlabData,
  "loanScheme" | "fromAmount" | "toAmount" | "ltvPercentage" | "ltvOn"
> & {
  fromAmount: string;
  toAmount: string;
  ltvPercentage: string;
};

export type LTVSlabTableData = Pick<
  LTVSlabData,
  "id" | "fromAmount" | "toAmount" | "ltvPercentage" | "ltvOn" | "ltvOnIdentity"
> & {
  fromAmount: number;
  toAmount: number;
  ltvPercentage: number;
};

export type LTVSlabPayload = Pick<
  LTVSlabData,
  "ltvOnIdentity" | "fromAmount" | "toAmount" | "ltvPercentage" | "active"
> & {
  fromAmount: number;
  toAmount: number;
  ltvPercentage: number;
} & Record<string, unknown>;

export type LTVSlabResponse = Pick<
  LTVSlabData,
  | "id"
  | "ltvOnIdentity"
  | "fromAmount"
  | "toAmount"
  | "ltvPercentage"
  | "active"
  | "created_at"
  | "updated_at"
> & {
  ltvSlabIdentity: string; // Add this field from your JSON response
  fromAmount: number;
  toAmount: number;
  ltvPercentage: number;
};

export interface LTVSlabsApiResponse {
  schemeIdentity: string;
  schemeName: string;
  ltvSlabs: LTVSlabResponse[];
}

export type LTVOnApiResponse = Pick<
  LTVSlabData,
  "ltvOnIdentity" | "ltvOnTypeName" | "isActive"
>;

// Non-derived types (external interfaces)
export interface LTVSlabsProps {
  onComplete?: () => void;
  loanSchemeFromStepper?: string;
  onSave?: () => void;
  onUnsavedChanges?: (hasChanges: boolean) => void;
}

export interface LTVOnOption {
  value: string;
  label: string;
}
