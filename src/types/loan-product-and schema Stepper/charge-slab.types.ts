// Charge Slab Types - Base type with all attributes
export interface LoanSchemeChargeSlabData {
  id: string;
  loanScheme: string;
  charges: string;
  charge: string;
  chargeIdentity?: string;
  rateType: string;
  rateTypeIdentity?: string;
  slabRate: string;
  fromAmount: string;
  toAmount: string;
  chargeOn: string;
  chargeOnIdentity?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Derived types using Pick utility
export type LoanSchemeChargeSlabFormData = Pick<
  LoanSchemeChargeSlabData,
  | "loanScheme"
  | "charges"
  | "rateType"
  | "slabRate"
  | "fromAmount"
  | "toAmount"
  | "chargeOn"
>;

export type ChargeSlab = Pick<
  LoanSchemeChargeSlabData,
  | "id"
  | "charge"
  | "fromAmount"
  | "toAmount"
  | "rateType"
  | "slabRate"
  | "chargeOn"
>;

export type ChargeSlabTableData = Pick<
  LoanSchemeChargeSlabData,
  | "id"
  | "charge"
  | "fromAmount"
  | "toAmount"
  | "rateType"
  | "slabRate"
  | "chargeOn"
  | "chargeIdentity"
  | "rateTypeIdentity"
  | "chargeOnIdentity"
>;

export type ChargeSlabEditingItem = Pick<
  LoanSchemeChargeSlabData,
  | "id"
  | "chargeIdentity"
  | "fromAmount"
  | "toAmount"
  | "rateTypeIdentity"
  | "slabRate"
  | "chargeOnIdentity"
>;

// Non-derived types (external interfaces)
export interface LoanSchemeChargeSlabProps {
  onComplete?: () => void;
  onSave?: () => void;
  onUnsavedChanges?: (hasChanges: boolean) => void;
}

export interface ChargeSlabTableProps {
  tableData: ChargeSlabTableData[];
  onEdit?: (item: ChargeSlabTableData) => void;
}

export interface LoanSchemeChargeSlabTableProps {
  tableData: ChargeSlab[];
  onEdit?: (item: ChargeSlab) => void;
}
