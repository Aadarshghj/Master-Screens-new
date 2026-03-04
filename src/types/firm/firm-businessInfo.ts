export const OtherSourceIncome = {
  RENTAL: "Rental",
  INVESTMENT: "Investment",
  COMMISSION: "Commission",
  CONSULTATION: "Consultation",
  OTHER: "Other",
} as const;

export type OtherSourceIncome =
  (typeof OtherSourceIncome)[keyof typeof OtherSourceIncome];

export const Seasonality = {
  QUARTERLY: "Quarterly",
  HALF_YEARLY: "Half Yearly",
  ANNUAL: "Annual",
  SEASONAL: "Seasonal",
  NON_SEASONAL: "Non-Seasonal",
} as const;

export type Seasonality = (typeof Seasonality)[keyof typeof Seasonality];

export const SectorPerformance = {
  EXCELLENT: "Excellent",
  GOOD: "Good",
  AVERAGE: "Average",
  BELOW_AVERAGE: "Below Average",
  POOR: "Poor",
} as const;

export type SectorPerformance =
  (typeof SectorPerformance)[keyof typeof SectorPerformance];

export const CapacityUtilization = {
  LESS_THAN_25: "< 25%",
  TWENTY_FIVE_TO_50: "25-50%",
  FIFTY_TO_75: "50-75%",
  SEVENTY_FIVE_TO_90: "75-90%",
  MORE_THAN_90: "> 90%",
} as const;

export type CapacityUtilization =
  (typeof CapacityUtilization)[keyof typeof CapacityUtilization];

export const UtilitiesAvailability = {
  WATER: "Water",
  ELECTRICITY: "Electricity",
  GAS: "Gas",
  INTERNET: "Internet",
  ALL: "All Available",
} as const;

export type UtilitiesAvailability =
  (typeof UtilitiesAvailability)[keyof typeof UtilitiesAvailability];

export interface ProfitabilityEntry {
  year: string;
  amount: string;
}
export interface ConfigOption {
  value: string;
  label: string;
  identity?: string;
}
export interface BusinessInformation {
  natureOfBusiness: string;
  yearsInOperation: string;
  annualTurnover: string;
  noOfEmployees: string;
  noOfBranchesOffices: string;
  dateOfIncorporation: string;
  authorizedCapital: string;
  issuedCapital: string;
  paidUpCapital: string;
  netWorth: string;
  website: string;
  businessEmail: string;
  mobileNumber: string;
  customerConcentration: string;
  otherSourceIncome: OtherSourceIncome | null;
  seasonality: Seasonality | null;
  sectorPerformance: SectorPerformance | null;
  capacityUtilization: string;
  productClassification: string;
  // utilitiesAvailabilitys:string;
  utilitiesAvailability: UtilitiesAvailability[];
  businessDescription: string;
  profitabilityData: ProfitabilityEntry[];
}

export interface BusinessInformationErrors {
  natureOfBusiness?: string;
  yearsInOperation?: string;
  annualTurnover?: string;
  noOfEmployees?: string;
  noOfBranchesOffices?: string;
  dateOfIncorporation?: string;
  authorizedCapital?: string;
  issuedCapital?: string;
  paidUpCapital?: string;
  netWorth?: string;
  website?: string;
  businessEmail?: string;
  customerConcentration?: string;
  otherSourceIncome?: string;
  seasonality?: string;
  sectorPerformance?: string;
  capacityUtilization?: string;
  productClassification?: string;
  utilitiesAvailability?: string;
  businessDescription?: string;
  profitabilityData?: string;
}

export interface BusinessInformationFormState {
  data: BusinessInformation;
  errors: BusinessInformationErrors;
  isSubmitting: boolean;
  isValid: boolean;
  isDirty: boolean;
}

export const defaultBusinessInformation: BusinessInformation = {
  natureOfBusiness: "",
  yearsInOperation: "",
  annualTurnover: "",
  noOfEmployees: "",
  noOfBranchesOffices: "",
  dateOfIncorporation: "",
  authorizedCapital: "",
  issuedCapital: "",
  paidUpCapital: "",
  netWorth: "",
  website: "",
  businessEmail: "",
  mobileNumber: "",
  customerConcentration: "",
  otherSourceIncome: null,
  seasonality: null,
  sectorPerformance: null,
  capacityUtilization: "",
  productClassification: "",
  // utilitiesAvailabilitys:'',/
  utilitiesAvailability: [],
  businessDescription: "",
  profitabilityData: [],
};

export const defaultProfitabilityEntry: ProfitabilityEntry = {
  year: "",
  amount: "",
};

