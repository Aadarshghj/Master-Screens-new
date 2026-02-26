import type { WorkflowStageForm } from "@/types/admin/workflow-stages";

export const WORKFLOW_STAGE_FORM_DEFAULT_VALUES: WorkflowStageForm = {
  workflowIdentity: null,
  levelOrder: undefined,
  levelName: "",
  assignedRoleIdentity: null,
  isFinalLevel: false,
};
