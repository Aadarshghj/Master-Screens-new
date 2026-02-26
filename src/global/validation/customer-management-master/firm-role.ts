import * as yup from "yup";

export const FirmRoleSchema = yup.object({
  roleName: yup
    .string()
    .required("Firm Role Name is required")
    .max(50, "Maximum 50 characters"),
  description: yup
    .string()
    .max(200, "Maximum 200 characters allowed")
    .nullable(),
});
