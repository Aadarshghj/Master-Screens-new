import type { WorkflowAmountRules } from "@/types/admin/amountrules";

export const WORKFLOW_AMOUNT_RULES_DEFAULT_VALUES: WorkflowAmountRules = {
  workflow: "",
  fromAmount: undefined,
  toAmount: undefined,
  amountOn: "",
  approvalFlow: "",
  isActive: true,
};
