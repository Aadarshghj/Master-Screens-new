export interface Option {
  label: string;
  value: string;
}

export interface WorkflowAmountRules {
  workflow: string;

  fromAmount?: number;
  toAmount?: number;

  amountOn: string;

  approvalFlow: string;

  isActive: boolean;
}

export interface WorkflowAmountRulesRow {
  id: string;
  workflow: string;
  fromAmount: number;
  toAmount: number;
  amountOn: string;
  approvalFlow: string;
  isActive: boolean;
}

export interface WorkflowAmountRulesTableProps {
  data: WorkflowAmountRulesRow[];
  onEdit: (row: WorkflowAmountRulesRow) => void;
  onDelete: (id: string) => void;
}

export interface WorkflowAmountRulesFilterBarProps {
  workflowOptions: { label: string; value: string }[];
  selectedWorkflow: string;
  onFilterApply: (value: string) => void;
}
