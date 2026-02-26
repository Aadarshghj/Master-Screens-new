import type { ApproverRoleMappingForm } from "@/types/admin/approverrolemap";

export const APPROVER_ROLE_MAPPING_MOCK_DATA: ApproverRoleMappingForm[] = [
  {
    id: "1",
    roleCode: "RM",
    userCode: "USR001",
    branchCode: "BR001",
    regionCode: "REL01",
    clusterCode: "CL01",
    stateCode: "ACTIVE",

    effectiveFrom: "2024-01-01",
    effectiveTo: "2025-12-31",
    isActive: true,
  },
];
