import * as yup from "yup";

export const assignAttributeValidationSchema = yup.object().shape({
  loanProductName: yup
    .string()
    .required("Loan product is required")
    .min(2, "Loan product name must be at least 2 characters")
    .max(100, "Loan product name cannot exceed 100 characters"),
  loanSchemeName: yup
    .string()
    .required("Loan scheme is required")
    .min(2, "Loan scheme name must be at least 2 characters")
    .max(100, "Loan scheme name cannot exceed 100 characters"),
});

// Validation for individual attribute values
export const attributeValueValidation = yup.object().shape({
  attributeValue: yup.string().when("status", {
    is: true,
    then: schema =>
      schema
        .required("Attribute value is required when status is active")
        .matches(/^[0-9]+(\.[0-9]+)?$/, "Only numeric values are allowed")
        .test("positive", "Value must be positive", value => {
          return value ? parseFloat(value) > 0 : false;
        })
        .test("max-decimal", "Maximum 2 decimal places allowed", value => {
          if (!value) return true;
          const decimalPart = value.split(".")[1];
          return !decimalPart || decimalPart.length <= 2;
        }),
    otherwise: schema => schema.nullable(),
  }),
  status: yup.boolean().required("Status is required"),
});

interface AttributeData {
  attributeName: string;
  attributeValue: string;
  status: boolean;
}

// Validation for the entire table data
export const validateTableData = (tableData: AttributeData[]) => {
  const errors: string[] = [];

  // Check if at least one attribute is active
  const activeAttributes = tableData.filter(attr => attr.status);
  if (activeAttributes.length === 0) {
    errors.push("At least one attribute must be active");
  }

  // Validate only numeric attributes
  activeAttributes.forEach(attr => {
    if (attr.attributeValue && attr.attributeValue.trim() !== "") {
      // Only validate if it's a numeric value
      const isNumericAttribute = /^[0-9]+(\.[0-9]+)?$/.test(
        attr.attributeValue
      );

      if (isNumericAttribute) {
        const numValue = parseFloat(attr.attributeValue);
        if (numValue <= 0) {
          errors.push(`${attr.attributeName} must be greater than 0`);
        }
        if (numValue > 999999999) {
          errors.push(`${attr.attributeName} cannot exceed 999,999,999`);
        }
      }
    }
  });

  return errors;
};
