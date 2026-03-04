import * as yup from "yup";
import type { NomineeFormData } from "@/types/customer/nominee.types";

// Common regex patterns
const namePattern = /^[a-zA-Z\s.''-]+$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[6-9]\d{9}$/;
const pincodePattern = /^\d{6}$/;

// Centralized error messages
const messages = {
  required: (field: string) => `${field} is required`,
  invalid: (field: string) => `Invalid ${field} format`,
  minLength: (field: string, min: number) =>
    `${field} must be at least ${min} characters`,
  maxLength: (field: string, max: number) =>
    `${field} must not exceed ${max} characters`,
  minValue: (field: string, min: number) => `${field} must be at least ${min}`,
  maxValue: (field: string, max: number) => `${field} cannot exceed ${max}`,
  futureDate: "Date cannot be in the future",
  invalidDate: "Invalid date format",
};

// Reusable schema functions
const nameSchema = (
  fieldName: string,
  minLength: number = 2,
  maxLength: number = 100
) =>
  yup
    .string()
    .required(messages.required(fieldName))
    .matches(namePattern, messages.invalid(fieldName))
    .min(minLength, messages.minLength(fieldName, minLength))
    .max(maxLength, messages.maxLength(fieldName, maxLength))
    .transform(value => value?.trim() || "");

const phoneSchema = (fieldName: string) =>
  yup
    .string()
    .required(messages.required(fieldName))
    .matches(phonePattern, "Please enter valid number")
    .transform(value => value?.trim() || "");

const dateSchema = (fieldName: string) =>
  yup
    .string()
    .required(messages.required(fieldName))
    .test("valid-date", messages.invalidDate, value =>
      value ? !isNaN(new Date(value).getTime()) : false
    )
    .test("not-future-date", messages.futureDate, value => {
      if (!value) return true;
      const selectedDate = new Date(value);
      const today = new Date();
      return selectedDate <= today;
    })
    .transform(value => value?.trim() || "");

const percentageSchema = () =>
  yup
    .number()
    .required(messages.required("Percentage share"))
    .min(0.01, messages.minValue("Percentage share", 0.01))
    .max(100, messages.maxValue("Percentage share", 100))
    .test(
      "valid-percentage",
      "Percentage share must be a valid number",
      value => value !== null && value !== undefined && !isNaN(value)
    );

