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
    ["registered office", "corporate office", "factory", ""],
    "Invalid Address Type selected"
  )
  .optional(),

    streetLaneName: yup
      .string()
      .trim()
      .required("Street / Lane Name is required")
      .max(200, "Street / Lane Name must not exceed 200 characters")
      .matches(
        /^[A-Za-z0-9\s,.\-/]+$/,
        "Street / Lane Name contains invalid characters"
      )
      .test(
        "not-only-spaces",
        "Street / Lane Name cannot contain only spaces",
        value => !!value && value.trim().length > 0
      ),

   placeName: yup
  .string()
  .trim()
  .max(200, "Place Name must not exceed 200 characters")
  .test(
    "valid-place",
    "Place Name contains invalid characters",
    value =>
      !value || /^[A-Za-z0-9\s,.\-]+$/.test(value)
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
  .trim()
  .max(200, "Landmark must not exceed 200 characters")
  .test(
    "valid-landmark",
    "Landmark contains invalid characters",
    value =>
      !value || /^[A-Za-z0-9\s,.\-/]+$/.test(value)
  ),

    siteFactoryPremise: yup
  .string()
  .oneOf(
    ["site", "rented", "factory", ""],
    "Invalid Site/Factory Premise selected"
  )
  .optional(),

    nameOfTheOwner: yup
  .string()
  .trim()
  .max(100, "Name of the Owner must not exceed 100 characters")
  .test(
    "valid-owner-name",
    "Name of the Owner must contain only letters",
    value => !value || /^[A-Za-z ]+$/.test(value)
  )
  .test(
    "not-only-spaces",
    "Name of the Owner cannot contain only spaces",
    value => !value || value.trim().length > 0
  ),
   relationshipWithTenant: yup
  .string()
  .trim()
  .max(50, "Relationship must not exceed 50 characters")
  .test(
    "valid-relationship",
    "Relationship must contain only letters",
    value => !value || /^[A-Za-z ]+$/.test(value)
  ),

   landlineNumber: yup
  .string()
  .trim()
  .max(15, "Landline Number must not exceed 15 characters")
  .test(
    "valid-landline",
    "Landline Number must contain only digits and hyphen",
    value =>
      !value || /^[0-9\-]+$/.test(value)
  ),

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
    .trim()
    .required("Legal Entity Name is required")
    .min(3, "Legal Entity Name must be at least 3 characters")
    .max(150, "Legal Entity Name must not exceed 150 characters")
    .matches(
      /^[A-Za-z0-9&.,()\/\- ]+$/,
      "Legal Entity Name contains invalid characters"
    )
    .test(
      "not-only-spaces",
      "Legal Entity Name cannot contain only spaces",
      value => !!value && value.trim().length > 0
    )
    .test(
      "no-multiple-spaces",
      "Legal Entity Name cannot contain multiple continuous spaces",
      value => !value || !/\s{2,}/.test(value)
    )
    .test(
      "not-only-numbers",
      "Legal Entity Name cannot contain only numbers",
      value => !value || !/^\d+$/.test(value)
    ),

  tenantType: yup
    .string()
    .required("Tenant Type is required")
    .oneOf(
      ["nbfc", "bank", "fintech", "microfinance", "corporate"],
      "Invalid Tenant Type selected"
    ),

  registrationNo: yup
    .string()
    .trim()
    .required("Registration Number is required")
    .max(50, "Registration Number must not exceed 50 characters")
    .matches(
      /^[A-Za-z0-9\/\-.]+$/,
      "Registration Number contains invalid characters"
    )
    .test(
      "not-only-spaces",
      "Registration Number cannot contain only spaces",
      value => !!value && value.trim().length > 0
    ),

  rbiRegistrationNumber: yup
    .string()
    .trim()
    .max(50, "RBI Registration Number must not exceed 50 characters")
    .when("tenantType", {
      is: (tenantType?: string) => tenantType?.toLowerCase() === "nbfc",
      then: schema => schema.required("RBI Registration Number is required"),
      otherwise: schema => schema.notRequired(),
    }),
    

  panNumber: yup
    .string()
    .trim()
    .required("PAN Number is required")
    .length(10, "PAN Number must be exactly 10 characters")
    .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Enter a valid PAN Number"),

  gstNumber: yup
    .string()
    .trim()
    .test(
      "gst-format",
      "Enter a valid GST Number",
      value =>
        !value || /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{3}$/.test(value)
    )
    .max(15, "GST Number must not exceed 15 characters"),

  cinNumber: yup
    .string()
    .trim()
    .test(
      "cin-format",
      "Enter a valid CIN Number",
      value =>
        !value || /^[LU][0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/.test(value)
    )
    .max(21, "CIN Number must not exceed 21 characters"),

  contactNumber: yup
    .string()
    .trim()
    .required("Contact Number is required")
    .matches(/^[0-9]+$/, "Contact Number must contain only digits")
    .min(6, "Contact Number must be at least 6 digits")
    .max(15, "Contact Number must not exceed 15 digits"),

  website: yup
  .string()
  .trim()
  .max(200, "Website URL must not exceed 200 characters")
  .matches(
    /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/,
    {
      message: "Enter a valid website URL",
      excludeEmptyString: true
    }
  ),

  businessEmail: yup
    .string()
    .trim()
    .lowercase()
    .required("Email is required")
    .max(100, "Email must not exceed 100 characters")
    .email("Enter a valid email address")
    .matches(
      /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
      "Enter a valid email format"
    )
    .test(
      "no-consecutive-dots",
      "Email cannot contain consecutive dots",
      value => !value || !value.includes("..")
    )
    .test(
      "single-at",
      "Email cannot contain multiple @ symbols",
      value => !value || (value.match(/@/g) || []).length === 1
    ),

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
