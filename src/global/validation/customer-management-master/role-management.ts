import type { RoleManagementType } from "@/types/customer-management/role-management";
import * as yup from "yup";

export const roleManagementSchema: yup.ObjectSchema<RoleManagementType> =
  yup.object({
    identity: yup.string(),
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

        const hasNumber = /[0-9]/.test(value);
        const hasSpecial = /[^a-zA-Z ]/.test(value);

        if (hasNumber && hasSpecial) {
          return this.createError({ message: "Only characters allowed" });
        }
        if (hasNumber) {
          return this.createError({ message: "Numbers are not allowed" });
        }
        if (hasSpecial) {
          return this.createError({
            message: "Special characters are not allowed",
          });
        }
        return true;
      }),
    roleShortDesc: yup
      .string()
      .max(150, "Maximum 150 characters allowed")
      .nullable(),
    isActive: yup.boolean().required(),
  });
