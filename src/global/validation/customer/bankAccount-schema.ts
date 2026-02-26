import * as yup from "yup";
import type { BankAccountFormData } from "@/types/customer/bank.types";

const isValidAccountNumber = (accountNumber: string): boolean => {
  if (!accountNumber) return false;
  return /^\d{9,18}$/.test(accountNumber);
};

const isValidIfsc = (ifsc: string): boolean => {
  if (!ifsc) return false;
  return /^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc.toUpperCase());
};

const isValidUpiId = (upiId: string): boolean => {
  if (!upiId) return true;
  // Only allow alphanumeric characters and @ symbol
  // Format: alphanumeric@alphanumeric
  return /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+$/.test(upiId);
};

export const bankAccountValidationSchema = yup.object({
  accountNumber: yup
    .string()
    .required("Account number is required")
    .test(
      "valid-account-number",
      "Account number must be 9-18 digits",
      value => (value ? isValidAccountNumber(value) : false)
    ),

  verifyAccountNumber: yup
    .string()
    .required("Please verify your account number")
    .oneOf([yup.ref("accountNumber")], "Account numbers do not match"),

  ifsc: yup
    .string()
    .required("IFSC code is required")
    .test("valid-ifsc", "Invalid IFSC format (e.g., SBIN0001234)", value =>
      value ? isValidIfsc(value) : false
    ),

  bankName: yup
    .string()
    .required("Bank name is required")
    .min(2, "Bank name must be at least 2 characters")
    .max(100, "Bank name must not exceed 100 characters"),

  branchName: yup
    .string()
    .required("Branch name is required")
    .min(2, "Branch name must be at least 2 characters")
    .max(100, "Branch name must not exceed 100 characters"),

  accountHolderName: yup
    .string()
    .required("Account holder name is required")
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must not exceed 100 characters"),
  // .matches(
  //   /^[a-zA-Z\s.'-]+$/,
  //   "Name can only contain letters, spaces, dots, hyphens, and apostrophes"
  // ),

  accountType: yup
    .string()
    .optional()
    .required("Account type is required")
    .default(""),
  // .when("$isRequired", {
  //   is: true,
  //   then: schema => schema.required("Account type is required"),
  //   otherwise: schema => schema,
  // }),

  upiId: yup
    .string()
    .default("")
    .test(
      "valid-upi",
      "Invalid UPI ID format. Only alphanumeric characters and @ symbol allowed (e.g., username@upi)",
      value => (!value || value === "" ? true : isValidUpiId(value))
    ),

  accountStatus: yup.string().required("Account status is required"),

  isPrimary: yup.boolean().required(),

  activeStatus: yup.boolean().required(),

  documentFile: yup
    .mixed<string | File>()
    .nullable()
    .default(null)
    .required("Please upload bank proof")
    .test(
      "fileSize",
      "File size must be less than 10MB",
      value =>
        !value || (value instanceof File && value.size <= 10 * 1024 * 1024)
    )
    .test(
      "fileType",
      "Only PDF, JPG, JPEG, PNG files are allowed",
      value =>
        !value ||
        (value instanceof File &&
          ["application/pdf", "image/jpeg", "image/jpg", "image/png"].includes(
            value.type
          ))
    ),

  // File upload and UI state moved to useForm
  dmsFileData: yup.mixed().nullable().optional(),
  pdStatus: yup
    .string()
    .transform(value => (value === null ? "" : value))
    .required("Please do verify account"),
});

export const transformFormData = (
  data: Partial<BankAccountFormData>
): BankAccountFormData => {
  return {
    accountNumber: data.accountNumber || "",
    verifyAccountNumber: data.verifyAccountNumber || "",
    ifsc: data.ifsc || "",
    bankName: data.bankName || "",
    branchName: data.branchName || "",
    accountHolderName: data.accountHolderName || "",
    accountType: data.accountType || "",
    upiId: data.upiId || "",
    accountStatus: data.accountStatus || "",
    isPrimary: data.isPrimary || false,
    activeStatus: data.activeStatus || true,
    documentFile: data.documentFile || null,
    customerCode: data.customerCode || "",
    dmsFileData: data.dmsFileData ?? null,
  };
};

export const bankAccountValidationUtils = {
  isValidAccountNumber,
  isValidIfsc,
  isValidUpiId,
  transformFormData,
};
