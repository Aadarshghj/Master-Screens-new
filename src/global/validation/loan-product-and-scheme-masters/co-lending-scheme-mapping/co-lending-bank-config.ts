import * as yup from "yup";

export const bankConfigTypeSchema = yup.object({
  bankCode: yup
  .string()
  .required("Bank Code is required")
  .matches(/^[A-Z0-9]+$/, "Bank Code must contain only uppercase letters and numbers"),

  bankName: yup
  .string()
  .required("Bank Name is required")
  .matches(/^[A-Za-z0-9 ]+$/, "Bank Name must contain only letters and numbers"),

  isActive: yup
  .boolean(),

  interestRate: yup
  .number()
  .required("Interest % is required")
  .min(0, "Interest % cannot be negative")
  .max(100, "Interest % cannot exceed 100%"),

  interestCalcOn: yup
  .string()
  .required("Interest Calculated On is required"),

  handoff: yup
  .string()
  .required("Hand-off File is required"),

  mode: yup
  .boolean(),

  clmId: yup
  .boolean(),
})