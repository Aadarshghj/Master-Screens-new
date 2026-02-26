import type {
  BusinessInformation,
  ProfitabilityEntry,
} from "@/types/firm/firm-businessInfo";

export const businessInformationDefaultValues: BusinessInformation = {
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
  utilitiesAvailability: [],
  businessDescription: "",
  profitabilityData: [],
};

export const profitabilityEntryDefaultValues: ProfitabilityEntry = {
  year: "",
  amount: "",
};

export const businessFormMeta = {
  requiredFields: [
    "natureOfBusiness",
    "yearsInOperation",
    "annualTurnover",
    "noOfEmployees",
    "noOfBranchesOffices",
    "dateOfIncorporation",
    "authorizedCapital",
    "issuedCapital",
    "paidUpCapital",
    "netWorth",
    "businessEmail",
    "customerConcentration",
    "productClassification",
    "businessDescription",
  ],
  optionalFields: [
    "website",
    "otherSourceIncome",
    "seasonality",
    "sectorPerformance",
    "capacityUtilization",
    "utilitiesAvailability",
    "profitabilityData",
  ],
  dateFields: ["dateOfIncorporation"],
  numberFields: [
    "yearsInOperation",
    "annualTurnover",
    "noOfEmployees",
    "noOfBranchesOffices",
    "authorizedCapital",
    "issuedCapital",
    "paidUpCapital",
    "netWorth",
    "customerConcentration",
  ],
  textAreaFields: ["productClassification", "businessDescription"],
  arrayFields: ["utilitiesAvailability", "profitabilityData"],
  minProfitabilityEntries: 1,
  maxProfitabilityEntries: 10,
  maxDescriptionLength: 2000,
  maxClassificationLength: 500,
};

export const businessSearchFilterDefaultValues = {
  natureOfBusiness: "",
  yearsInOperation: "all",
  minAnnualTurnover: 0,
  maxAnnualTurnover: 0,
  noOfEmployees: "all",
  dateOfIncorporationFrom: "",
  dateOfIncorporationTo: "",
  sectorPerformance: "all",
  capacityUtilization: "all",
};

export const businessFieldLabels: Record<keyof BusinessInformation, string> = {
  natureOfBusiness: "Name of Business",
  yearsInOperation: "Years in Operation",
  annualTurnover: "Annual Turnover (Rs.)",
  noOfEmployees: "No of Employees",
  noOfBranchesOffices: "No. of Branches/Offices",
  dateOfIncorporation: "Date of Incorporation",
  authorizedCapital: "Authorized Capital (Rs.)",
  issuedCapital: "Issued Capital (Rs.)",
  paidUpCapital: "Paid-up Capital (Rs.)",
  netWorth: "Net Worth",
  website: "Website",
  businessEmail: "Business Email",
  mobileNumber: "Mobile Number",
  customerConcentration: "Customer Concentration (%)",
  otherSourceIncome: "Other Source Income",
  seasonality: "Seasonality",
  sectorPerformance: "Sector Performance",
  capacityUtilization: "Capacity Utilization (%)",
  productClassification: "Product Classification",
  utilitiesAvailability: "Utilities Availability",
  businessDescription: "Business Description",
  profitabilityData: "Profitability Data",
};

export const businessFieldPlaceholders: Record<string, string> = {
  natureOfBusiness: "Enter name of business",
  yearsInOperation: "Enter years in operation",
  annualTurnover: "Enter annual turnover",
  noOfEmployees: "More than 100",
  noOfBranchesOffices: "More than 100",
  dateOfIncorporation: "dd-mm-yyyy",
  authorizedCapital: "Enter authorized capital",
  issuedCapital: "Enter issued capital",
  paidUpCapital: "Enter paid-up capital",
  netWorth: "Enter net worth",
  website: "www.website.com",
  businessEmail: "Enter business email",
  customerConcentration: "Enter percentage",
  productClassification: "Enter product classification",
  businessDescription: "Enter business description",
  profitabilityYear: "Profitability last 5 years",
  profitabilityAmount: "1000000",
};

