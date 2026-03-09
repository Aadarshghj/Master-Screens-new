import * as yup from "yup";

export const moduleTypeSchema = yup.object({
  moduleCode: yup
  .string()
  .required("Module Code is required")
  .matches(/^[A-Z0-9]+$/, "Bank Code must contain only uppercase letters and numbers")
  .max(50,"Maximum 50 characters"),

  moduleName: yup
  .string()
  .required("Module Name is required")
  .matches(/^[A-Za-z0-9 ]+$/, "Bank Name must contain only letters, numbers and spaces")
  .max(100,"Maximum 100 characters"),

  description: yup
  .string()
  .required("Module Description is required")
  .max(150,"Maximum 150 characters"),

  isActive: yup
  .boolean(),

 identity: yup
 .string(),
})