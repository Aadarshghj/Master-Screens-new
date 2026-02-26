export interface Lead {
  leadIdentity: string;
  leadCode: string;
  fullName: string;
  gender: string;
  contactNumber: string;
  email: string;
  interestedProduct: string;
  leadSource: string;
  leadStage: string;
  leadStatus: string;
  assignToUser?: string;
  assignedBy?: string;
}

export interface LeadSearchParams {
  page: number;
  size: number;
  leadDate?: string;
  leadProduct?: string;
  leadSource?: string;
  leadStage?: string;
  gender?: string;
  _key?: number;
}

export interface LeadSearchResponse {
  content: Lead[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}

export interface BulkAssignPayload {
  leadIdentitys: string[];
  assignToUserIdentity: string;
  assignmentDate: string;
}

export interface UpdateAssignmentPayload {
  assignToUserIdentity: string;
  assignmentDate: string;
  assignedByIdentity: string;
}

export interface AssignmentHistory {
  leadIdentity: string;
  leadCode: string;
  fullName: string;
  assignedTo: string;
  assignedBy: string;
  assignedOn: string;
  status: string;
  remarks: string;
}

export interface LeadFilterFormData {
  leadProduct: string;
  leadSource: string;
  leadStage: string;
  gender: string;
  leadDate: string;
}

export interface LeadAssignmentFormData {
  assignTo: string;
  assignmentDate: string;
}

export interface LeadAssignmentPayload {
  leadIdentitys: string[];
  assignToUserIdentity: string;
  assignmentDate: string;
}

export interface LeadAssignmentFormProps {
  readonly?: boolean;
}

export interface PaginationState {
  pageIndex: number;
  pageSize: number;
}

export interface LeadAssignmentTableProps {
  leads: Lead[];
  selectedLeads: string[];
  onSelectLead: (leadId: string, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
  isLoading?: boolean;
  staffOptions?: Array<{ value: string; label: string }>;
  onUpdateAssignment?: (
    leadIdentity: string,
    data: UpdateAssignmentPayload
  ) => void;
  pagination?: PaginationState;
  onPaginationChange?: (pagination: PaginationState) => void;
  totalCount?: number;
}
