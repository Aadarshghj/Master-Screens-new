import type { GLAccountTypeFormData } from "@/types/loan-product-and-scheme-masters/gl-account-types.types";
import * as yup from "yup";

export const glAccountTypeValidationSchema: yup.ObjectSchema<GLAccountTypeFormData> =
  yup.object().shape({
    glCategory: yup
      .string()
      .required("GL category is required")
      .test(
        "not-empty",
        "GL category is required",
        value => value?.trim() !== ""
      ),
    glAccountType: yup
      .string()
      .required("GL account type is required")
      .test(
        "not-empty",
        "GL account type is required",
        value => value?.trim() !== ""
      ),
    glAccountId: yup
      .string()
      .required("GL account ID is required")
      .test(
        "not-empty",
        "GL account ID is required",
        value => value?.trim() !== ""
      ),
    isActive: yup.boolean().default(true),
  });
