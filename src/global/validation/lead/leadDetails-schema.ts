import * as yup from "yup";
import type {
  LeadDetailsFormData,
  AdditionalReferenceConfig,
} from "@/types/lead/lead-details.types";

const phoneRegex = /^[6-9]\d{9}$/;
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const pincodeRegex = /^\d{6}$/;

export const leadDetailsValidationSchema: yup.ObjectSchema<LeadDetailsFormData> =
  yup.object().shape({
    leadCode: yup.string().default(""),
    fullName: yup.string().required("Full name is required"),
    gender: yup.string().required("Gender is required"),
    contactNumber: yup
      .string()
      .required("Contact number is required")
      .matches(phoneRegex, "Contact number must be a valid 10-digit number"),
    email: yup
      .string()
      .default("")
      .test("valid-email", "Invalid email address", value => {
        if (!value || value.trim() === "") return true;
        return emailRegex.test(value);
      }),
    leadSource: yup.string().required("Lead source is required"),
    leadStage: yup.string().default(""),
    leadStatus: yup.string().default(""),
    assignTo: yup.string().default(""),
    interestedProducts: yup
      .string()
      .required("Interested products/service is required"),
    remarks: yup.string().required("Remarks is required"),
    canvassedTypeIdentity: yup.string().default(""),
    canvasserIdentity: yup.string().default(""),
    nextFollowUpDate: yup
      .string()
      .required("Next follow-up date is required")
      .test(
        "valid-date-format",
        "Please enter a valid date in YYYY-MM-DD format",
        value => {
          if (!value) return false;
          // Check format YYYY-MM-DD
          const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
          if (!dateRegex.test(value)) return false;

          // Check if it's a valid date
          const date = new Date(value);
          if (isNaN(date.getTime())) return false;

          return true;
        }
      )
      .test(
        "max-year",
        "Year cannot exceed 100 years from current year",
        value => {
          if (!value) return false;
          const year = parseInt(value.split("-")[0]);
          const currentYear = new Date().getFullYear();
          return year <= currentYear + 100;
        }
      )
      .test(
        "not-past-date",
        "Next follow-up date cannot be in the past",
        value => {
          if (!value) return false;
          const selectedDate = new Date(value);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return selectedDate >= today;
        }
      ),
    preferredTime: yup.string().required("Preferred time is required"),
    leadProbability: yup
      .number()
      .required("Lead probability is required")
      .max(100, "Lead probability must be at most 100"),
    highPriority: yup.boolean().default(false),
    addressType: yup.string().default(""),
    houseNo: yup.string().default(""),
    streetLane: yup.string().default(""),
    placeName: yup.string().default(""),
    pincode: yup
      .string()
      .default("")
      .test("valid-pincode", "Pincode must be 6 digits", value => {
        if (!value || value.trim() === "") return true;
        return pincodeRegex.test(value);
      }),
    country: yup.string().default(""),
    state: yup.string().default(""),
    district: yup.string().default(""),
    postOfficeId: yup.string().default(""),
    city: yup.string().default(""),
    landmark: yup.string().default(""),
    digipin: yup.string().default(""),
    latitude: yup
      .string()
      .default("")
      .test("valid-latitude", "Invalid latitude", value => {
        if (!value || value.trim() === "") return true;
        const num = parseFloat(value);
        return !isNaN(num) && num >= -90 && num <= 90;
      }),
    longitude: yup
      .string()
      .default("")
      .test("valid-longitude", "Invalid longitude", value => {
        if (!value || value.trim() === "") return true;
        const num = parseFloat(value);
        return !isNaN(num) && num >= -180 && num <= 180;
      }),
    addressProofType: yup.string().default(""),
    documentFile: yup
      .mixed<File>()
      .optional()
      .nullable()
      .default(undefined) as yup.Schema<File | undefined>,
    additionalReferences: yup
      .object()
      .default({})
      .test(
        "validate-additional-references",
        "Please fill all required additional fields",
        function (value) {
          return typeof value === "object" && value !== null;
        }
      ),
  });

export const createEditModeValidationSchema = (
  additionalReferenceConfig?: AdditionalReferenceConfig[]
): yup.ObjectSchema<LeadDetailsFormData> => {
  let schema = leadDetailsValidationSchema.shape({
    leadStage: yup.string().required("Lead stage is required"),
    leadStatus: yup.string().required("Lead status is required"),
    assignTo: yup.string().required("Assign to is required"),
  });

  if (additionalReferenceConfig && additionalReferenceConfig.length > 0) {
    const additionalReferencesValidation = createAdditionalReferenceValidation(
      additionalReferenceConfig
    );

    schema = schema.shape({
      additionalReferences: additionalReferencesValidation,
    });
  }

  return schema;
};

