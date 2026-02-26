import type { BasicInfoFormData } from "@/types";

// Customer Status Constants
export const ACTIVE_CUSTOMER_STATUS_ID = "3d68631c-03b5-4ac9-99b5-19702caa5749";

export const DEFAULT_FORM_VALUES: BasicInfoFormData = {
  customerCode: "",
  crmReferenceId: "",
  salutation: "",
  firstName: "",
  middleName: "",
  lastName: "",
  aadharName: "",
  gender: "",
  dob: "",
  guardian: "",
  maritalStatus: "",
  spouseName: "",
  fatherName: "",
  motherName: "",
  taxCategory: "",
  customerStatus: ACTIVE_CUSTOMER_STATUS_ID, // Active status
  customerListType: "",
  loyaltyPoints: "0",
  valueScore: "",
  mobileNumber: "",
  mobileOtp: "",
  isBusiness: false,
  isFirm: false,
  documentVerified: false,
  activeStatus: false,
  customerId: "",
  age: 0,
  isMinor: false,
};
