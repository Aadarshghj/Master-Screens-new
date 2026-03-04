import type { ConfirmationModalData } from "@/layout/BasePageLayout";
import type { ConfigOption, SelectOption } from "./shared.types";

export interface EmploymentPayload {
  annualIncome: number;
  monthlySalary?: number;
  employer?: string;
  designationId: string;
  incomeSourceId: string;
  occupationId: string;
}

export interface ReferralsPayload {
  canvassedTypeId: string;
  canvasserStaffId: string | null;
  referralSourceId: string;
}

export interface ProfileExtraPayload {
  educationLevelId?: string;
  purposeId?: string;
}

export interface CustomerAssetPayload {
  assetTypeId?: string;
  ownsAsset: boolean;
  hasHomeLoan: boolean;
  homeLoanAmount?: number;
  homeLoanCompany?: string;
}

export interface CustomerPayload {
  nationality: string;
  preferredLanguageId?: string;
  residentialStatusId: string;
  customerGroupId?: string;
  riskCategory?: string;
  categoryId?: string;
}

export interface AdditionalReferenceValue {
  referenceIdentity: string;
  referenceValue: string;
}

export interface SaveAdditionalOptionalPayload {
  additional: {
    employment: EmploymentPayload;
    referrals: ReferralsPayload;
    profileExtra: ProfileExtraPayload;
    customerAsset: CustomerAssetPayload;
    customer: CustomerPayload;
    additionalReferenceValueDto: AdditionalReferenceValue[];
  };
}

export type SaveAdditionalOptionalRequest = SaveAdditionalOptionalPayload;

export type ValueType = "TEXT" | "NUMBER" | "DATE" | "STRING";
export interface MoreDetailsConfig {
  customerRefName: string;
  identity: string;
  valueType: ValueType;
  isActive: boolean;
  isMandatory: boolean;
  referenceIdentity: string;
  referenceValue: string;
}

export interface AdditionalOptionalFormData {
  occupation: string;
  designation: string;
  sourceOfIncome: string;
  annualIncome: string;
  monthlySalary: string;
  referralSource: string;
  canvassedType: string;
  canvasserId: string;
  employerDetails: string;
  customerGroup: string;
  riskCategory: string;
  customerCategory: string;
  nationality: string;
  residentialStatus: string;
  purpose: string;
  preferredLanguage: string;
  educationLevel: string;
  ownAnyAssets: "" | "yes" | "no";
  assetDetails: string;
  hasHomeLoan: "" | "yes" | "no";
  homeLoanAmount: string;
  homeLoanCompany: string;
  moreDetails: Record<string, string>;
}

export interface AdditionalOptionalFormErrors {
  occupation?: string;
  designation?: string;
  sourceOfIncome?: string;
  annualIncome?: string;
  monthlySalary?: string;
  referralSource?: string;
  canvassedType?: string;
  canvasserId?: string;
  employerDetails?: string;
  customerGroup?: string;
  riskCategory?: string;
  customerCategory?: string;
  nationality?: string;
  residentialStatus?: string;
  purpose?: string;
  preferredLanguage?: string;
  educationLevel?: string;
  ownAnyAssets?: string;
  assetDetails?: string;
  hasHomeLoan?: string;
  homeLoanAmount?: string;
  homeLoanCompany?: string;
  moreDetails?: Record<string, string>;
  general?: string;
}

export interface AdditionalOptionalResponse {
  identity: string;
  customerCode: string;
  status: "PENDING" | "VERIFIED" | "REJECTED";
  additional: {
    employment: {
      occupationId: string;
      designationId: string;
      employer: string;
      incomeSourceId: string;
      monthlySalary: number;
      annualIncome: number;
    };
    referrals: {
      referralSourceId: string;
      canvassedTypeId: string;
      canvasserName: string | null;
      canvasserStaffId: string | null;
    };
    profileExtra: {
      educationLevelId: string;
      purposeId: string;
    };
    assets: {
      assetTypeId?: string;
      ownsAsset: boolean;
      hasHomeLoan: boolean;
      homeLoanAmount?: number;
      homeLoanCompany?: string;
    } | null;
    additionalInfoCustomerDto: {
      nationality: string;
      preferredLanguageId: string;
      residentialStatusId: string;
      customerGroupId: string;
      riskCategory: string;
      categoryId: string;
    };
    additionalReferenceValueDto: Array<{
      referenceIdentity: string;
      referenceValue: string;
    }>;
  };
}

export interface AdditionalSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  // API response fields
  identity?: string;
  statusName?: string;
  isActive?: boolean;
}

// ConfigOption moved to shared.types.ts to avoid duplication

export interface AdditionalOptionalConfig {
  sourceOfIncomeOptions: ConfigOption[];
  nationalityOptions: ConfigOption[];
  residentialStatusOptions: ConfigOption[];
  purposeOptions: ConfigOption[];
  preferredLanguageOptions: ConfigOption[];
  educationLevelOptions: ConfigOption[];
  occupationOptions: SelectOption[];
  designationOptions: SelectOption[];
  referralSourceOptions: SelectOption[];
  canvassedTypeOptions: SelectOption[];
  customerGroupOptions: SelectOption[];
  riskCategoryOptions: SelectOption[];
  customerCategoryOptions: SelectOption[];
  assetDetailsOptions: SelectOption[];
}

export interface AdditionalOptionalState {
  isReady: boolean;
}

export interface AdditionalOptionalFormProps {
  readOnly?: boolean;
  customerIdentity?: string;
  isView?: boolean;
  handleSetConfirmationModalData?: (data: ConfirmationModalData) => void;
  confirmationModalData?: ConfirmationModalData;
}

export interface AdditionalOptionalRequestData {
  occupation?: string;
  designation?: string;
  sourceOfIncome?: string;
  annualIncome?: number;
  monthlySalary?: number;
  referralSource?: string;
  canvassedType?: string;
  canvasserId?: string;
  employerDetails?: string;
  customerGroup?: string;
  riskCategory?: string;
  customerCategory?: string;
  nationality?: string;
  residentialStatus?: string;
  purpose?: string;
  preferredLanguage?: string;
  educationLevel?: string;
  ownAnyAssets?: string;
  assetDetails?: string;
  hasHomeLoan?: string;
  homeLoanAmount?: number;
  homeLoanCompany?: string;
  moreDetails?: Record<string, string | number | boolean | null>;
  status?: string;
  createdBy?: number;
  updatedBy?: number;
}
