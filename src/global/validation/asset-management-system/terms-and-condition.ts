import * as yup from "yup";

export const termsAndConditionSchema = yup.object({

  termsandconditioncode: yup
  .string()
  .transform((value) => value?.trim())
  .required("Terms and Condition Code is required")
  .max(20, "Maximum 20 characters allowed")
  .matches(/^[A-Z0-9/_]+$/, "Only uppercase letters, numbers and underscore (_) allowed")
  .matches(/^(?!.*__)/, "Consecutive underscores are not allowed")
  .matches(/^(?!_)/, "Cannot start with underscore")
  .matches(/^(?!.*_$)/, "Cannot end with underscore"),

  termsandconditionname: yup
    .string()
    .transform((value) => value?.trim())
    .required("Terms and Condition Name is required")
    .max(150, "Maximum 150 characters allowed")
    .matches(/^[A-Za-z0-9 ]+$/, "Only letters, numbers and spaces allowed")
    .matches(/^(?!\s)/, "Cannot start with space")
    .matches(/^(?!.*\s$)/, "Cannot end with space")
    .matches(/^(?!.*\s{2,})/, "Multiple consecutive spaces are not allowed"),

  status: yup
    .string()
    .nullable()
   
});