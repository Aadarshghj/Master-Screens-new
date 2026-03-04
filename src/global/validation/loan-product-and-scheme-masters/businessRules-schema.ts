import type { LoanBusinessRuleFormData } from "@/types/loan-product-and-scheme-masters/business-rules.types";
import * as yup from "yup";

export const loanBusinessRuleValidationSchema: yup.ObjectSchema<LoanBusinessRuleFormData> =
  yup.object().shape({
    loanProduct: yup
      .string()
      .required("Loan product is required")
      .test(
        "not-empty",
        "Loan product is required",
        value => value?.trim() !== ""
      ),

    ruleCode: yup
      .string()
      .required("Rule code is required")
      .matches(
        /^[A-Z0-9_]+$/,
        "Rule code must contain only uppercase letters, numbers, and underscores"
      )
      .min(2, "Rule code must be at least 2 characters")
      .max(50, "Rule code must not exceed 50 characters"),

    ruleName: yup
      .string()
      .required("Rule name is required")
      .min(2, "Rule name must be at least 2 characters")
      .max(200, "Rule name must not exceed 200 characters"),

    ruleCategory: yup
      .string()
      .required("Rule category is required")
      .test(
        "not-empty",
        "Rule category is required",
        value => value?.trim() !== ""
      ),

    conditionExpression: yup
      .string()
      .required("Condition expression is required")
      .min(5, "Condition expression must be at least 5 characters")
      .max(1000, "Condition expression must not exceed 1000 characters"),

    actionExpression: yup
      .string()
      .required("Action expression is required")
      .min(5, "Action expression must be at least 5 characters")
      .max(1000, "Action expression must not exceed 1000 characters"),

    isActive: yup.boolean().default(true),
  });
