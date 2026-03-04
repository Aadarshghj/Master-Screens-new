import * as yup from "yup";

export interface CustomerSearchFormData {
  customerId?: string;
  customerName?: string;
  branchCode?: string;
  branchId?: number;
  mobile?: string;
  email?: string;
  panCard?: string;
  aadharNumber?: string;
  voterId?: string;
  passport?: string;
}

// Helper function to validate Indian mobile number
export const isValidIndianMobile = (value: string): boolean => {
  return /^[6-9]\d{9}$/.test(value?.trim());
};

// Helper function to validate PAN card format
export const isValidPAN = (value: string): boolean => {
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  return panRegex.test(value?.trim().toUpperCase());
};

// Helper function to validate Aadhaar number format
export const isValidAadhaar = (value: string): boolean => {
  const aadhaarRegex = /^[2-9][0-9]{11}$/;
  return aadhaarRegex.test(value?.replace(/\D/g, ""));
};

// Helper function to validate email format
export const isValidEmail = (value: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value?.trim());
};

// Helper function to validate passport format
export const isValidPassport = (value: string): boolean => {
  const passportRegex = /^[A-Z]{1}[0-9]{7}$/;
  return passportRegex.test(value?.trim().toUpperCase());
};

// Helper function to validate voter ID format
export const isValidVoterId = (value: string): boolean => {
  const voterIdRegex = /^[A-Z]{3}[0-9]{7}$/;
  return voterIdRegex.test(value?.trim().toUpperCase());
};

// Customer Search Validation Schema
export const customerSearchValidationSchema = yup.object().shape({
  customerId: yup
    .string()
    .optional()
    .transform((value, originalValue) => {
      return originalValue === "" ? undefined : value;
    })
    .test(
      "customer-id-format",
      "Customer ID must be at least 3 characters",
      function (value) {
        if (!value) return true;
        return value.trim().length >= 3;
      }
    ),

  customerName: yup
    .string()
    .optional()
    .transform((value, originalValue) => {
      return originalValue === "" ? undefined : value;
    })
    .test(
      "customer-name-format",
      "Customer name must be at least 2 characters",
      function (value) {
        if (!value) return true;
        return value.trim().length >= 2;
      }
    ),

  branchCode: yup
    .string()
    .optional()
    .transform((value, originalValue) => {
      return originalValue === "" ? undefined : value;
    })
    .test(
      "branch-code-format",
      "Branch code must be at least 2 characters",
      function (value) {
        if (!value) return true;
        return value.trim().length >= 2;
      }
    ),

  branchId: yup
    .number()
    .optional()
    .transform((value, originalValue) => {
      return originalValue === "" ? undefined : value;
    })
    .test(
      "branch-id-format",
      "Branch ID must be a positive number",
      function (value) {
        if (value === undefined || value === null) return true;
        return value > 0;
      }
    ),

  mobile: yup
    .string()
    .optional()
    .transform((value, originalValue) => {
      return originalValue === "" ? undefined : value;
    })
    .test(
      "mobile-format",
      "Mobile number must be 10 digits starting with 6-9",
      function (value) {
        if (!value) return true;
        return isValidIndianMobile(value);
      }
    ),

  email: yup
    .string()
    .optional()
    .transform((value, originalValue) => {
      return originalValue === "" ? undefined : value;
    })
    .test(
      "email-format",
      "Please enter a valid email address",
      function (value) {
        if (!value) return true;
        return isValidEmail(value);
      }
    ),

  panCard: yup
    .string()
    .optional()
    .transform((value, originalValue) => {
      return originalValue === "" ? undefined : value;
    })
    .test("pan-format", "PAN must be in format: AAAAA9999A", function (value) {
      if (!value) return true;
      return isValidPAN(value);
    }),

  aadharNumber: yup
    .string()
    .optional()
    .transform((value, originalValue) => {
      return originalValue === "" ? undefined : value;
    })
    .test(
      "aadhaar-format",
      "Aadhaar must be 12 digits, first digit cannot be 0 or 1",
      function (value) {
        if (!value) return true;
        return isValidAadhaar(value);
      }
    ),

  voterId: yup
    .string()
    .optional()
    .transform((value, originalValue) => {
      return originalValue === "" ? undefined : value;
    })
    .test(
      "voter-id-format",
      "Voter ID must be in format: ABC1234567",
      function (value) {
        if (!value) return true;
        return isValidVoterId(value);
      }
    ),

  passport: yup
    .string()
    .optional()
    .transform((value, originalValue) => {
      return originalValue === "" ? undefined : value;
    })
    .test(
      "passport-format",
      "Passport must be in format: A1234567",
      function (value) {
        if (!value) return true;
        return isValidPassport(value);
      }
    ),
});

// Custom validation to ensure at least one field is provided
export const customerSearchFormSchema = customerSearchValidationSchema.test(
  "at-least-one-field",
  "Please provide at least one search criteria",
  function (value) {
    const hasValue = Object.values(value).some(fieldValue => {
      if (
        fieldValue === undefined ||
        fieldValue === null ||
        fieldValue === ""
      ) {
        return false;
      }
      if (typeof fieldValue === "string") {
        return fieldValue.trim().length > 0;
      }
      return true;
    });
    return hasValue;
  }
);

export type CustomerSearchFormType = yup.InferType<
  typeof customerSearchFormSchema
>;
