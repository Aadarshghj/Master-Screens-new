import type { WorkflowAmountRulesRow } from "@/types/admin/amountrules";

export const WORKFLOW_AMOUNT_RULES_MOCK_DATA: WorkflowAmountRulesRow[] = [
  {
    id: "1",
    workflow: "Customer Onboarding",
    fromAmount: 0,
    toAmount: 10000,
    amountOn: "invoice",
    approvalFlow: "manager_approval",
    isActive: true,
  },
  {
    id: "2",
    workflow: "Loan Approval",
    fromAmount: 10001,
    toAmount: 50000,
    amountOn: "invoice",
    approvalFlow: "manager_finance",
    isActive: true,
  },
  {
    id: "3",
    workflow: "Customer Onboarding",
    fromAmount: 0,
    toAmount: 5000,
    amountOn: "claim",
    approvalFlow: "reporting_manager",
    isActive: false,
  },
];
