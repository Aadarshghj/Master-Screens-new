import * as yup from "yup";

export const workflowStageSchema = yup.object({
  workflowIdentity: yup.mixed().nullable().required("Workflow is required"),
  levelOrder: yup
    .number()
    .typeError("Level Order must be a number")
    .required("Level Order is required")
    .min(1, "Level Order must be at least 1"),
  levelName: yup
    .string()
    .required("Level Name is required")
    .matches(/^[A-Za-z0-9\s]+$/, "Only letters and numbers allowed"),
  assignedRoleIdentity: yup.mixed().nullable(),
  isFinalLevel: yup.boolean(),
});
