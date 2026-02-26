import type { KycFormData } from "@/types";

export const DEFAULT_FORM_VALUES: KycFormData = {
  documentType: "ADH",
  idNumber: "",
  placeOfIssue: null,
  issuingAuthority: "",
  validFrom: null,
  validTo: null,
  documentFile: null,
  aadharOtp: null,
  documentVerified: false,
  activeStatus: false,
  captureBy: null,
  latitude: null,
  longitude: null,
  accuracy: null,
  captureDevice: null,
  locationDescription: null,
  filePath: null,
  captureTime: null,
  // nameOnDocument: "",
  fathersName: "",
  dateOfBirth: "",
  address: "",
  constituency: "",
  vehicleClasses: "",
  bloodGroup: "",
  dateOfIssue: "",
  validUntil: "",
  selectedFileName: "",
  selectedFile: null,
  dmsFileData: null,
  originalIdNumber: "",
  maskedAadharResponse: null,
  vaultId: "",
  verifiedIdNumber: "",
};

export const REQUIRED_FIELDS: (keyof KycFormData)[] = [
  "documentType",
  "idNumber",
  "documentFile",
];

export const AADHAR_FIELDS: (keyof KycFormData)[] = [
  "idNumber",
  "aadharOtp",
  "documentFile",
];

export const PAN_FIELDS: (keyof KycFormData)[] = ["idNumber", "documentFile"];

export const DOCUMENT_TYPE_CONFIG = {
  ADH: {
    label: "Aadhaar Number",
    placeholder: "Enter aadhaar number",
    hasValidityDates: false,
    hasOtpSection: true,
    requiredFields: ["idNumber", "aadharOtp", "documentFile"],
  },
  PAN: {
    label: "PAN Number",
    placeholder: "Enter pan card",
    hasValidityDates: false,
    hasOtpSection: false,
    requiredFields: ["idNumber", "documentFile"],
  },
  EID: {
    label: "Election ID",
    placeholder: "Enter election ID",
    hasValidityDates: true,
    hasOtpSection: false,
    requiredFields: ["idNumber", "documentFile", "validFrom", "validTo"],
  },
  RID: {
    label: "Ration ID",
    placeholder: "Enter ration ID",
    hasValidityDates: false,
    hasOtpSection: false,
    requiredFields: ["idNumber", "documentFile"],
  },
  DL: {
    label: "Driving License",
    placeholder: "Enter driving license",
    hasValidityDates: true,
    hasOtpSection: false,
    requiredFields: ["idNumber", "documentFile", "validFrom", "validTo"],
  },
} as const;
