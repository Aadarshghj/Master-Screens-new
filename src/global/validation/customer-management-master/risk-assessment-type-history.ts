import * as yup from 'yup'

const existingTypes = [""]
export const riskAssessmentTypeHistorySchema =  yup.object({

identity:yup
.string(),

    riskAssessmentType:yup
    .string()
    .required("Risk Assessment Type is required")
    .max(30,"Maximum 30 characters allowed")
    .matches(
  /^[A-Za-z0-9_/ ]+$/,
  "Only alphanumeric characters, underscore (_) and slash (/) are allowed")
    .test(
        "Risk Assessment check",
        "existing risk type already exists",
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