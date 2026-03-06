import * as yup from "yup";

export const SupplierRiskSchema = yup.object({
  riskcategorytype: yup
    .string()
    .transform(value => value?.trim())
    .required("Supplier Risk Type is required")
    .min(3, "Minimum 3 characters required")
    .max(50, "Maximum 50 characters allowed")
    .matches(
      /^[A-Z0-9/_ ]+$/,
      "Only uppercase letters, numbers, slash(/), underscore(_) allowed"
    )
    .test(
      "not-only-numbers",
      "Only numbers are not allowed",
      value => !!value && !/^[0-9]+$/.test(value)
    )
    .matches(/^(?!.*__)/, "Consecutive underscores are not allowed")
    .matches(/^(?!_)/, "Cannot start with underscore")
    .matches(/^(?!.*_$)/, "Cannot end with underscore")
    .matches(/^(?!.*\s{2,})/, "Multiple consecutive spaces are not allowed"),

  description: yup
    .string()
    .transform(value => value?.trim())
    .nullable()
    .notRequired()
    .max(150, "Maximum 150 characters allowed")
    .test(
      "no-only-spaces",
      "Description cannot contain only spaces",
      value => !value || value.trim().length > 0
    )
    .matches(/^[A-Za-z0-9 ]*$/, "Only letters, numbers and spaces allowed")
    .matches(/^(?!.*\s{2,})/, "Multiple consecutive spaces are not allowed"),

  status: yup.boolean().required("Status is required"),
});
