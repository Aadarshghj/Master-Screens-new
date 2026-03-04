import type { ApproverRoleMappingFormData } from "@/types/approval-workflow/approver-role-mapping.types";

export const approverRoleMappingDefaultFormValues: ApproverRoleMappingFormData =
  {
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
