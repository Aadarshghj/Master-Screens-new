import * as yup from "yup";
import type {
  TenantType,
  TenantAddressType,
} from "../../../types/customer-management/tenant";

export const tenantAddressSchema: yup.ObjectSchema<TenantAddressType> =
  yup.object({
    addressType: yup
      .string()
      .oneOf(
        ["registered_office", "corporate_office", "factory"],
        "Invalid Address Type selected"
      )
      .optional(),

    streetLaneName: yup
      .string()
      .required("Street/Lane Name is required")
      .max(200, "Street/Lane Name must not exceed 200 characters")
      .test(
        "not-only-spaces",
        "Street/Lane Name cannot contain only spaces",
        value => !!value && value.trim().length > 0
      ),

    placeName: yup
      .string()
      .max(200, "Place Name must not exceed 200 characters")
      .test(
        "not-only-spaces",
        "Place Name cannot contain only spaces",
        value => !value || value.trim().length > 0
      ),

    pinCode: yup
      .number()
      .transform((_, originalValue) =>
        originalValue === "" ? undefined : Number(originalValue)
      )
      .typeError("PIN Code must be numeric")
      .required("PIN Code is required")
      .integer("PIN Code must be numeric")
      .min(100000, "PIN Code must be 6 digits")
      .max(999999, "PIN Code must be 6 digits"),

    country: yup.string().required("Country is required"),

    state: yup.string().required("State is required"),

    district: yup.string().required("District is required"),

    city: yup.string().required("City is required"),

    postOffice: yup.string().optional(),

    landmark: yup
  .string()
  .test(
    "not-only-spaces",
    "Landmark cannot contain only spaces",
    value => !value || value.trim().length > 0
  ),

  siteFactoryPremise: yup
  .string()
  .oneOf(
    ["site", "rented", "factory"],
    "Invalid Site/Factory Premise selected"
  )
  .optional(),
  
  nameOfTheOwner: yup.string().optional(),

relationshipWithTenant: yup.string().optional(),

landlineNumber: yup
  .string()
  .matches(/^[0-9]*$/, "Landline Number must contain only digits")
  .max(15, "Landline Number must not exceed 15 digits")
  .optional(),

timeZone: yup.string().optional(),



  });

export const tenantSchema: yup.ObjectSchema<TenantType> = yup.object({
  id: yup.string().required(),

  tenantName: yup
    .string()
    .required("Tenant Name is required")
    .min(3, "Tenant Name must be at least 3 characters")
    .max(150, "Maximum 150 characters")
    .matches(
      /^[A-Za-z0-9 ]+$/,
      "Tenant Name must contain only letters and numbers. No special characters."
    )
    .test(
      "not-only-spaces",
      "Tenant Name cannot contain only spaces",
      value => !!value && value.trim().length > 0
    )
    .test(
      "no-leading-space",
      "Tenant Name should not start with a space",
      value => {
        if (!value) return true;
        return !value.startsWith(" ");
      }
    )
    .test(
      "no-multiple-spaces",
      "Tenant Name cannot contain multiple continuous spaces",
      value => {
        if (!value) return true;
        return !/\s{2,}/.test(value);
      }
    )
    .test(
      "not-only-numbers",
      "Tenant Name cannot contain only numbers",
      value => {
        if (!value) return true;
        return !/^\d+$/.test(value);
      }
    )
    .test(
      "no-triple-duplicate-words",
      "Tenant Name should not contain the same word more than 2 times",
      value => {
        if (!value) return true;

        const words = value.toLowerCase().split(" ");
        const wordCount: Record<string, number> = {};

        for (const word of words) {
          wordCount[word] = (wordCount[word] || 0) + 1;
          if (wordCount[word] >= 3) {
            return false;
          }
        }

        return true;
      }
    )
    .test(
      "no-repeated-letters",
      "Tenant Name contains too many repeated letters",
      value => {
        if (!value) return true;
        return !/(.)\1{3,}/.test(value);
      }
    )
    .test(
      "unique-tenant-name",
      "Tenant Name already exists",
      async function (value) {
        if (!value) return true;

        return true;
      }
    ),

  tenantCode: yup
    .string()
    .transform(value => (value ? value.replace(/[^A-Za-z0-9_]/g, "") : value))
    .required("Tenant Code is required")
    .min(3, "Tenant Name must be at least 3 characters")
    .max(20, "Maximum 20 characters")
    .matches(
      /^[A-Za-z0-9_]+$/,
      "Tenant Code must contain only letters, numbers, and underscore (_). No spaces."
    )
    .test(
      "code-not-only-numbers",
      "Tenant Code cannot contain only numbers",
      value => (value ? !/^\d+$/.test(value) : true)
    )
    .test(
      "code-not-only-letters",
      "Tenant Code cannot contain only letters",
      value => (value ? !/^[A-Za-z]+$/.test(value) : true)
    )
    .test(
      "no-double-underscore",
      "Tenant Code cannot contain consecutive underscores",
      value => (value ? !/__/.test(value) : true)
    ),

  legalEntityName: yup
    .string()
    .required("Legal Entity Name is required")
    .max(150, "Maximum 150 characters"),

  tenantType: yup
    .string()
    .required("Tenant Type is required")
    .oneOf(
      ["nbfc", "bank", "fintech", "microfinance", "corporate"],
      "Invalid Tenant Type selected"
    ),

  registrationNo: yup
    .string()
    .required("Registration Number is required")
    .max(50, "Maximum 50 characters"),

  rbiRegistrationNumber: yup
    .string()
    .max(50, "Maximum 50 characters")
    .when("tenantType", {
      is: (tenantType: string) => tenantType === "nbfc",
      then: schema => schema.required("RBI Registration Number is required"),
      otherwise: schema => schema.notRequired(),
    }),

  panNumber: yup
    .string()
    .required("PAN Number is required")
    .length(10, "PAN Number must be exactly 10 characters"),

  gstNumber: yup.string().max(15, "GST Number must not exceed 15 characters"),

  cinNumber: yup.string().max(15, "CIN Number must not exceed 15 characters"),

  contactNumber: yup
    .string()
    .required("Contact Number is required")
    .matches(/^[0-9]+$/, "Contact Number must contain only digits")
    .max(15, "Contact Number must not exceed 15 digits"),

  website: yup
    .string()
    .max(200, "Website URL must not exceed 200 characters")
    .url("Enter a valid website URL"),

  businessEmail: yup
    .string()
    .required("Email is required")
    .max(100, "Email must not exceed 100 characters")
    .email("Enter a valid email address"),

  chooseFile: yup
    .mixed<File>()
    .required("Tenant Logo is required")
    .test(
      "fileType",
      "Only PDF, JPG, JPEG, PNG, TIFF files are allowed",
      value => {
        if (!value) return false;
        const supportedFormats = [
          "application/pdf",
          "image/jpeg",
          "image/jpg",
          "image/png",
          "image/tiff",
        ];
        return supportedFormats.includes(value.type);
      }
    ),
  tenantAddress: tenantAddressSchema.optional(),
  attributes: yup.array().optional(),
  isActive: yup.boolean().required(),
});
