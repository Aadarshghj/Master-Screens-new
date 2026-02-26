export const recoveryPriorityDefaultFormValues = {
  loanScheme: "",
};

export const RECOVERY_PRIORITY_FIELD_LABELS = {
  loanScheme: "Loan Scheme",
  component: "Recovery Component",
  priority: "Priority [1-?]",
  description: "Description",
  isActive: "Active/Inactive",
};

export const RECOVERY_PRIORITY_VALIDATION_RULES = {
  REQUIRED_FIELDS: {
    loanScheme: "Loan Scheme is required",
    priority: "Priority must be a valid number",
  },
};
