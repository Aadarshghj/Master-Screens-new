import * as yup from "yup";

export const bankSchema = yup.object({
  id: yup.string(),
  bankCode: yup
    .string()
    .required("Bank Code is required")
    .max(20, "Maximum 20 characters"),

  bankName: yup
    .string()
    .required("Bank Name is required")
    .max(100, "Maximum 100 characters"),

  swiftBicCode: yup
    .string()
    .required("SWIFT/BIC Code is required")
    .max(15, "Maximum 15 characters"),

  country: yup.string().required("Country is required"),

  psu: yup.boolean().required(),
});