export const businessValidationMessages = {
  required: (fieldName: string) => `${fieldName} is required`,
  minLength: (fieldName: string, min: number) =>
    `${fieldName} must be at least ${min} characters`,
  maxLength: (fieldName: string, max: number) =>
    `${fieldName} must not exceed ${max} characters`,
  minValue: (fieldName: string, min: number) =>
    `${fieldName} must be at least ${min}`,
  maxValue: (fieldName: string, max: number) =>
    `${fieldName} must not exceed ${max}`,
  invalidEmail: "Please enter a valid email address",
  invalidUrl: "Please enter a valid website URL",
  invalidDate: "Please enter a valid date",
  futureDate: "Date cannot be in the future",
  capitalHierarchy: {
    issuedExceedsAuthorized: "Issued capital cannot exceed authorized capital",
    paidUpExceedsIssued: "Paid-up capital cannot exceed issued capital",
  },
  profitability: {
    minEntries: "At least one profitability entry is required",
    uniqueYears: "Profitability years must be unique",
    invalidYear: "Please enter a valid year",
  },
};

export const businessFormSteps = [
  {
    id: "basic-info",
    title: "Basic Information",
    fields: [
      "natureOfBusiness",
      "yearsInOperation",
      "noOfEmployees",
      "noOfBranchesOffices",
      "dateOfIncorporation",
    ],
  },
  {
    id: "financial-info",
    title: "Financial Information",
    fields: [
      "annualTurnover",
      "authorizedCapital",
      "issuedCapital",
      "paidUpCapital",
      "netWorth",
    ],
  },
  {
    id: "contact-info",
    title: "Contact Information",
    fields: ["website", "businessEmail"],
  },
  {
    id: "operational-info",
    title: "Operational Information",
    fields: [
      "customerConcentration",
      "otherSourceIncome",
      "seasonality",
      "sectorPerformance",
      "capacityUtilization",
      "productClassification",
      "utilitiesAvailability",
      "businessDescription",
    ],
  },
  {
    id: "profitability-info",
    title: "Profitability Information",
    fields: ["profitabilityData"],
  },
];

export const getProfitabilityYears = (numberOfYears: number = 5): string[] => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: numberOfYears }, (_, i) =>
    (currentYear - i).toString()
  );
};

export const isFieldRequired = (fieldName: string): boolean => {
  return businessFormMeta.requiredFields.includes(fieldName);
};

export const getFieldType = (
  fieldName: string
):
  | "text"
  | "number"
  | "date"
  | "email"
  | "url"
  | "textarea"
  | "select"
  | "multiselect" => {
  if (businessFormMeta.dateFields.includes(fieldName)) return "date";
  if (businessFormMeta.numberFields.includes(fieldName)) return "number";
  if (businessFormMeta.textAreaFields.includes(fieldName)) return "textarea";
  if (fieldName === "businessEmail") return "email";
  if (fieldName === "website") return "url";
  if (businessFormMeta.arrayFields.includes(fieldName)) {
    return fieldName === "utilitiesAvailability" ? "multiselect" : "select";
  }
  return "text";
};

export const businessRules = {
  minYearsInOperation: 0,
  maxYearsInOperation: 200,
  minEmployees: 0,
  minBranches: 0,
  minCapital: 0,
  minCustomerConcentration: 0,
  maxCustomerConcentration: 100,
  minDescriptionLength: 10,
  maxDescriptionLength: 2000,
  minClassificationLength: 2,
  maxClassificationLength: 500,
  emailVerificationRequired: true,
};

export const businessApiEndpoints = {
  save: "/api/business-information/save",
  get: "/api/business-information/get",
  search: "/api/business-information/search",
  verifyEmail: "/api/business-information/verify-email",
  update: "/api/business-information/update",
  delete: "/api/business-information/delete",
};

export const BUSINESS_FORM_CONSTANTS = {
  defaultValues: businessInformationDefaultValues,
  profitabilityDefaults: profitabilityEntryDefaultValues,
  meta: businessFormMeta,
  labels: businessFieldLabels,
  placeholders: businessFieldPlaceholders,
  validationMessages: businessValidationMessages,
  steps: businessFormSteps,
  rules: businessRules,
  searchDefaults: businessSearchFilterDefaultValues,
  apiEndpoints: businessApiEndpoints,
} as const;
