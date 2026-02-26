import * as yup from "yup";

export const ApprovalRoleMappingSchema = yup.object({
  id: yup.string(),
  roleCode: yup.string().required("Role Code is required"),
  userCode: yup.string().required("User Code is required"),
  branchCode: yup.string(),
  regionCode: yup.string(),
  clusterCode: yup.string(),
  stateCode: yup.string(),

  effectiveFrom: yup.string(),
  effectiveTo: yup.string(),
  isActive: yup.boolean(),
});
