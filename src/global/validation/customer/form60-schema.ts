import * as yup from "yup";
import type { Form60FormData } from "@/types/customer/form60.types";

const namePattern = /^[a-zA-Z\s.''-]+$/;
// const authorityPattern = /^[A-Za-z0-9\s.,-]+$/;
const mobilePattern = /^[6-9]\d{9}$/;
const pincodePattern = /^\d{6}$/;

const messages = {
  required: (field: string) => `${field} is required`,
  invalidFormat: (field: string) => `Invalid ${field.toLowerCase()} format`,
  invalidDate: "Invalid date format",
  futureDate: "Date cannot be in the future",
  invalidMobile: "Must be a valid 10-digit",
  invalidAadhar: "Aadhaar must be 12 digits, first digit cannot be 0 or 1",
  invalidPincode: "Must be a valid 6-digit pincode",
  invalidAmount: "Amount must be greater than 0",
  invalidPersons: "Number of persons must be at least 1",
  invalidPAN:
    "PAN must be in format: AAAAA9999A (5 letters, 4 numbers, 1 letter)",
  invalidDL:
    "Driving License must be in format: KA01 20230012345 (State + RTO + Year + Serial)",
  invalidPassport: "Passport must be in format: A1234567 (1 letter + 7 digits)",
  invalidVoterId:
    "Voter ID must be in format: ABC1234567 (3 letters + 7 digits)",
  invalidUtilityBill: "Utility Bill number must be at least 8 characters",
  invalidBankStatement: "Bank Statement number must be at least 10 characters",
  invalidRationCard: "Ration Card must be in format: 123456789012 (12 digits)",
};

const nameSchema = (fieldName: string, required = true) => {
  const schema = yup
    .string()
    .transform(value => value?.trim() || "")
    .matches(namePattern, messages.invalidFormat(fieldName));

  return required
    ? schema.required(messages.required(fieldName))
    : schema.default("");
};

// const authoritySchema = (fieldName: string) =>
//   yup
//     .string()
//     .required(messages.required(fieldName))
//     .transform(value => value?.trim() || "")
//     .matches(authorityPattern, messages.invalidFormat(fieldName));

// Document type specific validation functions

const dateSchema = (fieldName: string) =>
  yup
    .string()
    .required(messages.required(fieldName))
    .test("valid-date", messages.invalidDate, value =>
      value ? !isNaN(new Date(value).getTime()) : false
    )
    .test("not-future-date", messages.futureDate, value => {
      if (!value) return true;
      return new Date(value) <= new Date();
    });

// Helper function to get current income label based on source
export const getCurrentIncomeLabel = (
  sourceOfIncome: string,
  sourceOfIncomeOptions: Array<{ value: string; label: string }>
): string => {
  const selectedSource = sourceOfIncomeOptions.find(
    option => option.value === sourceOfIncome
  );
  return selectedSource ? `${selectedSource.label} (Rs.)` : "Income (Rs.)";
};

export const transformFormData = (
  data: Partial<Form60FormData>
): Form60FormData => {
  return {
    customerId: data.customerId || 0,
    branchId: data.branchId || "",
    customerName: data.customerName?.trim() || "",
    dateOfBirth: data.dateOfBirth || "",
    fatherName: data.fatherName?.trim() || "",
    flatRoomNo: data.flatRoomNo?.trim() || "",
    roadStreetLane: data.roadStreetLane?.trim() || "",
    areaLocality: data.areaLocality?.trim() || "",
    townCity: data.townCity?.trim() || "",
    district: data.district?.trim() || "",
    state: data.state?.trim() || "",
    pinCode: data.pinCode || "",
    mobileNumber: data.mobileNumber?.trim() || "",
    sourceOfIncome: data.sourceOfIncome || "",
    agriculturalIncome:
      typeof data.agriculturalIncome === "string"
        ? parseFloat(data.agriculturalIncome) || 0.0
        : data.agriculturalIncome || 0.0,
    otherIncome:
      typeof data.otherIncome === "string"
        ? parseFloat(data.otherIncome) || 0.0
        : data.otherIncome || 0.0,
    taxableIncome:
      typeof data.taxableIncome === "string"
        ? parseFloat(data.taxableIncome) || 0.0
        : data.taxableIncome || 0.0,
    nonTaxableIncome:
      typeof data.nonTaxableIncome === "string"
        ? parseFloat(data.nonTaxableIncome) || 0.0
        : data.nonTaxableIncome || 0.0,
    modeOfTransaction: data.modeOfTransaction || "BANK",
    transactionAmount:
      typeof data.transactionAmount === "string"
        ? parseFloat(data.transactionAmount) || 0.0
        : data.transactionAmount || 0.0,
    transactionDate:
      data.transactionDate || new Date().toISOString().split("T")[0],
    numberOfPersons: data.numberOfPersons || "",
    panCardApplicationDate: data.panCardApplicationDate || "",
    panCardApplicationAckNo: data.panCardApplicationAckNo?.trim() || "",
    pidDocumentCode: data.pidDocumentCode || "",
    pidDocumentId: data.pidDocumentId || "",
    pidDocumentNo: data.pidDocumentNo?.trim() || "",
    pidIssuingAuthority: data.pidIssuingAuthority?.trim() || "",
    addDocumentCode: data.addDocumentCode || "",
    addDocumentId: data.addDocumentId || "",
    addDocumentNo: data.addDocumentNo?.trim() || "",
    addIssuingAuthority: data.addIssuingAuthority?.trim() || "",
    maskedAdhar: data.maskedAdhar?.trim() || "",
    telephoneNumber: data.telephoneNumber?.trim() || "",
    floorNumber: data.floorNumber?.trim() || "",
    nameOfPremises: data.nameOfPremises?.trim() || "",
    submissionDate:
      data.submissionDate || new Date().toISOString().split("T")[0],
    formFileId: data.formFileId || 1,
    createdBy: data.createdBy || 1001,
    // DMS File Upload Fields
    docRefId: data.docRefId || "",
    fileName: data.fileName || "",
    filePath: data.filePath || "",
  };
};

