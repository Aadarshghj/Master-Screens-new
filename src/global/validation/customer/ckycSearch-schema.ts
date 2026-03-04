import * as yup from "yup";

export const isValidIndianMobile = (value: string): boolean =>
  /^[6-9]\d{9}$/.test(value?.trim());

export const ckycSearchValidationSchema = yup.object().shape({
  kycType: yup
    .string()
    .nullable()
    .notRequired()
    .transform((val, orig) => (orig === "" ? null : val))
    .oneOf(
      ["aadhaar", "pan", "passport", "driving_license"],
      "Please select a valid KYC type"
    ),

  aadhaarNumber: yup
    .string()
    .nullable()
    .notRequired()
    .transform((val, orig) => (orig === "" ? null : val))
    .matches(/^\d{12}$/, "Aadhaar must be 12 digits")
    .test(
      "aadhaar-when-kyc-type",
      "Aadhaar number is required when KYC type is Aadhaar",
      function (value) {
        const { kycType } = this.parent;
        if (kycType === "aadhaar" && !value) {
          return false;
        }
        return true;
      }
    ),

  dob: yup
    .string()
    .nullable()
    .notRequired()
    .transform((val, orig) => (orig === "" ? null : val))
    .test("is-valid-date", "Please enter a valid date", value => {
      if (!value) return true;
      const date = new Date(value);
      return date instanceof Date && !isNaN(date.getTime());
    })
    .test("not-future-date", "Date of birth cannot be in the future", value => {
      if (!value) return true;
      const selectedDate = new Date(value);
      const today = new Date();
      return selectedDate <= today;
    })
    .test(
      "reasonable-age",
      "Please enter a reasonable date of birth",
      value => {
        if (!value) return true;
        const selectedDate = new Date(value);
        const today = new Date();
        const age = today.getFullYear() - selectedDate.getFullYear();
        return age >= 0 && age <= 150;
      }
    ),

  mobile: yup
    .string()
    .nullable()
    .notRequired()
    .transform((val, orig) => (orig === "" ? null : val))
    .test("is-valid-mobile", "Invalid mobile number format", value =>
      value ? isValidIndianMobile(value) : true
    ),
});

export type CKYCSearchForm = yup.InferType<typeof ckycSearchValidationSchema>;
