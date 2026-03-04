import * as yup from "yup";

export const documentTypeSchema = yup.object({
  documentTypeCode: yup
    .string()
    .required("Document Type Code is required")
    .matches(/^[A-Z0-9_]+$/, "Only uppercase letters, numbers and _ allowed")
    .max(20, "Maximum 20 characters allowed"),

  displayName: yup
    .string()
    .required("Display Name is required")
    .max(50, "Maximum 50 characters allowed"),

  remarks: yup.string().max(200, "Maximum 200 characters allowed").nullable(),
});
