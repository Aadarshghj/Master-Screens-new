// constants/workflow-amount.constants.ts

import type {
  WorkflowAmountFormData,
  WorkflowAmountSearchParams,
} from "@/types/approval-workflow/workflow-amount.types";

export const workflowAmountDefaultValues: WorkflowAmountFormData = {
  workflow: "",
  fromAmount: "",
  toAmount: "",
  amountOn: "",
  approvalFlow: [],
  active: true,
};

export const workflowAmountFilterDefaultValues: WorkflowAmountSearchParams = {
  workflow: "all",
  page: 0,
  size: 10,
};

export const AMOUNT_ON_OPTIONS = [
  { value: "001fed31-3b7d-4594-83fb-e11e765c8da6", label: "Customer exposure" },
  { value: "002fed31-3b7d-4594-83fb-e11e765c8da6", label: "Loan amount" },
  {
    value: "003fed31-3b7d-4594-83fb-e11e765c8da6",
    label: "Transaction amount",
  },
];
