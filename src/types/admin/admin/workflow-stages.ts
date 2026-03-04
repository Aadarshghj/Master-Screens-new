export interface Option {
  label: string;
  value: string;
}

export interface WorkflowStageForm {
  workflowIdentity: Option | null;
  levelOrder?: number;
  levelName: string;
  assignedRoleIdentity: Option | null;
  isFinalLevel: boolean;
}

export interface WorkflowStageRow {
  workflowStageIdentity: string;
  workflowIdentity: string;
  levelOrder: number;
  levelName: string;
  assignedRoleIdentity: string;
  isFinalLevel: boolean;
}

export interface StagesSetupTableProps {
  data: WorkflowStageRow[];
  pageIndex: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onEdit: (row: WorkflowStageRow) => void;
  onDelete: (id: string) => void;
}

export interface StagesSetupFilterBarProps {
  workflowOptions: { label: string; value: string }[];
  selectedWorkflow: string;
  onFilterApply: (value: string) => void;
}

export interface WorkflowStageRequestDto {
  workflowIdentity: string;
  levelOrder: number;
  levelName: string;
  assignedRoleIdentity: string;
  isFinalLevel: boolean;
}

export interface WorkflowStageResponseDto {
  workflowStageIdentity: string;
  workflowIdentity: string;
  levelOrder: number;
  levelName: string;
  assignedRoleIdentity: string;
  isFinalLevel: boolean;
}

export interface WorkflowStagesPageResponse {
  content: WorkflowStageResponseDto[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
}
