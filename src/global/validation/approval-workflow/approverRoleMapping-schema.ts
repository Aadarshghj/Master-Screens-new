import type { ApproverRoleMappingFormData } from "@/types/approval-workflow/approver-role-mapping.types";
import * as yup from "yup";

export const approverRoleMappingValidationSchema: yup.ObjectSchema<ApproverRoleMappingFormData> =
  yup.object().shape({
    roleCode: yup
      .string()
      .required("Role code is required")
      .test(
        "not-empty",
        "Role code is required",
        value => value?.trim() !== ""
      ),

    userCode: yup
      .string()
      .required("User code is required")
      .test(
        "not-empty",
        "User code is required",
        value => value?.trim() !== ""
      ),

    branchCode: yup
      .string()
      .optional()
      .nullable()
      .transform(value => (value?.trim() === "" ? null : value)),

    regionCode: yup
      .string()
      .optional()
      .nullable()
      .transform(value => (value?.trim() === "" ? null : value)),

    clusterCode: yup
      .string()
      .optional()
      .nullable()
      .transform(value => (value?.trim() === "" ? null : value)),

    stateCode: yup
      .string()
      .optional()
      .nullable()
      .transform(value => (value?.trim() === "" ? null : value)),

    effectiveFrom: yup
      .string()
      .required("Effective from date is required")
      .matches(
        /^\d{4}-\d{2}-\d{2}$/,
        "Effective from must be in YYYY-MM-DD format"
      ),

    effectiveTo: yup
      .string()
      .optional()
      .nullable()
      .transform(value => (value?.trim() === "" ? null : value))
      .matches(
        /^\d{4}-\d{2}-\d{2}$/,
        "Effective to must be in YYYY-MM-DD format"
      )
      .test(
        "is-after-from",
        "Effective to date must be after effective from date",
        function (value) {
          const { effectiveFrom } = this.parent;
          if (!value || !effectiveFrom) return true;
          return new Date(value) > new Date(effectiveFrom);
        }
      ),

    isActive: yup.boolean().default(true),
  });
