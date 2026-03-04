import * as yup from "yup";

export const chargeSlabValidationSchema = yup.object({
  loanScheme: yup.string().required("Loan Scheme is required"),
  charges: yup.string().required("Charges is required"),
  rateType: yup.string().required("Rate Type is required"),

  slabRate: yup
    .string()
    .required("Slab Rate is required")
    .test(
      "is-valid-rate",
      "Slab Rate must be a valid number",
      function (value) {
        if (!value) return false;
        const numValue = parseFloat(value);
        return !isNaN(numValue) && numValue > 0;
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
  chargeOn: yup.string().required("Charge On is required"),
});

export const chargeSlabTableValidationSchema = yup.object({
  chargeSlabs: yup
    .array()
    .of(chargeSlabValidationSchema)
    .min(1, "At least one charge slab must be configured")
    .test(
      "no-amount-overlap",
      "Amount ranges should not overlap for the same charge type",
      function (slabs) {
        if (!slabs) return true;

        const groupedByCharge = slabs.reduce(
          (acc, slab) => {
            const key = `${slab.charges}-${slab.chargeOn}`;
            if (!acc[key]) acc[key] = [];
            acc[key].push(slab);
            return acc;
          },
          {} as Record<string, typeof slabs>
        );

        for (const group of Object.values(groupedByCharge)) {
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
    ),
});

export type ChargeSlabFormValidation = yup.InferType<
  typeof chargeSlabValidationSchema
>;
export type ChargeSlabTableValidation = yup.InferType<
  typeof chargeSlabTableValidationSchema
>;
