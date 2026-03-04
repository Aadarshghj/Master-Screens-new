import * as yup from "yup";
import type { BasicInfoFormData } from "@/types/customer/basic.types";
import { marriedCode } from "@/const/common-codes.const";

const namePattern = /^[a-zA-Z\s.''-]+$/;
const mobilePattern = /^[6-9]\d{9}$/;
const otpPattern = /^$|^[0-9]{6}$/;

const messages = {
  required: (field: string) => `${field} is required`,
  invalidFormat: (field: string) => `Invalid ${field.toLowerCase()} format`,
  tooShort: (field: string, min: number) =>
    `${field} must be at least ${min} characters`,
  tooLong: (field: string, max: number) =>
    `${field} must not exceed ${max} characters`,
  invalidDate: "Invalid date format",
  futureDate: "Date cannot be in the future",
  invalidAge: "Age must be realistic",
  invalidMobile: "Must be a valid 10-digit",
  invalidOTP: "OTP must be exactly 6 digits",
  guardianRequired: "Guardian Customer ID is required for minor customers",
  spouseRequired: "Spouse name is required for married customers",
};

const nameSchema = (fieldName: string, required = true) => {
  const schema = yup
    .string()
    .transform(value => value?.trim() || "")
    .test("format", messages.invalidFormat(fieldName), function (value) {
      // Only validate format if the field has a value
      if (!value || value === "") return true;
      return namePattern.test(value);
    });

  return required
    ? schema.required(messages.required(fieldName))
    : schema.default("");
};

const dateSchema = yup
  .string()
  .required(messages.required("Date of Birth"))
  .test("valid-date", messages.invalidDate, value =>
    value ? !isNaN(new Date(value).getTime()) : false
  )
  .test(
    "not-too-old",
    "Date of Birth cannot be more than 100 years ago",
    function (value) {
      if (!value) return true;
      const inputDate = new Date(value);
      const hundredYearsAgo = new Date();
      hundredYearsAgo.setFullYear(hundredYearsAgo.getFullYear() - 100);
      return inputDate >= hundredYearsAgo;
    }
  )
  .test("not-future", messages.futureDate, value => {
    if (!value) return true;
    const inputDate = new Date(value);
    const today = new Date();
    // Set time to start of day for accurate comparison
    today.setHours(0, 0, 0, 0);
    inputDate.setHours(0, 0, 0, 0);
    return inputDate <= today;
  })
  .test("day-restriction", "Day must be between 1 and 31", value => {
    if (!value) return true;
    const inputDate = new Date(value);
    const day = inputDate.getDate();
    return day >= 1 && day <= 31;
  })
  .test("month-restriction", "Month must be between 1 and 12", value => {
    if (!value) return true;
    const inputDate = new Date(value);
    const month = inputDate.getMonth() + 1; // getMonth() returns 0-11, so add 1
    return month >= 1 && month <= 12;
  });

const ageSchema = yup
  .number()
  .optional()
  .min(0, "Age must be positive")
  .max(150, messages.invalidAge)
  .test(
    "age-minor-consistency",
    "Age must be under 18 for minors",
    function (value) {
      const { isMinor } = this.parent;
      return value === undefined || !isMinor || value < 18;
    }
  )
  .test(
    "age-adult-consistency",
    "Age must be 18 or above for adults",
    function (value) {
      const { isMinor } = this.parent;
      return value === undefined || isMinor || value >= 18;
    }
  );

