export interface ChargeDetailsFormData {
  chargeCode?: string;
  chargeName: string;
  module: string;
  subModule: string;
  calculationOn: string;
  chargeCalculation: string;
  chargeIncomeGLAccount: string;
  monthAmount: string;
  calculationCriteria: string;
  chargesPostingRequired: boolean;
  isActive: boolean;
}

export interface SaveChargeDetailsPayload {
  chargeCode?: string;
  chargeName: string;
  module: string;
  subModule: string;
  calculationOn: string;
  chargeCalculation: string;
  chargeIncomeGLAccount: string;
  monthAmount: string;
  calculationCriteria: string;
  chargesPostingRequired: boolean;
  [key: string]: unknown;
  isActive: boolean;
}

export interface PaginatedChargeSearchResponse {
  content: ChargeSearchData[];
  totalPages: number;
  totalElements: number;
  page: number;
  size: number;
}

export interface UpdateChargeDetailsPayload {
  chargeId: string;
  chargeCode: string;
  chargeName: string;
  module: string;
  subModule: string;
  calculationOn: string;
  chargeCalculation: string;
  chargeIncomeGLAccount: string;
  monthAmount: string;
  calculationCriteria: string;
  chargesPostingRequired: boolean;
  [key: string]: unknown;
  isActive: boolean;
}

export interface ChargeDetailsData {
  chargeId: string;
  chargeCode: string;
  chargeName: string;
  module: string;
  subModule: string;
  calculationOn: string;
  chargeCalculation: string;
  chargeIncomeGLAccount: string;
  monthAmount: string;
  calculationCriteria: string;
  chargesPostingRequired: boolean;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
  isActive: boolean;
}

export interface CalculationLogicFormData {
  upToAmount: string;
  chargeAmountPercentage: string;
}

export interface CalculationLogicData {
  id?: number;
  upToAmount: string;
  chargeAmountPercentage: string;
}

export interface StateConfiguration {
  specificToState: boolean;
  selectedStates: string[];
  northZoneEnabled: boolean;
  southZoneEnabled: boolean;
}

export interface TaxConfigurationData {
  ifTaxApplicable: boolean;
  taxInclusive?: string;

  singleTaxMethod: boolean;
  singleTaxMethodValue?: string;

  cgstApplicable: boolean;
  cgstPercentage?: string;
  cgstGLAccount?: string;

  sgstApplicable: boolean;
  sgstPercentage?: string;
  sgstGLAccount?: string;

  igstApplicable: boolean;
  igstPercentage?: string;
  igstGLAccount?: string;

  cessApplicable: boolean;
  cessPercentage?: string;
  cessGLAccount?: string;
}

export interface ChargeMasterFormData {
  chargeDetails: ChargeDetailsFormData;
  calculationLogic: {
    calculationLogics: CalculationLogicData[];
  };
  stateConfiguration: StateConfiguration;
  taxConfiguration: TaxConfigurationData;
}

export interface FormValidationState {
  chargeDetails: boolean;
  calculationLogic: boolean;
  stateConfiguration: boolean;
  taxConfiguration: boolean;
}

export interface ChargeMasterApiResponse {
  identity: string;
  chargeCode: string;
  chargeName: string;
  module: string;
  subModule: string;
  calculationOn: string;
  chargeCalculation: string;
  chargeIncomeGLAccount: string;
  monthAmount: string;
  calculationCriteria: string;
  chargesPostingRequired: boolean;
  calculationLogic: CalculationLogicData[];
  stateConfiguration: StateConfiguration;
  taxConfiguration: TaxConfigurationData;
  active: boolean;
}

export interface ChargeSearchFormData {
  chargeCode: string;
  chargeName: string;
  module: string;
}

export interface ChargeSearchData extends Record<string, unknown> {
  chargeId: string;
  chargeCode: string;
  chargeName: string;
  module: string;
  subModule: string;
  calculationOn: string;
  chargeCalculation: string;
  chargeIncomeGLAccount: string;
  monthAmount: string;
  calculationCriteria: string;
  chargesPostingRequired: string;
  isActive: boolean;
  originalData?: {
    module: string;
    subModule: string;
    calculationOn: string;
    chargeCalculation: string;
    chargeIncomeGLAccount: string;
    monthAmount: string;
    calculationCriteria: string;
  };
}

export interface ChargeSearchResponse {
  content: ChargeDetailsData[];
  totalPages: number;
  totalElements: number;
  page: number;
  size: number;
}

export interface ConfigOption {
  value: string;
  label: string;
  identity?: string;
}

export interface ModuleConfigOption extends ConfigOption {
  subModules: Array<{
    identity: string;
    subModuleName: string;
    subModuleCode: string;
    isActive: boolean;
  }>;
}
export interface ChargeMasterState {
  isReady: boolean;
  isEditMode: boolean;
  currentChargeId: string | null;
  activeTab:
    | "charge-details"
    | "calculation-logic"
    | "state-config"
    | "tax-config";
}

export interface GLAccountSearchResponse {
  identity: string;
  glCode: string;
  glName: string;
}

export interface GLAccount {
  identity: string;
  glCode: string;
  glName: string;
  level: number;
}

export interface ZoneOption {
  identity: string;
  zoneName: string;
  description: string;
  isActive: boolean;
}

export interface StateZoneConfig {
  identity: string;
  stateName: string;
  stateIdentity: string;
  zoneName: string;
  zoneIdentity: string;
}

export interface GroupedStates {
  [zoneIdentity: string]: StateZoneConfig[];
}

// New interfaces for Save functionality
export interface CalculationSlabDTO {
  upToAmount: number;
  chargeAmountPercentage: number;
}

export interface StateConfigDTO {
  stateZoneConfigIdentity: string;
  applicable: boolean;
}

export interface TaxConfigDTO {
  taxApplicable: boolean;
  taxTreatmentIdentity?: string;
  singleTaxMethod: boolean;
  singleTaxMethodIdentity?: string;
  cgstApplicable: boolean;
  cgstPercentage?: number;
  cgstGlAccountIdentity?: string;
  sgstApplicable: boolean;
  sgstPercentage?: number;
  sgstGlAccountIdentity?: string;
  igstApplicable: boolean;
  igstPercentage?: number;
  igstGlAccountIdentity?: string;
  cessApplicable: boolean;
  cessPercentage?: number;
  cessGlAccountIdentity?: string;
}

export interface SaveChargeMasterPayload {
  chargeName: string;
  moduleIdentity: string;
  subModuleIdentity: string;
  calculationBasisIdentity: string;
  calculationTypeIdentity: string;
  incomeGlAccountIdentity: string;
  monthAmountTypeIdentity: string;
  calculationCriteriaIdentity: string;
  chargesPostingRequired: boolean;
  calculationSlabsDTO: CalculationSlabDTO[];
  stateConfigsDTO: StateConfigDTO[];
  taxConfigsDTO: TaxConfigDTO;
  [key: string]: unknown;
}

export interface SaveChargeMasterResponse {
  identity: string;
  chargeCode: string;
  chargeName: string;
  message?: string;
}
