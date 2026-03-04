export interface LeadFollowupFilterFormData {
  leadName: string;
  assignee: string;
  followUpType: string;
  leadDateFrom: string;
  leadDateTo: string;
  leadStage: string;
}

export interface LeadFollowupHistoryFilterFormData {
  leadId: string;
  assignee: string;
  followUpType: string;
  leadDateFrom: string;
  leadDateTo: string;
  leadStage: string;
  nextFollowUpDate: string;
}

export interface LeadFollowupHistorySearchParams {
  leadIdentity?: string;
  staffId?: string;
  followUpTypeIdentity?: string;
  leadStageIdentity?: string;
  leadDateFrom?: string;
  leadDateTo?: string;
  page: number;
  size: number;
  _key: number;
}

export interface LeadFollowupData {
  leadIdentity: string;
  leadCode: string;
  leadFullName: string;
  gender: string;
  contactNumber: string;
  email: string;
  interestedProduct: string;
  leadSource: string;
  leadStage: string;
  leadStatus: string;
  assignToUser: string;
  staffId?: string;
  leadStageName?: string;
  followUpTypeName?: string;
  staffIdentity?: string;
  // Editable fields
  followUpDate: string;
  nextFollowUpDate?: string;
  followUpType?: string;
  followUpNotes?: string;
}

export interface LeadFollowupHistoryData {
  historyIdentity: string;
  leadIdentity?: number;
  leadCode: string;
  leadFullName: string;
  leadDate: string;
  staffCode: string;
  staffName: string;
  followUpDate: string;
  nextFollowUpDate: string;
  leadStageName: string;
  stageChangeRemarks: string;
  changeType: string;
  followUpNotes?: string;
  currentFollowupType: string | null;
  staffId?: string;
}

export interface SaveLeadFollowupPayload {
  leadIdentity: string;
  leadStageIdentity: string;
  // staffId: string;
  staffIdentity: string;
  followUpTypeIdentity: string;
  followUpDate: string;
  nextFollowUpDate: string;
  followUpNotes: string;
  changeType: string;
  stageChangeRemarks: string;
  [key: string]: unknown;
}

export type BulkSaveLeadFollowupPayload = SaveLeadFollowupPayload[];

export interface LeadFollowupHistoryResponse {
  histories: LeadFollowupHistoryData[];
  message: string;
  pageNumber: number;
  pageSize: number;
  // totalElements: number;
  // totalPages: number;
  last: boolean;
  currentPage?: number;
}

export interface ConfigOption {
  value: string;
  label: string;
  identity?: string;
}

export interface LeadFollowupFormProps {
  readonly?: boolean;
  isModal?: boolean;
  prefilledLeadId?: string;
}

export interface LeadFollowupHistoryResponse {
  history: LeadFollowupHistoryData[];
  message: string;
  totalPages?: number;
  totalElements?: number;
  currentPage?: number;
}

export interface LeadFollowupSearchRequest {
  leadName?: string;
  staffId?: string;
  followUpTypeIdentity?: string;
  leadStageIdentity?: string;
  leadDateFrom?: string;
  leadDateTo?: string;
  page: number;
  size: number;
  _key?: number;
}

export interface LeadFollowupResponseItem {
  historyIdentity: string;
  leadIdentity: number;
  leadCode: string;
  leadFullName: string;
  leadDate: string;
  staffCode: string;
  staffName: string;
  followUpDate: string | null;
  nextFollowUpDate: string | null;
  leadStageName: string;
  stageChangeRemarks: string;
  currentFollowupType: string | null;
  mobileno: string;
  staffId?: string;
  leadStageIdentity: string;
  followUpTypeIdentity: string | null;
  staffIdentity?: string;
  followupTypeIdentity: string;
}

export interface LeadFollowupSearchResponse {
  content: LeadFollowupResponseItem[];
  message: string;
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface UpdateLeadFollowupPayload {
  leadStageIdentity: string;
  followUpTypeIdentity: string;
  followUpDate: string;
  nextFollowUpDate: string;
  followUpNotes: string;
  [key: string]: unknown;
}

// export interface UpdateLeadFollowupResponse {
//   message: string;
// }

export interface LeadFollowupDetailsFormData {
  followUpDate: string;
  nextFollowUpDate: string;
  productService: string;
  leadStage: string;
  followUpType: string;
  followUpNotes: string;
}
