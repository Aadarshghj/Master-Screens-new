import * as yup from "yup";

export const glHeadValidationSchema = yup.object({
  loanScheme: yup.string().required("Loan Scheme is required"),
  glAccountType: yup.string().required("GL Account Type is required"),
  glAccount: yup.string().required("GL Account is required"),
});

export const glHeadTableValidationSchema = yup.object({
  glHeads: yup
    .array()
    .of(glHeadValidationSchema)
    .min(1, "At least one GL Head must be configured")
    .test(
      "unique-gl-accounts",
      "GL Account codes must be unique",
      function (glHeads) {
        if (!glHeads) return true;
        const codes = glHeads.map(gl => gl.glAccount);
        return codes.length === new Set(codes).size;
      }
    )
    .test(
      "unique-transaction-type-account-type",
      "Each transaction type can have only one GL account per account type",
      function (glHeads) {
        if (!glHeads) return true;

        const combinations = glHeads.map(
          gl => `${gl.glAccountType}-${gl.glAccount}`
        );
        return combinations.length === new Set(combinations).size;
      }
    )
    .test(
      "required-transaction-types",
      "All essential transaction types must be configured",
      function (glHeads) {
        if (!glHeads) return true;

        const requiredTypes = ["DISBURSEMENT", "REPAYMENT", "INTEREST_ACCRUAL"];
        const configuredTypes = glHeads.map(gl => gl.glAccountType);

        return requiredTypes.every(type => configuredTypes.includes(type));
      }
    ),
});

export const glAccountBalanceValidationSchema = yup
  .object({
    totalAssets: yup
      .number()
      .required("Total Assets is required")
      .min(0, "Total Assets cannot be negative"),
    totalLiabilities: yup
      .number()
      .required("Total Liabilities is required")
      .min(0, "Total Liabilities cannot be negative"),
    totalEquity: yup.number().required("Total Equity is required"),
  })
  .test(
    "accounting-equation",
    "Assets must equal Liabilities + Equity",
    function (value) {
      const { totalAssets, totalLiabilities, totalEquity } = value;
      if (
        totalAssets === undefined ||
        totalLiabilities === undefined ||
        totalEquity === undefined
      ) {
        return true;
      }

      const difference = Math.abs(
        totalAssets - (totalLiabilities + totalEquity)
      );
      return difference < 0.01; // Allow for minor rounding differences
    }
  );

export type GlHeadFormValidation = yup.InferType<typeof glHeadValidationSchema>;
export type GlHeadTableValidation = yup.InferType<
  typeof glHeadTableValidationSchema
>;
export type GlAccountBalanceValidation = yup.InferType<
  typeof glAccountBalanceValidationSchema
>;
