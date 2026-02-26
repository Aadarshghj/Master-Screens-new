// types/workflow-amount.ts

export interface WorkflowAmountRule {
  workflowAmountRuleIdentity?: string;
  workflowIdentity: string;
  workflow?: string; // for display purposes
  fromAmount: number;
  toAmount: number;
  amountOn: string;
  approvalFlow: string | string[]; // can be single value or array
  active: boolean;
  status?: string;
  createdDate?: string;
  modifiedDate?: string;
}

export interface WorkflowAmountFormData {
  workflow: string;
  fromAmount: string;
  toAmount: string;
  amountOn: string;
  approvalFlow: string[];
  active: boolean;
}

export interface WorkflowAmountResponse {
  content: WorkflowAmountRule[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

export interface WorkflowAmountSearchParams {
  workflow?: string;
  page?: number;
  size?: number;
}

export interface OptionType {
  value: string;
  label: string;
}

export interface WorkflowAmountFormProps {
  readonly?: boolean;
}

export interface AmountRulesFilterProps {
  onEdit: (rule: WorkflowAmountRule) => void;
  selectedWorkflow?: string;
  onWorkflowChange?: (workflow: string) => void;
}
