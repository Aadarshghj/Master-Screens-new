import * as yup from "yup";

export const subModuleTypeSchema = yup.object({
  module: yup.string().required("Module is required"),
  subModuleCode: yup
    .string()
    .required("Sub-Module Code is required")
    .max(50, "Maximum 50 characters allowed"),

  description: yup
    .string()
    .max(200, "Maximum 200 characters allowed")
    .nullable(),
});
