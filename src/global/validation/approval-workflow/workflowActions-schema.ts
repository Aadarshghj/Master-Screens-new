import type { WorkflowActionFormData } from "@/types/approval-workflow/workflow-actions.types";
import * as yup from "yup";

export const workflowActionValidationSchema: yup.ObjectSchema<WorkflowActionFormData> =
  yup.object().shape({
    workflow: yup
      .string()
      .required("Workflow is required")
      .test("not-empty", "Workflow is required", value => value?.trim() !== ""),

    linkedStage: yup
      .string()
      .required("Linked stage is required")
      .test(
        "not-empty",
        "Linked stage is required",
        value => value?.trim() !== ""
      ),

    actionName: yup
      .string()
      .required("Action name is required")
      .min(2, "Action name must be at least 2 characters")
      .max(200, "Action name must not exceed 200 characters"),

    nextLevel: yup.string(),

    terminalAction: yup.boolean().default(false),
  });
