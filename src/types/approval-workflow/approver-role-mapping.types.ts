export interface ApproverRoleMappingBase {
  roleCode: string;
  userCode: string;
  branchCode?: string | null;
  regionCode?: string | null;
  clusterCode?: string | null;
  stateCode?: string | null;
  effectiveFrom: string;
  effectiveTo?: string | null;
}

export type ApproverRoleMappingFormData = Omit<
  ApproverRoleMappingBase,
  never
> & {
  isActive: boolean;
};
export type SaveApproverRoleMappingPayload = {
  roleIdentity: string;
  userIdentity: string;
  branchIdentity?: string | null;
  regionIdentity?: string | null;
  clusterIdentity?: string | null;
  stateIdentity?: string | null;
  effectiveFrom: string;
  effectiveTo?: string | null;
  isActive: boolean;
};

export type UpdateApproverRoleMappingPayload = SaveApproverRoleMappingPayload;

export interface ApproverRoleMappingData {
  mappingId: string;
  roleCode: string;
  userCode: string;
  branchCode?: string | null;
  regionCode?: string | null;
  clusterCode?: string | null;
  stateCode?: string | null;
  effectiveFrom: string;
  effectiveTo?: string | null;
  active: boolean;
  isActive: boolean;
  status: string;
  statusName: string;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
  identity?: string;
  [key: string]: unknown;
}

export interface ApproverRoleMappingSearchForm {
  roleCode: string;
  userCode: string;
  branchCode: string;
  regionCode: string;
  clusterCode: string;
  stateCode: string;
  page: number;
  size: number;
}

export interface ApproverRoleMappingSearchResponse {
  content: ApproverRoleMappingData[];
  totalPages: number;
  totalElements: number;
  page: number;
  size: number;
}

export interface ApproverRoleMappingApiResponse
  extends ApproverRoleMappingBase {
  identity: string;
  active: boolean;
}

export interface PaginatedApproverRoleMappingResponse {
  content: ApproverRoleMappingApiResponse[];
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

export interface SelectedOption {
  identity: string;
  code: string;
  name: string;
}

export interface StateOption {
  identity: string;
  stateId: string;
  state: string;
}

export interface BranchOption {
  identity: string;
  branchCode: string;
  branchName: string;
}
export interface RoleOption {
  identity: string;
  roleCode: string;
  roleName: string;
}
export interface UserOption {
  identity: string;
  userCode: string;
  userName: string;
}
export interface RegionOption {
  identity: string;
  regionCode: string;
  regionName: string;
}
export interface ClusterOption {
  identity: string;
  clusterCode: string;
  clusterName: string;
}

export interface ApproverRoleMappingFormProps {
  readonly?: boolean;
}

export interface ApproverRoleMappingState {
  isReady: boolean;
  isEditMode: boolean;
  currentMappingId: string | null;
}

// ADD THIS NEW INTERFACE:
export interface ApproverRoleMappingByIdResponse {
  identity: string;
  roleIdentity: string;
  roleCode: string;
  userIdentity: string;
  userCode: string;
  branchIdentity?: string | null;
  branchCode?: string | null;
  regionIdentity?: string | null;
  regionCode?: string | null;
  clusterIdentity?: string | null;
  clusterCode?: string | null;
  stateIdentity?: string | null;
  stateCode?: string | null;
  effectiveFrom: string;
  effectiveTo?: string | null;
  active: boolean;
}
