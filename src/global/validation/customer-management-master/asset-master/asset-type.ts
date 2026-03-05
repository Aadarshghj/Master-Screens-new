import * as yup from "yup";

export const assetTypeSchema = yup.object({
  assetTypeCode: yup
    .string()
    .matches(/^[A-Z0-9_]+$/, "Only uppercase letters, numbers and _ allowed")
    .max(20, "Maximum 20 characters allowed"),

  assetTypeName: yup
    .string()
    .required("Asset Type is required")
    .max(50, "Maximum 50 characters allowed"),

  description: yup
    .string().max(200, "Maximum 200 characters allowed").nullable(),
})