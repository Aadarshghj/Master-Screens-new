// validation/workflow-amount-schema.ts

import * as yup from "yup";

export const workflowAmountValidationSchema = yup.object().shape({
  workflow: yup
    .string()
    .required("Workflow is required")
    .test("not-empty", "Workflow is required", value => value !== ""),

  fromAmount: yup
    .string()
    .required("From amount is required")
    .test("is-number", "From amount must be a valid number", value => {
      if (!value) return false;
      const cleanValue = String(value).replace(/,/g, "");
      const num = parseFloat(cleanValue);
      return !isNaN(num) && num >= 0;
    }),

  toAmount: yup
    .string()
    .required("To amount is required")
    .test("is-number", "To amount must be a valid number", value => {
      if (!value) return false;
      const cleanValue = String(value).replace(/,/g, "");
      const num = parseFloat(cleanValue);
      return !isNaN(num) && num >= 0;
    })
    .test(
      "greater-than-from",
      "To amount must be greater than from amount",
      function (value) {
        const { fromAmount } = this.parent;
        if (!value || !fromAmount) return true;
        const to = parseFloat(String(value).replace(/,/g, ""));
        const from = parseFloat(String(fromAmount).replace(/,/g, ""));
        return to > from;
      }
    ),

  amountOn: yup
    .string()
    .required("Amount on is required")
    .test("not-empty", "Amount on is required", value => value !== ""),

  approvalFlow: yup
    .array()
    .of(yup.string().required())
    .min(1, "At least one approval flow is required")
    .required("Approval flow is required"),

  active: yup.boolean().default(true),
});

export type WorkflowAmountValidationSchema = yup.InferType<
  typeof workflowAmountValidationSchema
>;