export type BusinessFieldChangeHandler = <K extends keyof BusinessInformation>(
  field: K,
  value: BusinessInformation[K]
) => void;

export type ProfitabilityChangeHandler = (
  index: number,
  field: keyof ProfitabilityEntry,
  value: string | number
) => void;

export interface ProfitabilityOperations {
  addEntry: (entry: ProfitabilityEntry) => void;
  removeEntry: (index: number) => void;
  updateEntry: (index: number, updates: Partial<ProfitabilityEntry>) => void;
  resetEntries: () => void;
}

export interface SaveBusinessInformationRequest {
  businessInformation: BusinessInformation;
}

export interface SaveBusinessInformationResponse {
  success: boolean;
  message: string;
  businessId?: string;
  errors?: BusinessInformationErrors;
}

export interface GetBusinessInformationRequest {
  businessId: string;
}

export interface GetBusinessInformationResponse {
  success: boolean;
  data?: BusinessInformation;
  message?: string;
}

export interface BusinessInformationScreenProps {
  businessId?: string;
  onSave?: (information: BusinessInformation) => void;
  onCancel?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  mode?: "create" | "edit" | "view";
}

export interface ProfitabilityTableProps {
  entries: ProfitabilityEntry[];
  onRemove: (index: number) => void;
  onEdit?: (index: number, entry: ProfitabilityEntry) => void;
  isEditable?: boolean;
}

export interface DropdownOption<T = string> {
  label: string;
  value: T;
}

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: (value: unknown) => string | undefined;
}

export interface FieldConfig {
  name: keyof BusinessInformation;
  label: string;
  type:
    | "text"
    | "number"
    | "select"
    | "multiselect"
    | "date"
    | "textarea"
    | "email"
    | "url";
  placeholder?: string;
  required?: boolean;
  validation?: ValidationRule;
  options?: DropdownOption[];
}

export const OTHER_SOURCE_INCOME_OPTIONS: DropdownOption<OtherSourceIncome>[] =
  [
    { label: "Rental", value: OtherSourceIncome.RENTAL },
    { label: "Investment", value: OtherSourceIncome.INVESTMENT },
    { label: "Commission", value: OtherSourceIncome.COMMISSION },
    { label: "Consultation", value: OtherSourceIncome.CONSULTATION },
    { label: "Other", value: OtherSourceIncome.OTHER },
  ];

export const SEASONALITY_OPTIONS: DropdownOption<Seasonality>[] = [
  { label: "Quarterly", value: Seasonality.QUARTERLY },
  { label: "Half Yearly", value: Seasonality.HALF_YEARLY },
  { label: "Annual", value: Seasonality.ANNUAL },
  { label: "Seasonal", value: Seasonality.SEASONAL },
  { label: "Non-Seasonal", value: Seasonality.NON_SEASONAL },
];

export const SECTOR_PERFORMANCE_OPTIONS: DropdownOption<SectorPerformance>[] = [
  { label: "Excellent", value: SectorPerformance.EXCELLENT },
  { label: "Good", value: SectorPerformance.GOOD },
  { label: "Average", value: SectorPerformance.AVERAGE },
  { label: "Below Average", value: SectorPerformance.BELOW_AVERAGE },
  { label: "Poor", value: SectorPerformance.POOR },
];

export const CAPACITY_UTILIZATION_OPTIONS: DropdownOption<CapacityUtilization>[] =
  [
    { label: "< 25%", value: CapacityUtilization.LESS_THAN_25 },
    { label: "25-50%", value: CapacityUtilization.TWENTY_FIVE_TO_50 },
    { label: "50-75%", value: CapacityUtilization.FIFTY_TO_75 },
    { label: "75-90%", value: CapacityUtilization.SEVENTY_FIVE_TO_90 },
    { label: "> 90%", value: CapacityUtilization.MORE_THAN_90 },
  ];

export const UTILITIES_AVAILABILITY_OPTIONS: DropdownOption<UtilitiesAvailability>[] =
  [
    { label: "Water", value: UtilitiesAvailability.WATER },
    { label: "Electricity", value: UtilitiesAvailability.ELECTRICITY },
    { label: "Gas", value: UtilitiesAvailability.GAS },
    { label: "Internet", value: UtilitiesAvailability.INTERNET },
    { label: "All Available", value: UtilitiesAvailability.ALL },
  ];

export type NavigationAction = "previous" | "next" | "save" | "reset";

export interface NavigationState {
  canGoBack: boolean;
  canGoNext: boolean;
  currentStep?: number;
  totalSteps?: number;
}

export interface EmailVerificationState {
  isVerified: boolean;
  isVerifying: boolean;
  error?: string;
}
