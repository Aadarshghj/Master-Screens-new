import type { ApprovalQueueFormData } from "@/types/approval-workflow/approval-queue.types";

export const approvalQueueFilterDefaultValue: ApprovalQueueFormData = {
  branchIdentity: "",
  moduleIdentity: "",
  subModuleIdentity: "",
  referenceNo: "",
  status: "",
  sort: "",
  workflowIdentity: "",
  page: 0,
  size: 10,
};
