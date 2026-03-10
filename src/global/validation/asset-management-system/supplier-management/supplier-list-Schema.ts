import * as yup from "yup";

export const supplierMasterSchema = yup.object({
  supplierName: yup
    .string()
    .required("Supplier Name is required")
    .max(100, "Maximum 100 characters allowed"),

  tradeName: yup
    .string()
    .required("Trade Name is required")
    .max(100, "Maximum 100 characters allowed"),

  panNumber: yup
    .string()
    .required("PAN Number is required")
    .matches(
      /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
      "PAN Number must be in valid format (ABCDE1234F)"
    ),

  gstin: yup
    .string()
    .required("GSTIN is required")
    .matches(
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{3}$/,
      "Enter a valid GSTIN"
    ),

  msmeNo: yup
    .string()
    .max(20, "Maximum 20 characters allowed")
    .optional()
    .nullable(),

  status: yup
    .string()
    .required("Status is required"),
});