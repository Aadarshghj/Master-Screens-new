import * as yup from "yup";

export const designationSchema = yup.object({
  id: yup.string(),
  designationCode: yup
    .string()
    .required("Designation Code is required")
    .max(20, "Max 20 characters"),

  designationName: yup.string().required("Designation Name is required"),

  level: yup
    .number()
    .typeError("Level must be a number")
    .required("Level is required")
    .integer("Level must be an integer")
    .min(1, "Level must be at least 1"),
  occupation: yup.string().required("Occupation is required"),

  description: yup.string(),

  managerial: yup.boolean().required(),
});
