import type { KycFormData } from "@/types";
import * as yup from "yup";

// KYC Validation Schema - Using Yup for all validation

const kycValidationSchemaObject = yup.object().shape({
  documentType: yup
    .string()
    .oneOf(
      ["PAN", "AADHAAR", "PASSPORT", "DL", "VOTER ID"],
      "No document type selected!"
    )
    .required("Document type is required"),

  idNumber: yup
    .string()
    .required("ID number is required")
    .test(
      "pan-format",
      "PAN must be in format: AAAAA9999A (5 letters, 4 numbers, 1 letter)",
      function (value) {
        const { documentType } = this.parent;
        if (documentType === "PAN" && value) {
          // Clean the input - remove any spaces or special characters
          const cleanValue = value.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
          const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
          return panRegex.test(cleanValue);
        }
        return true;
      }
    )
    .test(
      "aadhaar-format",
      "Aadhaar must be 12 digits, first digit cannot be 0 or 1",
      function (value) {
        const { documentType } = this.parent;
        if (documentType === "AADHAAR" && value) {
          const aadhaarRegex = /^[2-9][0-9]{11}$/;
          return aadhaarRegex.test(value.replace(/\D/g, ""));
        }
        return true;
      }
    )
    .test(
      "voterid-format",
      "Voter ID must be in format: ABC1234567 (3 letters + 7 digits)",
      function (value) {
        const { documentType } = this.parent;
        if (documentType === "VOTER ID" && value) {
          const cleanValue = value.replace(/\s+/g, "").trim().toUpperCase();
          const voterIdRegex = /^[A-Z]{3}[0-9]{7}$/;
          return voterIdRegex.test(cleanValue);
        }
        return true;
      }
    )
    .test(
      "dl-format",
      "Driving License must be in format: KA01 20230012345 (State + RTO + Year + Serial)",
      function (value) {
        const { documentType } = this.parent;
        if (documentType === "DL" && value) {
          // Clean the input - remove extra spaces but keep single spaces
          const cleanValue = value.replace(/\s+/g, " ").trim().toUpperCase();
          const dlRegex = /^[A-Z]{2}[0-9]{2}\s?[0-9]{4}[0-9]{7}$/;
          return dlRegex.test(cleanValue);
        }
        return true;
      }
    )
    .test(
      "passport-format",
      "Passport must be in format: A1234567 (1 letter + 7 digits)",
      function (value) {
        const { documentType } = this.parent;
        if (documentType === "PASSPORT" && value) {
          // Clean the input - remove any spaces or special characters
          const cleanValue = value.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
          const passportRegex = /^[A-Z][0-9]{7}$/;
          return passportRegex.test(cleanValue);
        }
        return true;
      }
    ),

  placeOfIssue: yup
    .string()
    .nullable()
    .optional()
    .transform((value, originalValue) => {
      return originalValue === "" ? null : value;
    }),

  issuingAuthority: yup
    .string()
    .optional()
    .transform((value, originalValue) => {
      return originalValue === "" ? undefined : value;
    }),

  validFrom: yup
    .string()
    .nullable()
    .transform((value, originalValue) => {
      return originalValue === "" ? null : value;
    })
    .when("documentType", {
      is: (val: string) => ["DL", "PASSPORT"].includes(val),
      then: schema =>
        schema
          .required("Date is required for Driving License and Passport")
          .test(
            "not-future-date",
            "Valid From date cannot be in the future",
            function (value) {
              if (!value) return true;
              const inputDate = new Date(value);
              const today = new Date();
              today.setHours(23, 59, 59, 999); // End of today
              return inputDate <= today;
            }
          ),
      otherwise: schema => schema.optional(),
    }),

  validTo: yup
    .string()
    .nullable()
    .transform((value, originalValue) => {
      return originalValue === "" ? null : value;
    })
    .when("documentType", {
      is: (val: string) => ["DL", "PASSPORT"].includes(val),
      then: schema =>
        schema
          .required("Date is required for Driving License and Passport")
          .test(
            "not-past-date",
            "Valid To date cannot be in the past",
            function (value) {
              if (!value) return true;
              const inputDate = new Date(value);
              const today = new Date();
              today.setHours(0, 0, 0, 0); // Start of today
              return inputDate >= today;
            }
          )
          .test(
            "after-valid-from",
            "Valid To must be after Valid From date",
            function (value) {
              if (!value) return true;
              const { validFrom } = this.parent;
              if (!validFrom) return true;
              const validFromDate = new Date(validFrom);
              const validToDate = new Date(value);
              return validToDate > validFromDate;
            }
          )
          .test("age-based-validity-gap", function (value) {
            if (!value) return true;
            const { validFrom, dateOfBirth } = this.parent;
            if (!validFrom || !dateOfBirth) return true;

            const validFromDate = new Date(validFrom);
            const validToDate = new Date(value);
            const dob = new Date(dateOfBirth);

            // Calculate age at the time of validFrom
            const ageAtValidFrom =
              validFromDate.getFullYear() - dob.getFullYear();
            const monthDiff = validFromDate.getMonth() - dob.getMonth();
            const dayDiff = validFromDate.getDate() - dob.getDate();

            const adjustedAge =
              monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)
                ? ageAtValidFrom - 1
                : ageAtValidFrom;

            // Determine required gap based on age
            let requiredYears: number;
            let errorMessage: string;

            if (adjustedAge >= 18) {
              requiredYears = 10;
              errorMessage =
                "Valid To must be at least 10 years after Valid From date for age 18+";
            } else {
              requiredYears = 5;
              errorMessage =
                "Valid To must be at least 5 years after Valid From date for age below 18";
            }

            const requiredDate = new Date(validFromDate);
            requiredDate.setFullYear(
              requiredDate.getFullYear() + requiredYears
            );
            // Subtract 1 day to allow "years minus 1 day"
            requiredDate.setDate(requiredDate.getDate() - 1);

            if (validToDate < requiredDate) {
              return this.createError({ message: errorMessage });
            }

            return true;
          }),
      otherwise: schema => schema.optional(),
    }),

  documentFile: yup
    .mixed()
    .required("Document file is required")
    .test("file-size", "File size must be less than 2MB", function (value) {
      if (!value || !(value instanceof File)) return true;
      const MAX_SIZE = 2 * 1024 * 1024; // 2MB
      return value.size <= MAX_SIZE;
    })
    .test(
      "file-type",
      "Accepted format JPG,PNG,JPEG,PDF Max size: 2MB",
      function (value) {
        if (!value || !(value instanceof File)) return true;
        const allowedTypes = [
          "image/jpeg",
          "image/jpg",
          "image/png",
          "application/pdf",
        ];
        return allowedTypes.includes(value.type);
      }
    ),

  // Removed OTP length validation
  aadharOtp: yup
    .string()
    .nullable()
    .optional()
    .transform((value, originalValue) => {
      return originalValue === "" ? null : value;
    }),

  documentVerified: yup.boolean().optional(),
  activeStatus: yup.boolean().optional(),

  captureBy: yup
    .string()
    .nullable()
    .optional()
    .transform((value, originalValue) => {
      return originalValue === "" ? null : value;
    }),

  latitude: yup
    .string()
    .nullable()
    .optional()
    .transform((value, originalValue) => {
      return originalValue === "" ? null : value;
    }),

  longitude: yup
    .string()
    .nullable()
    .optional()
    .transform((value, originalValue) => {
      return originalValue === "" ? null : value;
    }),

  accuracy: yup
    .string()
    .nullable()
    .optional()
    .transform((value, originalValue) => {
      return originalValue === "" ? null : value;
    }),

  captureDevice: yup
    .string()
    .nullable()
    .optional()
    .transform((value, originalValue) => {
      return originalValue === "" ? null : value;
    }),

  locationDescription: yup
    .string()
    .nullable()
    .optional()
    .transform((value, originalValue) => {
      return originalValue === "" ? null : value;
    }),

  filePath: yup
    .string()
    .nullable()
    .optional()
    .transform((value, originalValue) => {
      return originalValue === "" ? null : value;
    }),

  captureTime: yup
    .string()
    .nullable()
    .optional()
    .transform((value, originalValue) => {
      return originalValue === "" ? null : value;
    }),

  // Additional fields for different document types
  // nameOnDocument: yup
  //   .string()
  //   .optional()
  //   .transform((value, originalValue) => {
  //     return originalValue === "" ? undefined : value;
  //   }),

  fathersName: yup
    .string()
    .optional()
    .transform((value, originalValue) => {
      return originalValue === "" ? undefined : value;
    }),

  dateOfBirth: yup
    .string()
    .optional()
    .transform((value, originalValue) => {
      return originalValue === "" ? undefined : value;
    })
    .when("documentType", {
      is: (val: string) => ["DL", "PASSPORT"].includes(val),
      then: schema =>
        schema
          .required("Date of Birth is required for this document type")
          .test(
            "not-current-date",
            "Date of Birth cannot be today",
            function (value) {
              if (!value) return true;
              const inputDate = new Date(value);
              const today = new Date();
              inputDate.setHours(0, 0, 0, 0);
              today.setHours(0, 0, 0, 0);
              return inputDate.getTime() !== today.getTime();
            }
          )
          .test(
            "not-future-date",
            "Date of Birth cannot be in the future",
            function (value) {
              if (!value) return true;
              const inputDate = new Date(value);
              const today = new Date();
              today.setHours(23, 59, 59, 999); // End of today
              return inputDate <= today;
            }
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
          ),
      otherwise: schema => schema.optional(),
    }),

  address: yup
    .string()
    .optional()
    .transform((value, originalValue) => {
      return originalValue === "" ? undefined : value;
    }),

  constituency: yup
    .string()
    .optional()
    .transform((value, originalValue) => {
      return originalValue === "" ? undefined : value;
    }),

  vehicleClasses: yup
    .string()
    .optional()
    .transform((value, originalValue) => {
      return originalValue === "" ? undefined : value;
    }),

  bloodGroup: yup
    .string()
    .optional()
    .transform((value, originalValue) => {
      return originalValue === "" ? undefined : value;
    }),

  dateOfIssue: yup
    .string()
    .optional()
    .transform((value, originalValue) => {
      return originalValue === "" ? undefined : value;
    })
    .when("documentType", {
      is: (val: string) => ["DL"].includes(val),
      then: schema =>
        schema.test(
          "is-valid-date",
          "Must be a valid date",
          value => !value || !isNaN(new Date(value).getTime())
        ),
      otherwise: schema => schema.optional(),
    }),

  validUntil: yup
    .string()
    .optional()
    .transform((value, originalValue) => {
      return originalValue === "" ? undefined : value;
    })
    .when("documentType", {
      is: (val: string) => ["DL"].includes(val),
      then: schema =>
        schema.test(
          "is-valid-date",
          "Must be a valid date",
          value => !value || !isNaN(new Date(value).getTime())
        ),
      otherwise: schema => schema.optional(),
    }),
  // File upload and UI state moved to useForm
  selectedFileName: yup.string().optional(),
  selectedFile: yup.mixed().nullable().optional(),
  dmsFileData: yup.object().nullable().optional(),
  originalIdNumber: yup.string().optional(),
  maskedAadharResponse: yup.object().nullable().optional(),
  vaultId: yup.string().optional(),
  verifiedIdNumber: yup.string().optional(),
});

export const kycValidationSchema: yup.ObjectSchema<KycFormData> =
  kycValidationSchemaObject as yup.ObjectSchema<KycFormData>;
