import type { LoanSchemeFormData } from "@/types/loan-product-and schema Stepper/index";
import * as yup from "yup";

const amountRegex = /^[0-9]+(\.[0-9]{1,2})?$/;
const percentageRegex = /^[0-9]+(\.[0-9]{1,2})?$/;
const integerRegex = /^[0-9]+$/;

export const loanProductSchemeValidationSchema = (
  periodMinTypeOptions: Array<{ value: string; label: string }> = [],
  periodMaxTypeOptions: Array<{ value: string; label: string }> = [],
  interestTypeOptions: Array<{ value: string; label: string }> = []
): yup.ObjectSchema<LoanSchemeFormData> =>
  yup.object().shape({
    loanProductName: yup
      .string()
      .required("Loan product is required")
      .test("not-empty", "Loan product is required", v => v?.trim() !== ""),

    schemeCode: yup.string().default(""),

    schemeName: yup
      .string()
      .required("Scheme name is required")
      .min(3, "Scheme name must be at least 3 characters")
      .max(100, "Scheme name must not exceed 100 characters")

      .test("no-leading-trailing-spaces", "Invalid format", v =>
        v ? v.trim() === v : true
      )
      .test("no-multiple-spaces", "Invalid format", v =>
        v ? !/\s{2,}/.test(v) : true
      ),

    schemeTypeName: yup
      .string()
      .required("Scheme type is required")
      .test("not-empty", "Scheme type is required", v => v?.trim() !== ""),

    effectiveFrom: yup.string().required("Effective from date is required"),
    effectiveTo: yup
      .string()
      .default("")
      .test(
        "after-effective-from",
        "Effective to date must be after effective from date",
        function (value) {
          const { effectiveFrom } = this.parent;
          if (!value || !effectiveFrom) return true;
          return new Date(value) > new Date(effectiveFrom);
        }
      ),

    fromAmount: yup
      .string()
      .required("From amount is required")
      .matches(amountRegex, "Enter valid amount")
      .test("min-amount", "Amount must be greater than 0", v =>
        v ? parseFloat(v) > 0 : false
      )
      .test("max-amount", "Amount cannot exceed 99,99,99,999", v =>
        v ? parseFloat(v) <= 999999999 : true
      )
      .test("no-leading-zero", "Invalid format", v =>
        v ? !/^0[0-9]/.test(v) : true
      ),

    toAmount: yup
      .string()
      .required("To amount is required")
      .matches(amountRegex, "Enter valid amount")
      .test("min-amount", "Amount must be greater than 0", v =>
        v ? parseFloat(v) > 0 : false
      )
      .test("max-amount", "Amount cannot exceed 99,99,99,999", v =>
        v ? parseFloat(v) <= 999999999 : true
      )
      .test("no-leading-zero", "Invalid format", v =>
        v ? !/^0[0-9]/.test(v) : true
      )
      .test(
        "greater-than-from",
        "To amount must be greater than from amount",
        function (value) {
          const { fromAmount } = this.parent;
          if (value && fromAmount)
            return parseFloat(value) > parseFloat(fromAmount);
          return true;
        }
      ),

    minimumPeriod: yup
      .string()
      .required("Minimum period is required")
      .matches(integerRegex, "Enter valid number")
      .test("min-period", "Period must be greater than 0", v =>
        v ? Number(v) > 0 : false
      )
      .test("max-period", "Period cannot exceed 9999", v =>
        v ? Number(v) <= 9999 : true
      )
      .test("no-leading-zero", "Invalid format", v =>
        v ? !/^0/.test(v) || v === "0" : true
      ),

    minPeriodTypeName: yup
      .string()
      .required("Min period type is required")
      .test("not-empty", "Min period type is required", v => v?.trim() !== ""),

    periodTypeName: yup
      .string()
      .required("Max period type is required")
      .test("not-empty", "Max period type is required", v => v?.trim() !== "")
      .test("period-type-hierarchy", function (value) {
        const { minPeriodTypeName } = this.parent;
        if (!value || !minPeriodTypeName) return true;

        // Get labels from options
        const minLabel =
          periodMinTypeOptions.find(opt => opt.value === minPeriodTypeName)
            ?.label || "";
        const maxLabel =
          periodMaxTypeOptions.find(opt => opt.value === value)?.label || "";

        if (!minLabel || !maxLabel) return true;

        // Period type hierarchy: DAY < WEEK < MONTH < QUARTER < YEAR
        const hierarchy: Record<string, number> = {
          DAY: 1,
          DAYS: 1,
          WEEK: 2,
          WEEKS: 2,
          MONTH: 3,
          MONTHS: 3,
          QUARTER: 4,
          QUARTERS: 4,
          YEAR: 5,
          YEARS: 5,
        };

        const minTypeRank = hierarchy[minLabel.toUpperCase()];
        const maxTypeRank = hierarchy[maxLabel.toUpperCase()];

        // If types not found in hierarchy, skip validation
        if (!minTypeRank || !maxTypeRank) return true;

        const isValid = maxTypeRank >= minTypeRank;

        // Return custom error message with period names
        return (
          isValid ||
          this.createError({
            message: `${maxLabel} cannot be less than ${minLabel}. Please select ${minLabel} or higher period type.`,
          })
        );
      }),

    /* ⭐⭐⭐ FINAL FIXED MAXIMUM PERIOD VALIDATION ⭐⭐⭐ */
    maximumPeriod: yup
      .string()
      .required("Maximum period is required")
      .matches(integerRegex, "Enter valid number")
      .test("min-period", "Period must be greater than 0", v =>
        v ? Number(v) > 0 : false
      )
      .test("max-period", "Period cannot exceed 9999", v =>
        v ? Number(v) <= 9999 : true
      )
      .test("no-leading-zero", "Invalid format", v =>
        v ? !/^0/.test(v) || v === "0" : true
      )
      .test(
        "period-comparison",
        "Maximum period must be greater than minimum period when period types are the same",
        function (value) {
          const { minimumPeriod, minPeriodTypeName, periodTypeName } =
            this.parent;

          if (!value || !minimumPeriod || !minPeriodTypeName || !periodTypeName)
            return true;

          const maxNum = Number(value);
          const minNum = Number(minimumPeriod);
          if (Number.isNaN(maxNum) || Number.isNaN(minNum)) return true;

          // Get labels from options
          const minLabel =
            periodMinTypeOptions.find(opt => opt.value === minPeriodTypeName)
              ?.label || "";
          const maxLabel =
            periodMaxTypeOptions.find(opt => opt.value === periodTypeName)
              ?.label || "";

          if (!minLabel || !maxLabel) return true;

          // Only validate if period types are the same
          if (minLabel.toUpperCase() === maxLabel.toUpperCase()) {
            return maxNum > minNum;
          }

          return true;
        }
      ),

    maxPeriodType: yup.string().default(""),
    maxPeriodTypeName: yup.string().default(""),

    interestTypeName: yup
      .string()
      .required("Interest type is required")
      .test("not-empty", "Interest type is required", v => v?.trim() !== ""),

    fixedInterestRate: yup
      .string()
      .default("")
      .when("interestTypeName", {
        is: (value: string) => {
          // Check if interest type is NOT slabwise by checking the label
          const selectedOption = interestTypeOptions.find(
            opt => opt.value === value
          );
          return (
            selectedOption &&
            !selectedOption.label?.toLowerCase().includes("slab")
          );
        },
        then: schema =>
          schema
            .required("Fixed interest rate is required")
            .matches(percentageRegex, "Enter valid interest rate")
            .test(
              "min-rate",
              "Interest rate must be at least 0.01%",
              value => !!value && parseFloat(value) >= 0.01
            )
            .test(
              "max-rate",
              "Interest rate cannot exceed 100%",
              value => !value || parseFloat(value) <= 100
            )
            .test(
              "no-leading-zero",
              "Invalid format",
              value => !value || !/^0[0-9]/.test(value)
            ),
        otherwise: schema =>
          schema
            .test(
              "valid-percentage",
              "Enter valid interest rate",
              value => !value || percentageRegex.test(value)
            )
            .test(
              "min-rate",
              "Interest rate must be at least 0.01%",
              value => !value || parseFloat(value) >= 0.01
            )
            .test(
              "max-rate",
              "Interest rate cannot exceed 100%",
              value => !value || parseFloat(value) <= 100
            )
            .test(
              "no-leading-zero",
              "Invalid format",
              value => !value || !/^0[0-9]/.test(value)
            ),
      }),

    penalInterest: yup
      .string()
      .default("")
      .when("penalInterestApplicable", {
        is: true,
        then: schema =>
          schema
            .required(
              "Penal interest is required when penal interest is applicable"
            )
            .matches(percentageRegex, "Enter valid interest rate")
            .test(
              "min-rate",
              "Interest rate cannot be negative",
              value => !value || parseFloat(value) >= 0
            )
            .test(
              "max-rate",
              "Interest rate cannot exceed 100%",
              value => !value || parseFloat(value) <= 100
            ),
      }),

    penalInterestBaseName: yup
      .string()
      .default("")
      .when("penalInterestApplicable", {
        is: true,
        then: schema =>
          schema.required(
            "Penal interest on is required when penal interest is applicable"
          ),
      }),

    rebateBaseName: yup
      .string()
      .default("")
      .when("rebateApplicable", {
        is: true,
        then: schema =>
          schema.required("Rebate on is required when rebate is applicable"),
      }),

    rebatePercentage: yup
      .string()
      .default("")
      .when("rebateApplicable", {
        is: true,
        then: schema =>
          schema
            .required("Rebate percentage is required when rebate is applicable")
            .matches(percentageRegex, "Enter valid percentage")
            .test(
              "min-percentage",
              "Percentage cannot be negative",
              value => !value || parseFloat(value) >= 0
            )
            .test(
              "max-percentage",
              "Percentage cannot exceed 100%",
              value => !value || parseFloat(value) <= 100
            ),
      }),

    gracePeriod: yup
      .string()
      .default("")
      .when("emiApplicable", {
        is: true,
        then: schema =>
          schema
            .required("Grace period is required when EMI is applicable")
            .matches(integerRegex, "Enter valid number")
            .test(
              "min-period",
              "Grace period cannot be negative",
              v => !v || Number(v) >= 0
            )
            .test(
              "max-period",
              "Grace period cannot exceed 365 days",
              v => !v || Number(v) <= 365
            )
            .test(
              "no-leading-zero",
              "Invalid format",
              v => !v || !/^0[0-9]/.test(v)
            ),
      }),

    moratoriumInterestRate: yup
      .string()
      .default("")
      .when("moratoriumInterestRequired", {
        is: true,
        then: schema =>
          schema
            .required(
              "Moratorium interest rate is required when moratorium interest is required"
            )
            .matches(percentageRegex, "Enter valid interest rate")
            .test(
              "min-rate",
              "Interest rate cannot be negative",
              value => !value || parseFloat(value) >= 0
            )
            .test(
              "max-rate",
              "Interest rate cannot exceed 100%",
              value => !value || parseFloat(value) <= 100
            ),
      }),

    remarks: yup
      .string()
      .default("")
      .max(500, "Remarks must not exceed 500 characters")
      .test(
        "no-special-chars",
        "Invalid characters",
        v => !v || /^[a-zA-Z0-9\s.,!?]*$/.test(v)
      )
      .test(
        "no-leading-trailing-spaces",
        "Invalid format",
        v => !v || v.trim() === v
      ),

    penalInterestApplicable: yup.boolean().default(false),
    reverseInterestApplicable: yup.boolean().default(false),
    moratoriumInterestRequired: yup.boolean().default(false),
    rebateApplicable: yup.boolean().default(false),
    emiApplicable: yup.boolean().default(false),
    takeoverScheme: yup.boolean().default(false),
    coLendingScheme: yup.boolean().default(false),
    active: yup.boolean().default(true),
  });
