export interface Approver {
  identity: string;
  code: string;
}
export interface QueData {
  rowIdentity: string;
  moduleCode: string;
  moduleName: string;
  workflowDefinitionName: string;
  referenceNo: string;
  currentStageName: string;
  status: string;
  createdAt: string;
  createdBy: string;
  createdByCode: string;
  isDelegated: boolean;
  delegatedFromUserCode: string | null;
  amount: number | null;
  branchCode: string;
  eligibleApprovers: Approver[];
  referenceIdentity: string;
  subModuleCode: string;
  subModuleName: string;
}
export interface AprovalQueueResponse {
  content: QueData[];
  totalElements: number;
  totalPages: number;
}

export interface ApprovalQueueFormData {
  branchIdentity?: string;
  moduleIdentity?: string;
  subModuleIdentity?: string;
  referenceNo?: string;
  status?: string;
  sort?: string;
  workflowIdentity?: string;
  page?: number;
  size?: number;
}

export interface ModuleItem {
  moduleName: string;
  identity: string;
  isActive: boolean;
}
export interface WorkflowDefinitionItem {
  workflowName: string;
  description: string;
  identity: string;
}

export interface BranchItem {
  branchName: string;
  identity: string;
}

export interface WorkflowActionRequest {
  instanceIdentity: string;
  action: string;
  remarks?: string;
}

export interface WorkflowActionResponse {
  success: boolean;
  message?: string;
}

export interface ApprovalConfirmationModalState {
  showConfirmationModal: boolean;
  action: string | null;
  instanceIdentity: string | null;
}

export interface ApprovalQueueFilterProps {
  handleSetFilters: (updates: Partial<ApprovalQueueFormData>) => void;
}
