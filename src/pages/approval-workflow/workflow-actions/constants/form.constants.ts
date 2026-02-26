import type { WorkflowActionFormData } from "@/types/approval-workflow/workflow-actions.types";

export const workflowActionDefaultFormValues: WorkflowActionFormData = {
  workflow: "",
  linkedStage: "",
  actionName: "",
  nextLevel: "",
  terminalAction: false,
};
