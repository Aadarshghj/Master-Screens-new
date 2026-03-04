export const FirmType = {
  SOLE_PROPRIETORSHIP: "Sole Proprietorship",
  PARTNERSHIP: "Partnership",
  PRIVATE_LIMITED: "Private Limited",
  PUBLIC_LIMITED: "Public Limited",
  LLP: "LLP",
} as const;

export type FirmType = (typeof FirmType)[keyof typeof FirmType];

export const CannelmentType = {
  TYPE_A: "Type A",
  TYPE_B: "Type B",
  TYPE_C: "Type C",
} as const;

export interface ConfigOption {
  value: string;
  label: string;
  identity?: string;
}

export type CannelmentType =
  (typeof CannelmentType)[keyof typeof CannelmentType];

export const ProductIndustryCategory = {
  MANUFACTURING: "Manufacturing",
  TRADING: "Trading",
  SERVICES: "Services",
  AGRICULTURE: "Agriculture",
  CONSTRUCTION: "Construction",
  HEALTHCARE: "Healthcare",
  EDUCATION: "Education",
  TECHNOLOGY: "Technology",
  FINANCE: "Finance",
  RETAIL: "Retail",
} as const;

export type ProductIndustryCategory =
  (typeof ProductIndustryCategory)[keyof typeof ProductIndustryCategory];

export const RoleInFirm = {
  DIRECTOR: "Director",
  MANAGER: "Manager",
  PARTNER: "Partner",
  PROPRIETOR: "Proprietor",
  EMPLOYEE: "Employee",
} as const;

export type RoleInFirm = (typeof RoleInFirm)[keyof typeof RoleInFirm];

export const DurationWithCompany = {
  LESS_THAN_1_YEAR: "< 1 Year",
  ONE_TO_THREE_YEARS: "1-3 Years",
  THREE_TO_FIVE_YEARS: "3-5 Years",
  FIVE_TO_TEN_YEARS: "5-10 Years",
  MORE_THAN_TEN_YEARS: "> 10 Years",
} as const;

export type DurationWithCompany =
  (typeof DurationWithCompany)[keyof typeof DurationWithCompany];

export interface AssociatedPerson {
  customerCode: string;
  customerName: string;
  roleInFirm: RoleInFirm;
  authorizedSignatory: boolean;
  durationWithCompany: DurationWithCompany;
  customerIdentity?: string;
}

// Main FirmProfile interface - used in ProfileDetail component
export interface FirmProfile {
  typeOfFirm?: string;
  firmTypeIdentity?: string;
  firmName: string;
  firmIdentity?: string;
  productIndustryCategory: string;
  registrationNo: string;
  registrationDate: string;
  // Using canvassedType/canvassorId to match ProfileDetail component
  canvassedType?: string;
  canvasserIdentity: string;
  canvassedTypeIdentity?: string;
  associatedPersons: AssociatedPerson[];
  associatedPerson?: AssociatedPersonData[];

  // Backend might use these field names
  status: string;
  firmCode: string;
  customerIdentity?: string;
}

export interface AssociatedPersonData {
  customerCode: string;
  customerName: string;
  roleInFirm: string;
  authorizedSignatory: boolean;
  durationWithCompany: string;
}

export interface FirmProfileErrors {
  typeOfFirm?: string;
  firmName?: string;
  productIndustryCategory?: string;
  registrationNo?: string;
  registrationDate?: string;
  canvassedType?: string;
  canvasserIdentity?: string;

  associatedPersons?: string;
}

export interface FirmProfileFormState {
  data: FirmProfile;
  errors: FirmProfileErrors;
  isSubmitting: boolean;
  isValid: boolean;
  isDirty: boolean;
}

export interface AssociatedPersonFormInputs {
  customerCode: string;
  customerName: string;
  roleInFirm: RoleInFirm | null;
  authorizedSignatory: boolean;
  durationWithCompany: DurationWithCompany | null;
  customerIdentity?: string;
}

export const defaultFirmProfile: FirmProfile = {
  typeOfFirm: FirmType.SOLE_PROPRIETORSHIP,
  firmName: "",
  productIndustryCategory: "",
  registrationNo: "",
  registrationDate: "",
  canvassedType: CannelmentType.TYPE_A,
  canvasserIdentity: "",
  associatedPersons: [],
  status: "",
  firmCode: "",
};

export const defaultAssociatedPerson: AssociatedPerson = {
  customerCode: "",
  customerName: "",
  roleInFirm: RoleInFirm.EMPLOYEE,
  authorizedSignatory: false,
  durationWithCompany: DurationWithCompany.LESS_THAN_1_YEAR,
};

export const defaultAssociatedPersonFormInputs: AssociatedPersonFormInputs = {
  customerCode: "",
  customerName: "",
  roleInFirm: null,
  authorizedSignatory: false,
  durationWithCompany: null,
};

