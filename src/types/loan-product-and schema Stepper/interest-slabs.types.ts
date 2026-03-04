// Interest Slab Types - Base type with all attributes
export interface InterestSlabData {
  id: number | string;
  loanScheme: string;
  startPeriod: number | string;
  endPeriod: number | string;
  fromAmount: number | string;
  toAmount: number | string;
  slabInterestRate: number | string;
  annualROI: number | string;
  rebateAnnualROI: number | string;
  rebateInterestRate?: number;
  recomputationRequired: boolean | string;
  recalculationRequired?: boolean;
  expired: boolean;
  pastDue?: boolean | string;
  postDue?: boolean;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Derived types using Pick utility
export type InterestSlabFormData = Pick<
  InterestSlabData,
  | "loanScheme"
  | "startPeriod"
  | "endPeriod"
  | "fromAmount"
  | "toAmount"
  | "slabInterestRate"
  | "annualROI"
  | "rebateAnnualROI"
  | "recomputationRequired"
  | "expired"
> & {
  startPeriod: string;
  endPeriod: string;
  fromAmount: string;
  toAmount: string;
  slabInterestRate: string;
  annualROI: string;
  rebateAnnualROI: string;
  recomputationRequired: boolean;
  expired: boolean;
};

export type InterestSlabTableData = Pick<
  InterestSlabData,
  | "id"
  | "startPeriod"
  | "endPeriod"
  | "fromAmount"
  | "toAmount"
  | "slabInterestRate"
  | "annualROI"
  | "rebateAnnualROI"
> & {
  startPeriod: number;
  endPeriod: number;
  fromAmount: number;
  toAmount: number;
  slabInterestRate: number;
  annualROI: number;
  rebateAnnualROI: number;
  recomputationRequired: string;
  pastDue: string;
};

// API Request/Response types
export type InterestSlabRequest = {
  start_period: number;
  end_period: number;
  from_amount: number;
  to_amount: number;
  slab_interest_rate: number;
  rebate_interest_rate: number;
  annual_roi: number;
  recalculation_required: boolean;
  post_due: boolean;
  active: boolean;
};

export type InterestSlabResponse = InterestSlabRequest & {
  id: string;
  created_at: string;
  updated_at: string;
};

// Non-derived types (external interfaces)
export interface InterestSlabsProps {
  onComplete?: () => void;
  loanSchemeFromStepper?: string;
  onSave?: () => void;
}

export interface InterestSlabTableProps {
  data: InterestSlabTableData[];
  onEdit?: (id: number | string) => void;
  onDelete?: (id: number | string) => void;
}

export interface InterestSlabFormProps {
  onComplete?: () => void;
  onSave?: () => void;
  loanSchemeFromStepper?: string;
  interestSlabs?: { interestSlabs?: unknown[] };
  refetch?: () => void;
  schemeId?: string;
  createInterestSlab?: (params: { schemeId: string; payload: unknown }) => {
    unwrap: () => Promise<unknown>;
  };
  onUnsavedChanges?: (hasChanges: boolean) => void;
}
