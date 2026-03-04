import type { WorkflowDefinitionFormData } from "@/types/approval-workflow/workflow-definitions.types";
import * as yup from "yup";

export const workflowDefinitionValidationSchema: yup.ObjectSchema<WorkflowDefinitionFormData> =
  yup.object().shape({
    module: yup
      .string()
      .required("Module is required")
      .test("not-empty", "Module is required", value => value?.trim() !== ""),

    subModule: yup
      .string()
      .required("Sub Module is required")
      .test(
        "not-empty",
        "Sub Module is required",
        value => value?.trim() !== ""
      ),

    workflowName: yup
      .string()
      .required("Workflow name is required")
      .min(2, "Workflow name must be at least 2 characters")
      .max(200, "Workflow name must not exceed 200 characters"),

    description: yup
      .string()
      .max(1000, "Description must not exceed 1000 characters"),

    isActive: yup.boolean().default(true),
  });
