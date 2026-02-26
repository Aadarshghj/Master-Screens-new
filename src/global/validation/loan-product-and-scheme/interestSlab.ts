import * as yup from "yup";

export const interestSlabValidationSchema = yup.object({
  loanScheme: yup.string().required("Loan Scheme is required"),
  startPeriod: yup
    .string()
    .required("Start Period is required")
    .test(
      "is-valid-number",
      "Start Period must be a valid number",
      function (value) {
        if (!value) return false;
        const numValue = parseInt(value);
        return !isNaN(numValue) && numValue >= 0;
      }
    ),
  endPeriod: yup
    .string()
    .required("End Period is required")
    .test(
      "is-valid-number",
      "End Period must be a valid number",
      function (value) {
        if (!value) return false;
        const numValue = parseInt(value);
        return !isNaN(numValue) && numValue > 0;
      }
    )
    .test(
      "is-greater-than-start",
      "End Period must be greater than Start Period",
      function (value) {
        const { startPeriod } = this.parent;
        if (!value || !startPeriod) return true;
        return parseInt(value) > parseInt(startPeriod);
      }
    ),
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
  slabInterestRate: yup
    .string()
    .required("Slab Interest Rate is required")
    .test(
      "is-valid-rate",
      "Slab Interest Rate must be a valid number",
      function (value) {
        if (!value) return false;
        const numValue = parseFloat(value);
        return !isNaN(numValue) && numValue >= 0 && numValue <= 100;
      }
    ),
  annualROI: yup
    .string()
    .required("Annual ROI is required")
    .test(
      "is-valid-roi",
      "Annual ROI must be a valid number",
      function (value) {
        if (!value) return false;
        const numValue = parseFloat(value);
        return !isNaN(numValue) && numValue >= 0 && numValue <= 100;
      }
    ),
  rebateAnnualROI: yup
    .string()
    .required("Rebate Annual ROI is required")
    .test(
      "is-valid-rebate",
      "Rebate Annual ROI must be a valid percentage",
      function (value) {
        if (!value) return false;
        const numValue = parseFloat(value);
        return !isNaN(numValue) && numValue >= 0 && numValue <= 100;
      }
    ),
  recomputationRequired: yup
    .boolean()
    .required("Recomputation Required is required"),
  expired: yup.boolean().required("Expired status is required"),
});

export const interestSlabTableValidationSchema = yup.object({
  interestSlabs: yup
    .array()
    .of(interestSlabValidationSchema)
    .min(1, "At least one interest slab must be configured")
    .test(
      "no-period-overlap",
      "Period ranges should not overlap for the same amount range",
      function (slabs) {
        if (!slabs) return true;

        const groupedByAmount = slabs.reduce(
          (acc, slab) => {
            const key = `${slab.fromAmount}-${slab.toAmount}`;
            if (!acc[key]) acc[key] = [];
            acc[key].push(slab);
            return acc;
          },
          {} as Record<string, typeof slabs>
        );

        for (const group of Object.values(groupedByAmount)) {
          const sortedGroup = group.sort(
            (a, b) => parseInt(a.startPeriod) - parseInt(b.startPeriod)
          );

          for (let i = 0; i < sortedGroup.length - 1; i++) {
            const current = sortedGroup[i];
            const next = sortedGroup[i + 1];

            if (parseInt(current.endPeriod) >= parseInt(next.startPeriod)) {
              return false;
            }
          }
        }

        return true;
      }
    ),
});

export type InterestSlabFormValidation = yup.InferType<
  typeof interestSlabValidationSchema
>;
export type InterestSlabTableValidation = yup.InferType<
  typeof interestSlabTableValidationSchema
>;
