import * as yup from "yup";

export const isValidIndianMobile = (value: string): boolean =>
  /^[6-9]\d{9}$/.test(value?.trim());

export const kycCustomerSearchValidationSchema = yup.object().shape({
  branchCode: yup.string().nullable().notRequired(),

  mobile: yup
    .string()
    .nullable()
    .notRequired()
    .transform((val, orig) => (orig === "" ? null : val))
    .test("is-valid-mobile", "Invalid mobile number", value =>
      value ? isValidIndianMobile(value) : true
    ),

  email: yup
    .string()
    .nullable()
    .notRequired()
    .transform((val, orig) => (orig === "" ? null : val))
    .email("Invalid email format"),

  panCard: yup
    .string()
    .nullable()
    .notRequired()
    .transform((val, orig) => (orig === "" ? null : val))
    .matches(/^[A-Z]{5}[0-9]{4}[A-Z]$/, "Invalid PAN format (ABCDE1234A)")
    .max(10, "PAN must be 10 characters"),

  aadharNumber: yup
    .string()
    .nullable()
    .notRequired()
    .transform((val, orig) => (orig === "" ? null : val))
    .matches(/^\d{12}$/, "Aadhaar must be 12 digits"),

  voterId: yup
    .string()
    .nullable()
    .notRequired()
    .transform((val, orig) => (orig === "" ? null : val))
    .matches(
      /^[A-Z0-9]{6,16}$/,
      "Voter ID must be 6–16 alphanumeric characters"
    ),

  passport: yup
    .string()
    .nullable()
    .notRequired()
    .transform((val, orig) => (orig === "" ? null : val))
    .matches(/^[A-PR-WY][1-9]\d{6}$/, "Invalid Passport format (A1234567)"),

  customerName: yup.string().nullable().notRequired(),
});

export type KycCustomerSearchForm = yup.InferType<
  typeof kycCustomerSearchValidationSchema
>;