export type FormFieldChangeHandler = <K extends keyof FirmProfile>(
  field: K,
  value: FirmProfile[K]
) => void;

export type AssociatedPersonFieldChangeHandler = <
  K extends keyof AssociatedPersonFormInputs,
>(
  field: K,
  value: AssociatedPersonFormInputs[K]
) => void;

export interface AssociatedPersonOperations {
  addPerson: (person: AssociatedPerson) => void;
  removePerson: (customerCode: string) => void;
  updatePerson: (
    customerCode: string,
    updates: Partial<AssociatedPerson>
  ) => void;
  resetForm: () => void;
}

export interface SearchOperations {
  searchAssociate: (query: string) => Promise<AssociatedPerson[]>;
  searchFirm: (query: string) => Promise<FirmProfile[]>;
}

export interface SaveFirmProfileRequest {
  firmProfile: FirmProfile;
}

export interface SaveFirmProfileResponse {
  success: boolean;
  message: string;
  firmId?: string;
  errors?: FirmProfileErrors;
}

export interface SearchAssociateRequest {
  query: string;
  filters?: {
    role?: RoleInFirm;
    minDuration?: DurationWithCompany;
  };
}

export interface SearchAssociateResponse {
  results: AssociatedPerson[];
  total: number;
}

export interface GetFirmProfileRequest {
  firmId: string;
}

export interface GetFirmProfileResponse {
  success: boolean;
  data?: FirmProfile;
  message?: string;
}

export interface FirmProfileScreenProps {
  firmId?: string;
  onSave?: (profile: FirmProfile) => void;
  onCancel?: () => void;
  mode?: "create" | "edit" | "view";
}

export interface AssociatedPersonTableProps {
  persons: AssociatedPerson[];
  onRemove: (customerCode: string) => void;
  onEdit?: (person: AssociatedPerson) => void;
  isEditable?: boolean;
}

export interface AssociatedPersonFormProps {
  formData: AssociatedPersonFormInputs;
  onChange: AssociatedPersonFieldChangeHandler;
  onAdd: () => void;
  onSearch: (query: string) => void;
  onReset: () => void;
  isLoading?: boolean;
}

export interface DropdownOption<T = string> {
  label: string;
  value: T;
}

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: unknown) => string | undefined;
}

export interface FieldConfig {
  name: keyof FirmProfile | keyof AssociatedPersonFormInputs;
  label: string;
  type: "text" | "select" | "date" | "checkbox" | "search";
  placeholder?: string;
  required?: boolean;
  validation?: ValidationRule;
  options?: DropdownOption[];
}

export type NavigationAction = "previous" | "next" | "save";

export interface NavigationState {
  canGoBack: boolean;
  canGoNext: boolean;
  currentStep?: number;
  totalSteps?: number;
}

export const FIRM_TYPE_OPTIONS: DropdownOption<FirmType>[] = [
  { label: "Sole Proprietorship", value: FirmType.SOLE_PROPRIETORSHIP },
  { label: "Partnership", value: FirmType.PARTNERSHIP },
  { label: "Private Limited", value: FirmType.PRIVATE_LIMITED },
  { label: "Public Limited", value: FirmType.PUBLIC_LIMITED },
  { label: "LLP", value: FirmType.LLP },
];

export const CANNELMENT_TYPE_OPTIONS: DropdownOption<CannelmentType>[] = [
  { label: "Type A", value: CannelmentType.TYPE_A },
  { label: "Type B", value: CannelmentType.TYPE_B },
  { label: "Type C", value: CannelmentType.TYPE_C },
];

export const ROLE_IN_FIRM_OPTIONS: DropdownOption<RoleInFirm>[] = [
  { label: "Director", value: RoleInFirm.DIRECTOR },
  { label: "Manager", value: RoleInFirm.MANAGER },
  { label: "Partner", value: RoleInFirm.PARTNER },
  { label: "Proprietor", value: RoleInFirm.PROPRIETOR },
  { label: "Employee", value: RoleInFirm.EMPLOYEE },
];

export const DURATION_WITH_COMPANY_OPTIONS: DropdownOption<DurationWithCompany>[] =
  [
    { label: "< 1 Year", value: DurationWithCompany.LESS_THAN_1_YEAR },
    { label: "1-3 Years", value: DurationWithCompany.ONE_TO_THREE_YEARS },
    { label: "3-5 Years", value: DurationWithCompany.THREE_TO_FIVE_YEARS },
    { label: "5-10 Years", value: DurationWithCompany.FIVE_TO_TEN_YEARS },
    { label: "> 10 Years", value: DurationWithCompany.MORE_THAN_TEN_YEARS },
  ];
