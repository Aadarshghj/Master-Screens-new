import * as yup from "yup";

export const businessRulesValidationSchema = yup.object({
  loanName: yup.string().required("Loan Name is required"),
  businessRuleIdentity: yup.string().required("Business Rule is required"),
  executionOrder: yup
    .number()
    .required("Execution Order is required")
    .min(1, "Execution Order must be at least 1")
    .integer("Execution Order must be a whole number"),
  effectiveFrom: yup
    .string()
    .required("Effective From date is required")
    .matches(
      /^\d{4}-\d{2}-\d{2}$/,
      "Effective From must be a valid date (YYYY-MM-DD)"
    ),
  effectiveTo: yup
    .string()
    .required("Effective To date is required")
    .test(
      "is-after-effective-from",
      "Effective To must be after Effective From",
      function (value) {
        const { effectiveFrom } = this.parent;
        if (!value || !effectiveFrom) return true;
        return new Date(value) > new Date(effectiveFrom);
      }
    ),
  isActive: yup.boolean().default(true),
});

export const businessRuleTableValidationSchema = yup.object({
  businessRules: yup
    .array()
    .of(businessRulesValidationSchema)
    .min(1, "At least one business rule must be configured")
    .test(
      "unique-execution-order",
      "Execution orders must be unique",
      function (rules) {
        if (!rules) return true;
        const orders = rules.map(r => r.executionOrder);
        return orders.length === new Set(orders).size;
      }
    ),
});

export type BusinessRulesFormValidation = yup.InferType<
  typeof businessRulesValidationSchema
>;
export type BusinessRuleTableValidation = yup.InferType<
  typeof businessRuleTableValidationSchema
>;
