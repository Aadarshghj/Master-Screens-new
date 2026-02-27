import * as yup from "yup";

export const msmeTypeSchema = yup.object({

  msmeType: yup
    .string()
    .transform(v => v?.toUpperCase().trim())
    .required("MSME Type is required")
    .matches(/^[A-Z0-9/_]+$/, "Only uppercase letters and numbers allowed")
    .max(20, "Maximum 20 characters allowed")
    .test(
    "no-repeated-chars",
    "Repeated characters are not allowed",
    value => !value || !/(.)\1{2,}/.test(value)
  ),

  msmeTypeDesc: yup
    .string()
    .max(200, "Maximum 200 characters allowed")
    .nullable(),

  status: yup.boolean(),
});
