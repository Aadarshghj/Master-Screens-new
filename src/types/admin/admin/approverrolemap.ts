export interface ApproverRoleMappingForm {
  id: string;
  roleCode: string;
  userCode: string;
  branchCode: string;
  regionCode: string;
  clusterCode: string;
  stateCode: string;

  effectiveFrom: string;
  effectiveTo: string;
  isActive: boolean;
}

export interface ApproverRoleMappingTableProps {
  data: ApproverRoleMappingForm[];
  onEdit: (row: ApproverRoleMappingForm) => void;
  onDelete: (id: string) => void;
}

export interface ApproverRoleMappingFilters {
  roleCode: string;
  userCode: string;
  branchCode: string;
  regionCode: string;
  clusterCode: string;
  stateCode: string;
}

export interface ApproverRoleMappingFilterBarProps {
  selectedFilters: ApproverRoleMappingFilters;
  onFilterApply: (filters: ApproverRoleMappingFilters) => void;
}