export const basicInfoValidationSchema: yup.ObjectSchema<BasicInfoFormData> =
  yup.object({
    customerCode: yup.string().default(""),
    crmReferenceId: yup.string().default(""),
    // .required(messages.required("CRM Reference ID")),,
    salutation: yup.string().required(messages.required("Salutation")),
    firstName: nameSchema("First Name"),
    middleName: nameSchema("Middle Name", false),
    lastName: nameSchema("Last Name"),
    aadharName: nameSchema("Aadhaar Name", false),
    gender: yup.string().required(messages.required("Gender")),
    dob: dateSchema,
    guardian: yup
      .string()
      .default("")
      .when("isMinor", {
        is: true,
        then: schema => schema.required(messages.guardianRequired),
        otherwise: schema => schema.optional(),
      }),
    maritalStatus: yup
      .string()
      .required(messages.required("Marital Status"))
      .test(
        "minor-marital-status",
        "Minors can only have 'Single' marital status",
        function () {
          const { isMinor } = this.parent;
          if (isMinor) {
            // Check if the value corresponds to SINGLE status
            // This will be validated against the actual API options
            // For now, we'll allow any value and let the UI filtering handle it
            return true;
          }
          return true;
        }
      ),
    spouseName: yup
      .string()
      .default("")
      .when("maritalStatus", {
        is: (maritalStatus: string) => {
          return maritalStatus === marriedCode;
        },
        then: schema => schema.required(messages.spouseRequired),
        otherwise: schema => schema.notRequired(),
      }),

    fatherName: nameSchema("Father's Name"),
    motherName: nameSchema("Mother's Name"),
    taxCategory: yup.string().required(messages.required("Tax Category")),
    customerStatus: yup.string().required(messages.required("Customer Status")),
    customerListType: yup.string().default(""),
    loyaltyPoints: yup
      .string()
      .default("0")
      .matches(/^\d+$/, "Must be a valid number"),
    valueScore: yup.string().default("System Generated"),
    mobileNumber: yup
      .string()
      .required(messages.required("Mobile number"))
      .matches(mobilePattern, messages.invalidMobile),
    mobileOtp: yup
      .string()
      .default("")
      .matches(otpPattern, messages.invalidOTP),
    isBusiness: yup
      .boolean()
      .default(false)
      .test(
        "mutual-exclusivity",
        "Business Customer and Firm Customer cannot both be selected",
        function (value) {
          const { isFirm } = this.parent;
          return !(value && isFirm);
        }
      ),
    isFirm: yup
      .boolean()
      .default(false)
      .test(
        "mutual-exclusivity",
        "Business Customer and Firm Customer cannot both be selected",
        function (value) {
          const { isBusiness } = this.parent;
          return !(value && isBusiness);
        }
      ),
    documentVerified: yup.boolean().default(false),
    activeStatus: yup.boolean().default(false),
    customerId: yup.string().default(""),
    age: ageSchema,
    isMinor: yup.boolean().default(false),
    branchId: yup.string().optional(),
    otpVerified: yup.boolean().optional(),
    // OTP and guardian fields are now managed by useState
  });

// Field-specific validation functions for individual field validation
export const validateField = async <K extends keyof BasicInfoFormData>(
  fieldName: K,
  value: BasicInfoFormData[K],
  formData: BasicInfoFormData
): Promise<string | null> => {
  try {
    await basicInfoValidationSchema.validateAt(fieldName, {
      ...formData,
      [fieldName]: value,
    });
    return null;
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return error.message;
    }
    return "Validation error";
  }
};

export const transformFormData = (
  data: Partial<BasicInfoFormData>
): BasicInfoFormData => {
  return {
    customerCode: data.customerCode || "",
    crmReferenceId: data.crmReferenceId?.trim() || "",
    salutation: data.salutation || "",
    firstName: data.firstName?.trim() || "",
    middleName: data.middleName?.trim() || "",
    lastName: data.lastName?.trim() || "",
    aadharName: data.aadharName?.trim() || "",
    gender: data.gender || "",
    dob: data.dob || "",
    guardian: data.guardian?.trim() || "",
    maritalStatus: data.maritalStatus || "",
    spouseName: data.spouseName?.trim() || "",
    fatherName: data.fatherName?.trim() || "",
    motherName: data.motherName?.trim() || "",
    taxCategory: data.taxCategory || "",
    customerStatus: data.customerStatus || "",
    customerListType: data.customerListType || "",
    loyaltyPoints: data.loyaltyPoints || "0",
    valueScore: data.valueScore || "System Generated",
    mobileNumber: data.mobileNumber?.trim() || "",
    mobileOtp: data.mobileOtp || "",
    isBusiness: data.isBusiness || false,
    isFirm: data.isFirm || false,
    documentVerified: data.documentVerified || false,
    activeStatus: data.activeStatus || false,
    customerId: data.customerId || "",
    age: data.age || 0,
    isMinor: data.isMinor || false,
    branchId: data.branchId || "",
    otpVerified: data.otpVerified || false,
  };
};
