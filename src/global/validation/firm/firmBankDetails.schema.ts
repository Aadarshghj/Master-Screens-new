import * as yup from "yup";

export const bankDetailsValidationSchema = yup.object().shape({
  accountNumber: yup
    .string()
    .required("Account number is required")
    .matches(/^\d+$/, "Account number must contain only digits")
    .min(9, "Account number must be at least 9 digits")
    .max(18, "Account number cannot exceed 18 digits"),

  verifyAccountNumber: yup
    .string()
    .required("Please verify account number")
    .oneOf([yup.ref("accountNumber")], "Account numbers must match"),

  bankName: yup
    .string()
    .required("Bank name is required")
    .min(2, "Bank name must be at least 2 characters"),

  branchName: yup
    .string()
    .required("Branch name is required")
    .min(2, "Branch name must be at least 2 characters"),

  accountHolderName: yup
    .string()
    .required("Account holder name is required")
    .min(2, "Account holder name must be at least 2 characters"),

  accountType: yup.string(),

  accountStatus: yup.string().required("Account status is required"),

  bankProof: yup.mixed().required("Bank proof is required"),

  pennyDropVerification: yup.boolean(),

  upiIdVerification: yup.string(),

  primary: yup.boolean(),

  active: yup.boolean(),
});
