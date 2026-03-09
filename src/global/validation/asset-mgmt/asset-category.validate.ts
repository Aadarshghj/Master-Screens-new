import * as yup from "yup";

export const assetCategorySchema = yup.object({
  assetGroupCode: yup
  .string(),

  assetCategoryName: yup
    .string()
    .required("Asset Category Name is required")
    .matches(/^[A-Z0-9-/]+$/, "Only uppercase letters and numbers allowed")
    .max(20, "Maximum 20 characters allowed"),

  assetCategoryDesc: yup
    .string()
    .max(200, "Maximum 200 characters allowed")
    .nullable(),

  status: yup.boolean(),
});
