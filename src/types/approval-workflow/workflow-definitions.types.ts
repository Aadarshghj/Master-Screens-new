export interface WorkflowDefinitionBase {
  workflowName: string;
  description?: string;
}

export type WorkflowDefinitionFormData = Omit<WorkflowDefinitionBase, never> & {
  module: string;
  subModule: string;
  isActive: boolean;
};

export type SaveWorkflowDefinitionPayload = Omit<
  WorkflowDefinitionBase,
  never
> & {
  moduleIdentity: string;
  subModuleIdentity: string;
  active: boolean;
  [key: string]: unknown;
};

export type UpdateWorkflowDefinitionPayload = SaveWorkflowDefinitionPayload;

export interface WorkflowDefinitionData {
  definitionId: string;
  module: string;
  moduleName: string;
  subModule: string;
  subModuleName: string;
  workflowName: string;
  description: string;
  isActive: boolean;
  status: string;
  statusName: string;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
  identity?: string;
  moduleIdentity?: string;
  subModuleIdentity?: string;
  active?: boolean;
  [key: string]: unknown;
}

export interface WorkflowDefinitionSearchForm {
  module: string;
  subModule: string;
  workflowName: string;
  page: number;
  size: number;
}

export interface WorkflowDefinitionSearchResponse {
  content: WorkflowDefinitionData[];
  totalPages: number;
  totalElements: number;
  page: number;
  size: number;
}

export interface WorkflowDefinitionApiResponse extends WorkflowDefinitionBase {
  identity: string;
  moduleIdentity: string;
  subModuleIdentity: string;
  active: boolean;
  moduleName: string;
  subModuleName: string;
}

export interface PaginatedWorkflowDefinitionResponse {
  content: WorkflowDefinitionApiResponse[];
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

export interface WorkflowDefinitionFormProps {
  readonly?: boolean;
  selectedModule?: string;
  selectedSubModule?: string;
  onModuleChange?: (module: string) => void;
  onSubModuleChange?: (subModule: string) => void;
}

export interface WorkflowDefinitionState {
  isReady: boolean;
  isEditMode: boolean;
  currentDefinitionId: string | null;
  currentDefinitionData: WorkflowDefinitionData | null;
}

export interface ModuleConfigOption extends ConfigOption {
  subModules: Array<{
    identity: string;
    subModuleName: string;
    subModuleCode: string;
    isActive: boolean;
  }>;
}

export interface WorkflowDefinitionsFilterProps {
  selectedModule?: string;
  selectedSubModule?: string;
  onModuleChange?: (module: string) => void;
  onSubModuleChange?: (subModule: string) => void;
}
