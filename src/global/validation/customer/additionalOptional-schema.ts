import { logger } from "@/global/service";
import * as yup from "yup";
import type {
  AdditionalOptionalFormData,
  MoreDetailsConfig,
} from "@/types/customer/additional.types";

const positiveNumber = (message: string) =>
  yup
    .string()
    .required(message)
    .matches(/^\d+(\.\d+)?$/, "Must be a valid number")
    .test("is-positive", message, value => {
      if (!value) return false;
      const num = parseFloat(value);
      return !isNaN(num) && num > 0;
    });

export const additionalOptionalValidationSchema: yup.ObjectSchema<AdditionalOptionalFormData> =
  yup.object().shape({
    occupation: yup.string().required("Occupation is required"),
    designation: yup.string().required("Designation is required"),
    sourceOfIncome: yup.string().required("Source of income is required"),
    annualIncome: positiveNumber("Annual income must be greater than 0").test(
      "min-amount",
      "Annual income must be at least ₹1,20,000",
      value => {
        if (!value) return false;
        const num = parseFloat(value);
        return !isNaN(num) && num >= 120000;
      }
    ),

    monthlySalary: yup
      .string()
      .default("")
      .test(
        "valid-salary",
        "Monthly salary must be a valid number greater than ₹10,000",
        value => {
          if (!value || value.trim() === "") return true;
          if (!/^\d+(\.\d+)?$/.test(value)) return false;
          const num = parseFloat(value);
          return !isNaN(num) && num >= 10000;
        }
      )
      .test(
        "salary-vs-annual-income",
        "Monthly salary cannot exceed annual income",
        function (value) {
          if (!value || value.trim() === "") return true;

          const { annualIncome } = this.parent;
          if (!annualIncome || annualIncome.trim() === "") return true;

          const monthlySalaryNum = parseFloat(value);
          const annualIncomeNum = parseFloat(annualIncome);

          if (isNaN(monthlySalaryNum) || isNaN(annualIncomeNum)) return true;
          return monthlySalaryNum <= annualIncomeNum;
        }
      ),

    referralSource: yup.string().required("Referral source is required"),
    canvassedType: yup.string().required("Canvassed type is required"),
    canvasserId: yup.string().required("Canvasser ID is required"),
    employerDetails: yup.string().default(""),
    customerGroup: yup.string().default(""),
    riskCategory: yup.string().required("Risk category is required"),
    customerCategory: yup.string().required("Customer category is required"),
    nationality: yup.string().required("Nationality is required"),
    residentialStatus: yup.string().required("Residential status is required"),
    purpose: yup.string().required("Purpose is required"),
    preferredLanguage: yup.string().default(""),
    educationLevel: yup.string().default(""),
    ownAnyAssets: yup.mixed<"yes" | "no">().oneOf(["yes", "no"]).default("no"),
    assetDetails: yup
      .string()
      .default("")
      .when("ownAnyAssets", {
        is: "yes",
        then: schema =>
          schema.required("Asset details are required when you own assets"),
        otherwise: schema => schema,
      }),
    hasHomeLoan: yup.mixed<"yes" | "no">().oneOf(["yes", "no"]).default("no"),
    homeLoanAmount: yup
      .string()
      .default("")
      .when("hasHomeLoan", {
        is: "yes",
        then: schema =>
          schema
            .required("Home loan amount is required")
            .matches(/^\d+(\.\d+)?$/, "Must be a valid number")
            .test("is-positive", "Amount must be greater than 0", value => {
              if (!value) return false;
              const num = parseFloat(value);
              return !isNaN(num) && num > 0;
            }),
        otherwise: schema => schema,
      }),
    homeLoanCompany: yup.string().default(""),
    moreDetails: yup
      .object()
      .default({})
      .test(
        "validate-more-details",
        "Please fill all required additional fields",
        function (value) {
          return typeof value === "object" && value !== null;
        }
      ),
  });

