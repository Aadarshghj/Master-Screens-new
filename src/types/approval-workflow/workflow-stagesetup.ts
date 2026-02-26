// types/workflow.ts

export interface WorkflowStage {
  identity?: string;
  workflowStageIdentity?: string;
  workflow?: string;
  workflowIdentity?: string;
  workflowName: string;
  levelName: string;
  assignedToRole?: string;
  assignedRoleIdentity?: string;
  finalLevel?: boolean;
  isFinalLevel?: boolean;
  createdDate?: string;
  modifiedDate?: string;
  levelOrder?: string;
}

export interface WorkflowStageFormData {
  workflow: string;
  levelName: string;
  assignedToRole: string;
  finalLevel: boolean;
}

export interface WorkflowStageResponse {
  content: WorkflowStage[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

export interface WorkflowStageSearchParams {
  workflow?: string;
  page?: number;
  size?: number;
}

export interface OptionType {
  value: string;
  label: string;
}

export interface WorkflowStagesTableProps {
  stages: WorkflowStage[];
  isLoading?: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalElements: number;
  onEdit: (stage: WorkflowStage) => void;
  onDelete: (stage: WorkflowStage) => void;
  workflowOptions: OptionType[];
  roleOptions: OptionType[];
}

export interface StagesFilterForm {
  workflow: string;
}

export interface WorkflowStageFormProps {
  readonly?: boolean;
}

export interface StagesSetupProps {
  editingStage: WorkflowStage | null;
  setEditingStage: (stage: WorkflowStage | null) => void;
  onStageUpdated: () => void;
  selectedWorkflow?: string;
  onWorkflowChange?: (workflow: string) => void;
}

export interface StagesTableProps {
  onEdit: (stage: WorkflowStage) => void;
  onRefresh?: number;
  onWorkflowChange?: (workflow: string) => void;
  selectedWorkflow?: string;
}

export interface WorkflowResponse {
  identity: string;
  workflowName: string;
  description: string;
}

export interface RoleResponse {
  identity: string;
  roleName: string;
}
