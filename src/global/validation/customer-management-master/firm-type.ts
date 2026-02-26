import * as yup from "yup";

export const firmTypeSchema = yup.object({
  firmType: yup
    .string()
    .required("Firm Type is required")
    .max(50, "Maximum 50 characters allowed"),
  description: yup
    .string()
    .max(200, "Maximum 200 characters allowed")
    .nullable(),
});
