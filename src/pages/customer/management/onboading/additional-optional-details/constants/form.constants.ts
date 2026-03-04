import type { AdditionalOptionalFormData } from "@/types/customer/additional.types";
const englishCode = "5b986aa4-e964-4679-958d-3deced10020c";
export const DEFAULT_FORM_VALUES: AdditionalOptionalFormData = {
  occupation: "",
  designation: "",
  sourceOfIncome: "",
  annualIncome: "",
  monthlySalary: "",
  referralSource: "",
  canvassedType: "",
  canvasserId: "",
  employerDetails: "",
  customerGroup: "",
  riskCategory: "",
  customerCategory: "",
  nationality: "fed45540-db40-4bc1-ba7f-39f910e2e2d1", // India nationality ID
  residentialStatus: "",
  purpose: "",
  preferredLanguage: englishCode,
  educationLevel: "",
  ownAnyAssets: "no",
  assetDetails: "",
  hasHomeLoan: "no",
  homeLoanAmount: "",
  homeLoanCompany: "",
  moreDetails: {},
};
