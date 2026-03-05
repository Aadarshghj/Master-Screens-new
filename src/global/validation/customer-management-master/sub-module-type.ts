import * as yup from "yup";

export const subModuleTypeSchema = yup.object({
  id: yup.string().default(""),
  module: yup.string().required("Module is required"),

  subModuleCode: yup
    .string()
    .trim()
    .required("Sub-Module Code is required")
    .max(50, "Maximum 50 characters allowed"),

  subModuleName: yup
    .string()
    .trim()
    .required("Sub Module Name is required")
    .max(100, "Maximum 100 characters allowed"),

  subModuleDescription: yup
    .string()
    .trim()
    .required("Sub Module Description is required")
    .max(200, "Maximum 200 characters allowed"),

  isActive: yup.boolean().required("Status is required").default(true),
});
