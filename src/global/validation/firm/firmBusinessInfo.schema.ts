import * as yup from "yup";

const profitabilityEntrySchema = yup.object({
  year: yup
    .string()
    .required("Year is required")
    .matches(/^\d{4}$/, "Year must be a valid 4-digit year")
    .test("valid-year", "Year must be between 1900 and current year", value => {
      if (!value) return false;
      const year = parseInt(value, 10);
      const currentYear = new Date().getFullYear();
      return year >= 1900 && year <= currentYear;
    }),

  amount: yup
    .string()
    .nullable()
    .transform(v => (v === "0" || v === "" ? undefined : v))
    .test("numeric", "Amount must be a valid number", v => {
      if (!v) return true;
      return /^\d+(\.\d+)?$/.test(v);
    }),
});

export const businessInformationValidationSchema = yup
  .object({
    natureOfBusiness: yup
      .string()
      .required("Nature of business is required")
      .min(3, "Nature of business must be at least 3 characters")
      .max(200, "Nature of business must not exceed 200 characters")
      .test(
        "not-only-numbers",
        "Nature of business cannot contain only numbers",
        value => {
          if (!value) return true;
          return !/^\d+$/.test(value.trim());
        }
      )
      .test(
        "valid-format",
        "Nature of business must contain letters and can include numbers, spaces, and &",
        value => {
          if (!value) return true;
          // Must contain at least one letter and only allow letters, numbers, spaces, and &
          return /[a-zA-Z]/.test(value) && /^[a-zA-Z0-9\s&]+$/.test(value);
        }
      )
      .test(
        "no-invalid-symbols",
        "Nature of business cannot contain symbols like $, %, etc. Only & is allowed",
        value => {
          if (!value) return true;
          // Allow only letters, numbers, spaces, and &
          return /^[a-zA-Z0-9\s&]+$/.test(value);
        }
      ),

    yearsInOperation: yup.string().required("Years in operation is required"),
    annualTurnover: yup
      .string()
      .nullable()
      .test(
        "numeric-only",
        "Annual turnover must contain only numbers",
        value => {
          if (!value) return true;
          return /^\d+$/.test(value);
        }
      ),

    noOfEmployees: yup.string().nullable(),

    noOfBranchesOffices: yup.string().nullable(),

    dateOfIncorporation: yup
      .string()
      .required("Date of incorporation is required")
      .test(
        "valid-date",
        "Date of incorporation must be a valid date",
        value => {
          if (!value) return false;
          const date = new Date(value);
          return !isNaN(date.getTime());
        }
      )
      .test(
        "not-future",
        "Date of incorporation cannot be in the future",
        value => {
          if (!value) return false;
          const date = new Date(value);
          return date <= new Date();
        }
      ),

    authorizedCapital: yup
      .string()
      .optional()
      .transform(value => (value === "0" ? undefined : value))
      .test("numeric-only", "Only numbers allowed", value => {
        if (!value) return true;
        return /^\d+$/.test(value);
      })
      .test("greater-than-zero", "Must be greater than zero", value => {
        if (!value) return true;
        return parseInt(value, 10) > 0;
      }),

    issuedCapital: yup
      .string()
      .nullable()
      .transform(value => (value === "0" ? "" : value))
      .test(
        "numeric-only",
        "Issued capital must contain only numbers",
        value => {
          if (!value) return true;
          return /^\d+$/.test(value);
        }
      ),

    paidUpCapital: yup
      .string()
      .nullable()
      .test(
        "numeric-only",
        "Paid-up capital must contain only numbers",
        value => {
          if (!value) return true;
          return /^\d+$/.test(value);
        }
      ),

    netWorth: yup
      .string()
      .nullable()
      .test("numeric-only", "Net worth must contain only numbers", value => {
        if (!value) return true;
        return /^\d+$/.test(value);
      }),

    website: yup
      .string()
      .url("Please enter a valid website URL")
      .max(255, "Website URL must not exceed 255 characters")
      .nullable(),

    businessEmail: yup
      .string()
      .nullable()
      .email("Please enter a valid email address"),

    customerConcentration: yup
      .string()
      .nullable()
      .test(
        "percentage-only",
        "Customer concentration must be a valid percentage (0-100)",
        value => {
          if (!value) return true;
          const num = parseFloat(value);
          return !isNaN(num) && num >= 0 && num <= 100;
        }
      ),

    otherSourceIncome: yup.string().nullable(),

    seasonality: yup.string().nullable(),

    sectorPerformance: yup.string().nullable(),

    capacityUtilization: yup
      .string()
      .nullable()
      .test(
        "percentage-only",
        "Capacity utilization must be a valid percentage (0-100)",
        value => {
          if (!value) return true;
          const num = parseFloat(value);
          return !isNaN(num) && num >= 0 && num <= 100;
        }
      ),

    productClassification: yup
      .string()
      .required("Product classification is required")
      .min(2, "Product classification must be at least 2 characters")
      .max(500, "Product classification must not exceed 500 characters"),

    businessDescription: yup.string().nullable(),

    profitabilityData: yup
      .array()
      .of(profitabilityEntrySchema)
      .ensure()
      .nullable(),
  })
  .noUnknown(false);
