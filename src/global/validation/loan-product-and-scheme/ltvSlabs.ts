import * as yup from "yup";

export const ltvSlabValidationSchema = yup.object({
  loanScheme: yup.string().required("Loan Scheme is required"),
  fromAmount: yup
    .string()
    .required("From Amount is required")
    .test(
      "is-valid-amount",
      "From Amount must be a valid number",
      function (value) {
        if (!value) return false;
        const numValue = parseFloat(value);
        return !isNaN(numValue) && numValue >= 0;
      }
    ),
  toAmount: yup
    .string()
    .required("To Amount is required")
    .test(
      "is-valid-amount",
      "To Amount must be a valid number",
      function (value) {
        if (!value) return false;
        const numValue = parseFloat(value);
        return !isNaN(numValue) && numValue >= 0;
      }
    )
    .test(
      "is-greater-than-from",
      "To Amount must be greater than From Amount",
      function (value) {
        const { fromAmount } = this.parent;
        if (!value || !fromAmount) return true;
        return parseFloat(value) > parseFloat(fromAmount);
      }
    ),
  ltvPercentage: yup
    .string()
    .required("LTV Percentage is required")
    .test(
      "is-valid-percentage",
      "LTV Percentage must be a valid number",
      function (value) {
        if (!value) return false;
        const numValue = parseFloat(value);
        return !isNaN(numValue) && numValue > 0 && numValue <= 100;
      }
    ),
  ltvOn: yup.string().required("LTV On is required"),
});

export const ltvSlabTableValidationSchema = yup.object({
  ltvSlabs: yup
    .array()
    .of(ltvSlabValidationSchema)
    .min(1, "At least one LTV slab must be configured")
    .test(
      "no-amount-overlap",
      "Amount ranges should not overlap for the same LTV On type",
      function (slabs) {
        if (!slabs) return true;

        const groupedByLtvOn = slabs.reduce(
          (acc, slab) => {
            if (!acc[slab.ltvOn]) acc[slab.ltvOn] = [];
            acc[slab.ltvOn].push(slab);
            return acc;
          },
          {} as Record<string, typeof slabs>
        );

        for (const group of Object.values(groupedByLtvOn)) {
          const sortedGroup = group.sort(
            (a, b) => parseFloat(a.fromAmount) - parseFloat(b.fromAmount)
          );

          for (let i = 0; i < sortedGroup.length - 1; i++) {
            const current = sortedGroup[i];
            const next = sortedGroup[i + 1];

            if (parseFloat(current.toAmount) >= parseFloat(next.fromAmount)) {
              return false;
            }
          }
        }

        return true;
      }
    )
    .test(
      "ltv-percentage-validation",
      "LTV percentages should be reasonable (not exceed 90%)",
      function (slabs) {
        if (!slabs) return true;

        return slabs.every(slab => {
          return parseFloat(slab.ltvPercentage) <= 90;
        });
      }
    ),
});

export type LtvSlabFormValidation = yup.InferType<
  typeof ltvSlabValidationSchema
>;
export type LtvSlabTableValidation = yup.InferType<
  typeof ltvSlabTableValidationSchema
>;
