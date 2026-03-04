import * as yup from "yup";

export const recoveryPriorityValidationSchema = yup.object({
  loanScheme: yup.string().required("Loan Scheme is required"),
  recoveryHead: yup.string().required("Recovery Head is required"),
  priorityOrder: yup
    .number()
    .required("Priority Order is required")
    .min(1, "Priority Order must be at least 1")
    .integer("Priority Order must be a whole number"),
  recoveryPercentage: yup
    .string()
    .required("Recovery Percentage is required")
    .test(
      "is-valid-percentage",
      "Recovery Percentage must be a valid number",
      function (value) {
        if (!value) return false;
        const numValue = parseFloat(value);
        return !isNaN(numValue) && numValue > 0 && numValue <= 100;
      }
    ),
  active: yup.boolean().required("Active status is required"),
});

export const recoveryPriorityTableValidationSchema = yup.object({
  recoveryPriorities: yup
    .array()
    .of(recoveryPriorityValidationSchema)
    .min(1, "At least one recovery priority must be configured")
    .test(
      "unique-priority-order",
      "Priority orders must be unique",
      function (priorities) {
        if (!priorities) return true;
        const orders = priorities.map(p => p.priorityOrder);
        return orders.length === new Set(orders).size;
      }
    )
    .test(
      "unique-recovery-heads",
      "Recovery heads must be unique",
      function (priorities) {
        if (!priorities) return true;
        const heads = priorities.map(p => p.recoveryHead);
        return heads.length === new Set(heads).size;
      }
    )
    .test(
      "total-percentage-validation",
      "Total recovery percentage should not exceed 100%",
      function (priorities) {
        if (!priorities) return true;
        const totalPercentage = priorities.reduce((sum, priority) => {
          return sum + parseFloat(priority.recoveryPercentage);
        }, 0);
        return totalPercentage <= 100;
      }
    )
    .test(
      "sequential-priority-order",
      "Priority orders should be sequential starting from 1",
      function (priorities) {
        if (!priorities) return true;
        const sortedPriorities = priorities.sort(
          (a, b) => a.priorityOrder - b.priorityOrder
        );

        for (let i = 0; i < sortedPriorities.length; i++) {
          if (sortedPriorities[i].priorityOrder !== i + 1) {
            return false;
          }
        }
        return true;
      }
    ),
});

export const recoveryHeadValidationSchema = yup
  .object({
    principal: yup.boolean().default(false),
    interest: yup.boolean().default(false),
    penalInterest: yup.boolean().default(false),
    charges: yup.boolean().default(false),
    fees: yup.boolean().default(false),
  })
  .test(
    "at-least-one-selected",
    "At least one recovery head must be selected",
    function (value) {
      return Object.values(value).some(Boolean);
    }
  );

export type RecoveryPriorityFormValidation = yup.InferType<
  typeof recoveryPriorityValidationSchema
>;
export type RecoveryPriorityTableValidation = yup.InferType<
  typeof recoveryPriorityTableValidationSchema
>;
export type RecoveryHeadValidation = yup.InferType<
  typeof recoveryHeadValidationSchema
>;
