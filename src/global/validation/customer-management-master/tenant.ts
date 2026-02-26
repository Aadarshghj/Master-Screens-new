import * as yup from "yup";

export const tenantSchema = yup.object({
  id: yup.string(),

  tenantName: yup
    .string()
    .required("Tenant Name is required")
    .min(3, "Tenant Name must be at least 3 characters")
    .max(20, "Maximum 20 characters")
    .matches(
      /^[A-Za-z0-9 ]+$/,
      "Tenant Name must contain only letters and numbers. No special characters."
    )
    .test(
      "not-only-spaces",
      "Tenant Name cannot contain only spaces",
      value => !!value && value.trim().length > 0
    )
    .test(
      "no-leading-space",
      "Tenant Name should not start with a space",
      value => {
        if (!value) return true;
        return !value.startsWith(" ");
      }
    )
    .test(
      "no-multiple-spaces",
      "Tenant Name cannot contain multiple continuous spaces",
      value => {
        if (!value) return true;
        return !/\s{2,}/.test(value);
      }
    )
    .test(
      "not-only-numbers",
      "Tenant Name cannot contain only numbers",
      value => {
        if (!value) return true;
        return !/^\d+$/.test(value);
      }
    )
    .test(
      "no-triple-duplicate-words",
      "Tenant Name should not contain the same word more than 2 times",
      value => {
        if (!value) return true;

        const words = value.toLowerCase().split(" ");
        const wordCount: Record<string, number> = {};

        for (const word of words) {
          wordCount[word] = (wordCount[word] || 0) + 1;
          if (wordCount[word] >= 3) {
            return false;
          }
        }

        return true;
      }
    )
    .test(
      "no-repeated-letters",
      "Tenant Name contains too many repeated letters",
      value => {
        if (!value) return true;
        return !/(.)\1{3,}/.test(value);
      }
    )
    .test(
      "unique-tenant-name",
      "Tenant Name already exists",
      async function (value) {
        if (!value) return true;

        return true;
      }
    ),

  tenantCode: yup
    .string()
    .transform(value => (value ? value.replace(/[^A-Za-z0-9_]/g, "") : value))
    .required("Tenant Code is required")
    .min(3, "Tenant Name must be at least 3 characters")
    .max(20, "Maximum 20 characters")
    .matches(
      /^[A-Za-z0-9_]+$/,
      "Tenant Code must contain only letters, numbers, and underscore (_). No spaces."
    )
    .test(
      "code-not-only-numbers",
      "Tenant Code cannot contain only numbers",
      value => (value ? !/^\d+$/.test(value) : true)
    )
    .test(
      "code-not-only-letters",
      "Tenant Code cannot contain only letters",
      value => (value ? !/^[A-Za-z]+$/.test(value) : true)
    )
    .test(
      "no-double-underscore",
      "Tenant Code cannot contain consecutive underscores",
      value => (value ? !/__/.test(value) : true)
    ),

  isActive: yup.boolean().required(),
});
