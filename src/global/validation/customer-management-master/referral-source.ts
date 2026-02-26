import * as yup from "yup";

export const referralSourceSchema = yup.object({
  id: yup.string(),
  referralCode: yup
    .string()
    .required("Referral Code is required")
    .max(20, "Max 20 characters"),

  referralName: yup
    .string()
    .required("Referral Name is required")
    .max(50, "Max 50 characters"),
});
