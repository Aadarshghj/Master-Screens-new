import * as yup from "yup";

export const assignPropertyValidationSchema = yup.object({
  loanSchemeName: yup.string().required("Loan scheme is required"),
});

export const propertyValueValidationSchema = yup.object({
  loanScheme: yup.string().required("Loan scheme is required"),
  propertyKey: yup.string().required("Property key is required"),
  defaultValue: yup
    .number()
    .required("Default value is required")
    .min(0, "Default value must be positive"),
  propertyValue: yup
    .string()
    .required("Property value is required")
    .test(
      "is-valid-number",
      "Property value must be a valid number",
      function (value) {
        if (!value) return false;
        const numValue = parseFloat(value);
        return !isNaN(numValue) && numValue >= 0;
      }
    ),
  glAccountId: yup
    .string()
    .required("GL Account is required")
    .min(1, "Please select a GL Account"),
  glAccountName: yup.string().required("GL Account name is required"),
  status: yup.boolean().required("Status is required"),
});

export const bulkPropertyValidationSchema = yup.object({
  properties: yup
    .array()
    .of(propertyValueValidationSchema)
    .min(1, "At least one property must be configured")
    .test(
      "unique-properties",
      "Property keys must be unique",
      function (properties) {
        if (!properties) return true;
        const keys = properties.map(p => p.propertyKey);
        return keys.length === new Set(keys).size;
      }
    ),
});

export type AssignPropertyFormValidation = yup.InferType<
  typeof assignPropertyValidationSchema
>;
