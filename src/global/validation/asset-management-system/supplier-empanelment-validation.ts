import * as yup from 'yup'

const existingTypes = [""]
export const supplierEmpanelSchema =  yup.object({

identity:yup
.string(),

    supplierName:yup
    .string()
    .max(30,"Maximum 30 characters allowed")
    .matches(
  /^[A-Za-z0-9_/ ]+$/,
  "Only alphanumeric characters, underscore (_) and slash (/) are allowed"),
    


isActive:yup
.boolean()
.required(),
});