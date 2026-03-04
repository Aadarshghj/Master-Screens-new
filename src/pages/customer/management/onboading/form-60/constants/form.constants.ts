import type { Form60FormData } from "@/types";

export const DEFAULT_FORM_VALUES: Form60FormData = {
  // Form Details Section
  customerId: 0,
  branchId: "",
  customerName: "",
  dateOfBirth: "",
  fatherName: "",

  // Address Information Section
  flatRoomNo: "",
  roadStreetLane: "",
  areaLocality: "",
  townCity: "",
  district: "",
  state: "",
  pinCode: "",
  mobileNumber: "",

  // Income Details Section
  sourceOfIncome: "",
  agriculturalIncome: "",
  otherIncome: "",
  taxableIncome: "",
  nonTaxableIncome: "",

  // Additional Details Section
  modeOfTransaction: "BANK",
  transactionAmount: "",
  transactionDate: new Date().toISOString().split("T")[0],
  numberOfPersons: "",
  panCardApplicationDate: "",
  panCardApplicationAckNo: "",

  // Identity Support Document Section
  pidDocumentCode: "",
  pidDocumentId: "",
  pidDocumentNo: "",
  pidIssuingAuthority: "",

  // Address Support Document Section
  addDocumentCode: "",
  addDocumentId: "",
  addDocumentNo: "",
  addIssuingAuthority: "",

  // Additional fields
  maskedAdhar: "",
  telephoneNumber: "",
  floorNumber: "",
  nameOfPremises: "",

  // Backend/System Fields
  submissionDate: new Date().toISOString().split("T")[0],
  formFileId: 1,
  createdBy: 1001,
};