export const form60ValidationSchema: yup.ObjectSchema<Form60FormData> =
  yup.object({
    // Form Details Section
    customerId: yup.number().optional(),
    branchId: yup.string().required(messages.required("Branch code")),
    customerName: nameSchema("Customer Name"),
    dateOfBirth: dateSchema("Date of Birth"),
    fatherName: nameSchema("Father's Name"),

    // Address Information Section
    flatRoomNo: yup.string().required(messages.required("Flat/Room No")),
    roadStreetLane: yup
      .string()
      .required(messages.required("Road/Street/Lane")),
    areaLocality: yup.string().required(messages.required("Area/Locality")),
    townCity: yup.string().required(messages.required("Town/City")),
    district: yup.string().required(messages.required("District")),
    state: yup.string().required(messages.required("State")),
    pinCode: yup
      .string()
      .required(messages.required("PIN Code"))
      .matches(pincodePattern, messages.invalidPincode),
    mobileNumber: yup
      .string()
      .required(messages.required("Mobile number"))
      .matches(mobilePattern, messages.invalidMobile),

    // Income Details Section
    sourceOfIncome: yup
      .string()
      .required(messages.required("Source of Income")),
    agriculturalIncome: yup
      .number()
      .transform((value, originalValue) => (originalValue === "" ? 0 : value))
      .required(messages.required("Agricultural Income"))
      .min(0, messages.invalidAmount)
      .default(0),
    otherIncome: yup
      .number()
      .required(messages.required("Other Income"))
      .min(0, messages.invalidAmount),
    taxableIncome: yup
      .number()
      .required(messages.required("Taxable Income"))
      .min(0, messages.invalidAmount),
    nonTaxableIncome: yup
      .string()
      .required(messages.required("Non-taxable Income"))
      .min(0, messages.invalidAmount),

    // Additional Details Section
    modeOfTransaction: yup
      .mixed<"CASH" | "BANK" | "ONLINE">()
      .oneOf(["CASH", "BANK", "ONLINE"], "Invalid transaction mode")
      .required(messages.required("Mode of transaction")),
    transactionAmount: yup
      .number()
      .required(messages.required("Transaction amount"))
      .min(1, "Transaction amount must be greater than zero")
      .max(500000, "Transaction amount cannot exceed ₹5,00,000"),
    transactionDate: dateSchema("Transaction date"),
    numberOfPersons: yup
      .mixed<string | number>()
      .test("is-number", "Number of persons must be a valid number", value => {
        if (value === "" || value === null || value === undefined) return true; // Allow empty
        return !isNaN(Number(value));
      })
      .test("is-positive", messages.invalidPersons, value => {
        if (value === "" || value === null || value === undefined) return true; // Allow empty
        return Number(value) >= 1;
      })
      .transform(value => {
        if (value === "" || value === null || value === undefined) return "";
        const num = Number(value);
        return isNaN(num) ? "" : num;
      })
      .default(""),
    panCardApplicationDate: yup
      .string()
      .default("")
      // .required(messages.required("PAN Card Application Date"))
      .test(
        "valid-date",
        messages.invalidDate,
        value => !value || !isNaN(new Date(value).getTime())
      ),
    panCardApplicationAckNo: yup.string().default(""),
    // .required(
    //   messages.required("PAN Card Application Acknowledgment Number")
    // ),
    // Identity Support Document Section
    pidDocumentCode: yup.string().default(""),
    // .required(messages.required("Document Code for Identity")),
    pidDocumentNo: yup.string().default(""),
    // .required(messages.required("Document Number for Identity")),
    pidIssuingAuthority: yup
      .string()
      .matches(/^[a-zA-Z0-9]*$/, "Only alphanumeric characters are allowed")
      .default(""),
    // .required(messages.required("Issuing Authority for Identity")),

    // Address Support Document Section
    addDocumentCode: yup.string().default(""),
    // .required(messages.required("Document Code for Address")),
    addDocumentNo: yup.string().default(""),
    // .required(messages.required("Document Number for Address")),
    addIssuingAuthority: yup
      .string()
      .matches(/^[a-zA-Z0-9]*$/, "Only alphanumeric characters are allowed")
      .default(""),
    // .required(messages.required("Issuing Authority for Address")),

    // Additional fields for backend payload
    pidDocumentId: yup.string().default(""),
    addDocumentId: yup.string().default(""),
    maskedAdhar: yup.string().default(""),
    telephoneNumber: yup.string().default(""),
    floorNumber: yup.string().default(""),
    nameOfPremises: yup.string().default(""),

    // Backend/System Fields (auto-filled)
    submissionDate: yup.string().required(messages.required("Submission date")),
    formFileId: yup.number().required(messages.required("Form file ID")),
    createdBy: yup.number().optional(),

    // DMS File Upload Fields
    docRefId: yup.string().optional(),
    fileName: yup.string().optional(),
    filePath: yup.string().optional(),

    identity: yup.string().optional(),
  });

// Field-specific validation functions for individual field validation
export const validateField = async <K extends keyof Form60FormData>(
  fieldName: K,
  value: Form60FormData[K],
  formData: Form60FormData
): Promise<string | null> => {
  try {
    await form60ValidationSchema.validateAt(fieldName, {
      ...formData,
      [fieldName]: value,
    });
    return null;
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return error.message;
    }
    return "Validation error";
  }
};
