export interface WorkflowActionBase {
  actionName: string;
}

export type WorkflowActionFormData = Omit<WorkflowActionBase, never> & {
  workflow: string;
  linkedStage: string;
  nextLevel?: string;
  terminalAction: boolean;
};

export type SaveWorkflowActionPayload = Omit<WorkflowActionBase, never> & {
  workflowIdentity: string;
  linkedStageIdentity: string;
  nextLevelStageIdentity: string;
  isTerminalAction: boolean;
  [key: string]: unknown;
  tenantIdentity?: string;
};

export type UpdateWorkflowActionPayload = SaveWorkflowActionPayload;

export interface WorkflowActionData {
  actionId: string;
  workflow: string;
  workflowName: string;
  linkedStage: string;
  linkedStageName: string;
  actionName: string;
  nextLevel: string;
  nextLevelStageName: string;
  terminalAction: boolean;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
  identity?: string;
  workflowIdentity?: string;
  linkedStageIdentity?: string;
  nextLevelIdentity?: string;
  [key: string]: unknown;
}

export interface WorkflowActionSearchForm {
  workflow: string;
  page: number;
  size: number;
}

export interface WorkflowActionSearchResponse {
  content: WorkflowActionData[];
  totalPages: number;
  totalElements: number;
  page: number;
  size: number;
}

export interface WorkflowActionApiResponse extends WorkflowActionBase {
  identity: string;
  workflowIdentity: string;
  linkedStageIdentity: string;
  linkedStageName: string;
  nextLevelIdentity: string;
  nextLevelStageName: string;
  terminalAction: boolean;
}

export interface PaginatedWorkflowActionResponse {
  content: WorkflowActionApiResponse[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: unknown[];
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  sort: unknown[];
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

export interface ConfigOption {
  value: string;
  label: string;
  identity?: string;
}

export interface WorkflowActionFormProps {
  readonly?: boolean;
  selectedWorkflow?: string;
  onWorkflowChange?: (workflow: string) => void;
}

export interface WorkflowActionState {
  isReady: boolean;
  isEditMode: boolean;
  currentActionId: string | null;
  currentActionData: WorkflowActionData | null;
}
