import * as yup from "yup";

export const assetModelSchema = yup.object({
  assetItem: yup
    .string()
    .required("Asset Item is required"),

  assetModelCode: yup
    .string()
    .required("Asset Model Code is required")
    .max(30, "Maximum 30 characters"),

  description: yup
    .string()
    .notRequired()
    .max(40, "Maximum 40 characters"),

});
