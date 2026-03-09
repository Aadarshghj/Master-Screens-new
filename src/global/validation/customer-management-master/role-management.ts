import type { RoleManagementType } from "@/types/customer-management/role-management";
import * as yup from "yup";

export const roleManagementSchema: yup.ObjectSchema<RoleManagementType> =
  yup.object({
  
   roleName: yup
  .string()
  .required("Role Name is required")
  .max(50, "Maximum 50 characters allowed")
  .test("role-validation", "Invalid Role Name", function (value) {
    if (!value) return true;

    if (value.startsWith(" ")) {
      return this.createError({
        message: "First character cannot be a space",
      });
    }

    const invalidChar = /[^a-zA-Z0-9_/ ]/.test(value);

    if (invalidChar) {
      return this.createError({
        message: "Only letters, numbers and '/' are allowed",
      });
    }

    const hasLetter = /[a-zA-Z]/.test(value);

    if (!hasLetter) {
      return this.createError({
        message: "Role name cannot contain only numbers",
      });
    }

    return true;
  }),

roleShortDesc: yup
  .string()
  .required("Role Name is required")
  .default(null)
  .max(150, "Maximum 150 characters allowed")
  .test("desc-validation", "Invalid description", function (value) {
    if (!value) return true;

    const hasLetter = /[a-zA-Z]/.test(value);
    if (!hasLetter) {
      return this.createError({
        message: "Description must contain at least one letter",
      });
    }
    return true;
  }),
    isActive: yup.boolean().required(),
   
  });