export const createMoreDetailsValidation = (config: MoreDetailsConfig[]) => {
  const moreDetailsSchema: Record<string, yup.AnySchema> = {};

  config.forEach(field => {
    if (field.isActive) {
      if (field.valueType === "NUMBER") {
        if (field.isMandatory) {
          moreDetailsSchema[field.identity] = yup
            .string()
            .required(`${field.customerRefName} is required`)
            .matches(
              /^\d+(\.\d+)?$/,
              `${field.customerRefName} must be a valid number`
            );
        } else {
          moreDetailsSchema[field.identity] = yup
            .string()
            .notRequired()
            .matches(
              /^\d+(\.\d+)?$/,
              `${field.customerRefName} must be a valid number`
            );
        }
      } else if (field.valueType === "DATE") {
        if (field.isMandatory) {
          moreDetailsSchema[field.identity] = yup
            .string()
            .required(`${field.customerRefName} is required`)
            .matches(
              /^\d{4}-\d{2}-\d{2}$/,
              `${field.customerRefName} must be a valid date`
            );
        } else {
          moreDetailsSchema[field.identity] = yup
            .string()
            .notRequired()
            .matches(
              /^\d{4}-\d{2}-\d{2}$/,
              `${field.customerRefName} must be a valid date`
            );
        }
      } else {
        if (field.isMandatory) {
          moreDetailsSchema[field.identity] = yup
            .string()
            .required(`${field.customerRefName} is required`);
        } else {
          moreDetailsSchema[field.identity] = yup.string().notRequired();
        }
      }
    }
  });

  return yup.object().shape(moreDetailsSchema);
};

export const createAdditionalOptionalValidationSchema = (
  moreDetailsConfig?: MoreDetailsConfig[]
): yup.ObjectSchema<AdditionalOptionalFormData> => {
  if (moreDetailsConfig && moreDetailsConfig.length > 0) {
    const moreDetailsValidation =
      createMoreDetailsValidation(moreDetailsConfig);

    return additionalOptionalValidationSchema.shape({
      moreDetails: moreDetailsValidation,
    });
  }

  return additionalOptionalValidationSchema;
};

export const validateAdditionalOptionalField = async (
  fieldName: keyof AdditionalOptionalFormData,
  value: unknown,
  formData: AdditionalOptionalFormData
): Promise<string | null> => {
  try {
    await additionalOptionalValidationSchema.validateAt(fieldName, {
      ...formData,
      [fieldName]: value,
    });
    return null;
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return error.message;
    }
    logger.error(error, { toast: true });
    return "Validation error";
  }
};

export const validateConditionalFields = (
  ownAnyAssets: string,
  hasHomeLoan: string
) => {
  return {
    isAssetDetailsRequired: ownAnyAssets === "yes",
    isHomeLoanFieldsRequired: hasHomeLoan === "yes",
  };
};

export const transformFormData = (
  data: Partial<AdditionalOptionalFormData>
): AdditionalOptionalFormData => {
  return {
    occupation: data.occupation || "",
    designation: data.designation || "",
    sourceOfIncome: data.sourceOfIncome || "",
    annualIncome: data.annualIncome || "",
    monthlySalary: data.monthlySalary || "",
    referralSource: data.referralSource || "",
    canvassedType: data.canvassedType || "",
    canvasserId: data.canvasserId || "",
    employerDetails: data.employerDetails || "",
    customerGroup: data.customerGroup || "",
    riskCategory: data.riskCategory || "",
    customerCategory: data.customerCategory || "",
    nationality: data.nationality || "",
    residentialStatus: data.residentialStatus || "",
    purpose: data.purpose || "",
    preferredLanguage: data.preferredLanguage || "",
    educationLevel: data.educationLevel || "",
    ownAnyAssets: data.ownAnyAssets || "no",
    assetDetails: data.assetDetails || "",
    hasHomeLoan: data.hasHomeLoan || "no",
    homeLoanAmount: data.homeLoanAmount || "",
    homeLoanCompany: data.homeLoanCompany || "",
    moreDetails: data.moreDetails || {},
  };
};

export const additionalOptionalValidationUtils = {
  validateAdditionalOptionalField,
  validateConditionalFields,
  createAdditionalOptionalValidationSchema,
  createMoreDetailsValidation,
};
