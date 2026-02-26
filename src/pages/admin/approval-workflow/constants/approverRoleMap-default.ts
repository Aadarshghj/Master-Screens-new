import type {
  ApproverRoleMappingFilters,
  ApproverRoleMappingForm,
} from "@/types/admin/approverrolemap";

export const APPROVER_ROLE_MAPPING_DEFAULT_VALUES: ApproverRoleMappingForm = {
  id: "",
  roleCode: "",
  userCode: "",
  branchCode: "",
  regionCode: "",
  clusterCode: "",
  stateCode: "",

  effectiveFrom: "",
  effectiveTo: "",
  isActive: true,
};

export const APPROVER_ROLE_MAPPING_FILTERS_DEFAULT: ApproverRoleMappingFilters =
  {
    roleCode: "",
    userCode: "",
    branchCode: "",
    regionCode: "",
    clusterCode: "",
    stateCode: "",
  };
