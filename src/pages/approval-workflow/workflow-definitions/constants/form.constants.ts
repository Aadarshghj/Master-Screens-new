import type { WorkflowDefinitionFormData } from "@/types/approval-workflow/workflow-definitions.types";

export const workflowDefinitionDefaultFormValues: WorkflowDefinitionFormData = {
  module: "",
  subModule: "",
  workflowName: "",
  description: "",
  isActive: true,
};