export const nomineeValidationSchema = yup.object({
  fullName: nameSchema("Nominee's full name"),
  relationship: yup.string().required(messages.required("Relationship")),
  dob: dateSchema("Date of birth"),
  contactNumber: phoneSchema("Contact number"),
  percentageShare: percentageSchema(),

  isMinor: yup.boolean().default(false),

  // Guardian fields - required only if nominee is minor
  guardianName: yup
    .string()
    .default("")
    .test(
      "guardian-required-for-minor",
      "Guardian name is required for minor nominees",
      function (value) {
        const { isMinor } = this.parent;
        if (isMinor && (!value || value.trim() === "")) {
          return false;
        }
        return true;
      }
    )
    .test(
      "valid-guardian-name",
      "Guardian name contains invalid characters",
      function (value) {
        const { isMinor } = this.parent;
        if (isMinor && value && !namePattern.test(value.trim())) {
          return false;
        }
        return true;
      }
    )
    .transform(value => value?.trim() || ""),

  guardianDob: yup
    .string()
    .default("")
    .test(
      "guardian-dob-required-for-minor",
      "Guardian date of birth is required for minor nominees",
      function (value) {
        const { isMinor } = this.parent;
        if (isMinor && (!value || value.trim() === "")) {
          return false;
        }
        return true;
      }
    )
    .test("valid-guardian-date", messages.invalidDate, function (value) {
      const { isMinor } = this.parent;
      if (isMinor && value && isNaN(new Date(value).getTime())) {
        return false;
      }
      return true;
    })
    .test("guardian-not-future-date", messages.futureDate, function (value) {
      const { isMinor } = this.parent;
      if (isMinor && value) {
        const selectedDate = new Date(value);
        const today = new Date();
        return selectedDate <= today;
      }
      return true;
    })
    .test(
      "guardian-age-min-18",
      "Guardian must be at least 18 years old",
      function (value) {
        const { isMinor } = this.parent;
        if (!isMinor || !value) return true;

        const dob = new Date(value);
        if (isNaN(dob.getTime())) return true;

        const today = new Date();
        const age =
          today.getFullYear() -
          dob.getFullYear() -
          (today < new Date(today.getFullYear(), dob.getMonth(), dob.getDate())
            ? 1
            : 0);

        return age >= 18;
      }
    )
    .transform(value => value?.trim() || ""),

  guardianEmail: yup
    .string()
    .default("")
    // .test(
    //   "guardian-email-required-for-minor",
    //   "Guardian email is required for minor nominees",
    //   function (value) {
    //     const { isMinor } = this.parent;
    //     if (isMinor && (!value || value.trim() === "")) {
    //       return false;
    //     }
    //     return true;
    //   }
    // )
    .test("valid-guardian-email", "Invalid email format", function (value) {
      const { isMinor } = this.parent;
      if (isMinor && value && !emailPattern.test(value)) {
        return false;
      }
      return true;
    })
    .transform(value => value?.trim() || ""),

  guardianContactNumber: yup
    .string()
    .default("")
    .test(
      "guardian-contact-required-for-minor",
      "Guardian contact number is required for minor nominees",
      function (value) {
        const { isMinor } = this.parent;
        if (isMinor && (!value || value.trim() === "")) {
          return false;
        }
        return true;
      }
    )
    .test(
      "valid-guardian-phone",
      "Please enter valid number",
      function (value) {
        const { isMinor } = this.parent;
        if (isMinor && value && !phonePattern.test(value)) {
          return false;
        }
        return true;
      }
    )
    .transform(value => value?.trim() || ""),

  isSameAddress: yup.boolean().default(false),

  addressTypeId: yup
    .string()
    .default("")
    .test(
      "address-type-required",
      "Address type is required when address is different from customer",
      function (value) {
        const { isSameAddress } = this.parent;
        if (!isSameAddress && (!value || value.trim() === "")) {
          return false;
        }
        return true;
      }
    ),

  doorNumber: yup
    .string()
    .default("")
    .test(
      "door-number-required",
      "Door number is required when address is different from customer",
      function (value) {
        const { isSameAddress } = this.parent;
        if (!isSameAddress && (!value || value.trim() === "")) {
          return false;
        }
        return true;
      }
    ),

  addressLine1: yup
    .string()
    .default("")
    .test(
      "address-line-required",
      "Street/Lane name is required when address is different from customer",
      function (value) {
        const { isSameAddress } = this.parent;
        if (!isSameAddress && (!value || value.trim() === "")) {
          return false;
        }
        return true;
      }
    ),

  landmark: yup
    .string()
    .default("")
    .test(
      "landmark-required",
      "Landmark is required when address is different from customer",
      function (value) {
        const { isSameAddress } = this.parent;
        if (!isSameAddress && (!value || value.trim() === "")) {
          return false;
        }
        return true;
      }
    ),

  placeName: yup
    .string()
    .default("")
    .test(
      "place-name-required",
      "Place name is required when address is different from customer",
      function (value) {
        const { isSameAddress } = this.parent;
        if (!isSameAddress && (!value || value.trim() === "")) {
          return false;
        }
        return true;
      }
    ),

  city: yup
    .string()
    .default("")
    .test("city-required", "City is required", function (value) {
      const { isSameAddress } = this.parent;
      if (!isSameAddress && (!value || value.trim() === "")) {
        return false;
      }
      return true;
    }),

  district: yup.string().default(""),
  state: yup.string().default(""),
  country: yup.string().default("India"),

  pincode: yup
    .string()
    .default("")
    .test(
      "pincode-required",
      "Pincode is required when address is different from customer",
      function (value) {
        const { isSameAddress } = this.parent;
        if (!isSameAddress && (!value || value.trim() === "")) {
          return false;
        }
        return true;
      }
    )
    .test("valid-pincode", "Must be exactly 6 digits", function (value) {
      const { isSameAddress } = this.parent;
      if (!isSameAddress && value && !pincodePattern.test(value)) {
        return false;
      }
      return true;
    })
    .transform(value => value?.trim() || ""),

  postOfficeId: yup
    .string()
    .default("")
    .test(
      "post-office-required",
      "Post office is required when address is different from customer",
      function (value) {
        const { isSameAddress } = this.parent;
        if (!isSameAddress && (!value || value.trim() === "")) {
          return false;
        }
        return true;
      }
    ),

  latitude: yup.string().default(""),
  longitude: yup.string().default(""),
  digipin: yup.string().default(""),
  // selectedFile: yup.mixed().default(null),
  selectedFile: yup.mixed().nullable().default(null),
  // dmsFileData: yup.mixed().nullable().required().default(null),
  dmsFileData: yup.mixed().nullable().default(null),
}) as yup.ObjectSchema<NomineeFormData>;

