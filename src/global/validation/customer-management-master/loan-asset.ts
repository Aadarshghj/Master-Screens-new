import * as yup from 'yup'

const existingTypes = [""]
export const LoanAssetClassifictionSchema =  yup.object({

identity:yup
.string(),

    assetClassificationName:yup
    .string()
    .required("Asset Classification Name is required")
    .max(30,"Maximum 30 characters allowed")
    .matches(
  /^[A-Za-z0-9_/ ]+$/,
  "Only alphanumeric characters, underscore (_) and slash (/) are allowed")
    .test(
        "Asset classification check",
        "existing Asset Classification Name already exists",
        value => !existingTypes.includes(value?.trim())
    ),

description: yup
  .string()
  .notRequired()
  .max(40, "Maximum 40 characters allowed"),
  

isActive:yup
.boolean()
.required(),
});