export const createAdditionalReferenceValidation = (
  config: AdditionalReferenceConfig[]
) => {
  const additionalReferencesSchema: Record<string, yup.AnySchema> = {};

  config.forEach(field => {
    if (field.isActive) {
      const dataType = field.dataType.toUpperCase();

      if (dataType === "NUMERIC") {
        if (field.isMandatory) {
          additionalReferencesSchema[field.identity] = yup
            .string()
            .required(`${field.referenceFieldName} is required`)
            .matches(
              /^\d+$/,
              `${field.referenceFieldName} must contain only digits`
            )
            .test(
              "max-length",
              `${field.referenceFieldName} must be at most ${field.maxLength} digits`,
              value => !value || value.length <= field.maxLength
            );
        } else {
          additionalReferencesSchema[field.identity] = yup
            .string()
            .notRequired()
            .test(
              "valid-numeric",
              `${field.referenceFieldName} must contain only digits`,
              value => {
                if (!value || value.trim() === "") return true;
                return /^\d+$/.test(value);
              }
            )
            .test(
              "max-length",
              `${field.referenceFieldName} must be at most ${field.maxLength} digits`,
              value => !value || value.length <= field.maxLength
            );
        }
      } else if (dataType === "NUMBER") {
        if (field.isMandatory) {
          additionalReferencesSchema[field.identity] = yup
            .string()
            .required(`${field.referenceFieldName} is required`)
            .matches(
              /^\d+(\.\d+)?$/,
              `${field.referenceFieldName} must be a valid number`
            );
        } else {
          additionalReferencesSchema[field.identity] = yup
            .string()
            .notRequired()
            .test(
              "valid-number",
              `${field.referenceFieldName} must be a valid number`,
              value => {
                if (!value || value.trim() === "") return true;
                return /^\d+(\.\d+)?$/.test(value);
              }
            );
        }
      } else if (dataType === "DATE") {
        if (field.isMandatory) {
          additionalReferencesSchema[field.identity] = yup
            .string()
            .required(`${field.referenceFieldName} is required`)
            .matches(
              /^\d{4}-\d{2}-\d{2}$/,
              `${field.referenceFieldName} must be a valid date`
            );
        } else {
          additionalReferencesSchema[field.identity] = yup
            .string()
            .notRequired()
            .test(
              "valid-date",
              `${field.referenceFieldName} must be a valid date`,
              value => {
                if (!value || value.trim() === "") return true;
                return /^\d{4}-\d{2}-\d{2}$/.test(value);
              }
            );
        }
      } else if (dataType === "EMAIL") {
        if (field.isMandatory) {
          additionalReferencesSchema[field.identity] = yup
            .string()
            .required(`${field.referenceFieldName} is required`)
            .matches(
              emailRegex,
              `${field.referenceFieldName} must be a valid email`
            );
        } else {
          additionalReferencesSchema[field.identity] = yup
            .string()
            .notRequired()
            .test(
              "valid-email",
              `${field.referenceFieldName} must be a valid email`,
              value => {
                if (!value || value.trim() === "") return true;
                return emailRegex.test(value);
              }
            );
        }
      } else if (dataType === "PHONE" || dataType === "MOBILE") {
        if (field.isMandatory) {
          additionalReferencesSchema[field.identity] = yup
            .string()
            .required(`${field.referenceFieldName} is required`)
            .matches(
              phoneRegex,
              `${field.referenceFieldName} must be a valid phone number`
            );
        } else {
          additionalReferencesSchema[field.identity] = yup
            .string()
            .notRequired()
            .test(
              "valid-phone",
              `${field.referenceFieldName} must be a valid phone number`,
              value => {
                if (!value || value.trim() === "") return true;
                return phoneRegex.test(value);
              }
            );
        }
      } else {
        if (field.isMandatory) {
          let validation = yup
            .string()
            .required(`${field.referenceFieldName} is required`);

          if (field.maxLength > 0) {
            validation = validation.max(
              field.maxLength,
              `${field.referenceFieldName} must be at most ${field.maxLength} characters`
            );
          }

          additionalReferencesSchema[field.identity] = validation;
        } else {
          let validation = yup.string().notRequired();

          if (field.maxLength > 0) {
            validation = validation.max(
              field.maxLength,
              `${field.referenceFieldName} must be at most ${field.maxLength} characters`
            );
          }

          additionalReferencesSchema[field.identity] = validation;
        }
      }
    }
  });

  return yup.object().shape(additionalReferencesSchema);
};

export const createLeadDetailsValidationSchema = (
  additionalReferenceConfig?: AdditionalReferenceConfig[],
  isEditMode: boolean = false
): yup.ObjectSchema<LeadDetailsFormData> => {
  if (isEditMode) {
    return createEditModeValidationSchema(additionalReferenceConfig);
  }

  if (additionalReferenceConfig && additionalReferenceConfig.length > 0) {
    const additionalReferencesValidation = createAdditionalReferenceValidation(
      additionalReferenceConfig
    );

    return leadDetailsValidationSchema.shape({
      additionalReferences: additionalReferencesValidation,
    });
  }

  return leadDetailsValidationSchema;
};