// Data transformation function
export const transformFormData = (data: NomineeFormData): NomineeFormData => {
  return {
    fullName: data.fullName?.trim() || "",
    relationship: data.relationship?.trim() || "",
    dob: data.dob?.trim() || "",
    contactNumber: data.contactNumber?.trim() || "",
    percentageShare: data.percentageShare || 0,
    isMinor: data.isMinor || false,
    guardianName: data.guardianName?.trim() || "",
    guardianDob: data.guardianDob?.trim() || "",
    guardianEmail: data.guardianEmail?.trim() || "",
    guardianContactNumber: data.guardianContactNumber?.trim() || "",
    isSameAddress: data.isSameAddress || false,
    addressTypeId: data.addressTypeId?.trim() || "",
    doorNumber: data.doorNumber?.trim() || "",
    addressLine1: data.addressLine1?.trim() || "",
    landmark: data.landmark?.trim() || "",
    placeName: data.placeName?.trim() || "",
    city: data.city?.trim() || "",
    district: data.district?.trim() || "",
    state: data.state?.trim() || "",
    country: data.country?.trim() || "India",
    pincode: data.pincode?.trim() || "",
    postOfficeId: data.postOfficeId?.trim() || "",
    latitude: data.latitude?.trim() || "",
    longitude: data.longitude?.trim() || "",
    digipin: data.digipin?.trim() || "",
    selectedFile: data.selectedFile || null,
    dmsFileData: data.dmsFileData || null,
    filePath: data.filePath || null,
    docRefId: data.docRefId || null,
  };
};

export const validateField = async <K extends keyof NomineeFormData>(
  fieldName: K,
  value: NomineeFormData[K],
  formData: NomineeFormData
): Promise<string | null> => {
  try {
    await nomineeValidationSchema.validateAt(fieldName, {
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

export const validateForm = async (
  data: NomineeFormData
): Promise<{ isValid: boolean; errors: Record<string, string> }> => {
  try {
    await nomineeValidationSchema.validate(data, { abortEarly: false });
    return { isValid: true, errors: {} };
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      const errors: Record<string, string> = {};
      error.inner.forEach(err => {
        if (err.path) {
          errors[err.path] = err.message;
        }
      });
      return { isValid: false, errors };
    }
    return { isValid: false, errors: { general: "Validation error" } };
  }
};

export const isFormComplete = async (
  data: NomineeFormData
): Promise<boolean> => {
  try {
    await nomineeValidationSchema.validate(data, { abortEarly: false });
    return true;
  } catch {
    return false;
  }
};
