import * as yup from "yup";

export const workflowStageValidationSchema = yup.object().shape({
  workflow: yup
    .string()
    .required("Workflow is required")
    .test("not-empty", "Workflow is required", value => value !== ""),

  levelName: yup
    .string()
    .required("Level name is required")
    .min(3, "Level name must be at least 3 characters")
    .max(100, "Level name must not exceed 100 characters")
    .test(
      "not-only-numbers",
      "Level name cannot contain only numbers",
      value => {
        if (!value) return true;
        return !/^\d+$/.test(value.trim());
      }
    )
    .trim(),

  assignedToRole: yup
    .string()
    .required("Assigned to role is required")
    .test("not-empty", "Assigned to role is required", value => value !== ""),

  finalLevel: yup.boolean().default(false),
});

export type WorkflowStageValidationSchema = yup.InferType<
  typeof workflowStageValidationSchema
>;
