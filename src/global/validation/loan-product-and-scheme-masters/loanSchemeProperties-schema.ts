import type { LoanSchemePropertyFormData } from "@/types/loan-product-and-scheme-masters/loan-scheme-properties.types";
import * as yup from "yup";

const propertyKeyRegex = /^[a-z_][a-z0-9_]*$/;

export const loanSchemePropertyValidationSchema: yup.ObjectSchema<LoanSchemePropertyFormData> =
  yup.object().shape({
    loanProduct: yup
      .string()
      .required("Loan product is required")
      .test(
        "not-empty",
        "Loan product is required",
        value => value?.trim() !== ""
      ),
    propertyKey: yup
      .string()
      .required("Property key is required")
      .matches(
        propertyKeyRegex,
        "Property key must start with a lowercase letter or underscore and contain only lowercase letters, numbers, and underscores"
      )
      .min(2, "Property key must be at least 2 characters")
      .max(50, "Property key must not exceed 50 characters"),
    propertyName: yup
      .string()
      .required("Property name is required")
      .min(2, "Property name must be at least 2 characters")
      .max(100, "Property name must not exceed 100 characters"),
    dataType: yup
      .string()
      .required("Data type is required")
      .test(
        "not-empty",
        "Data type is required",
        value => value?.trim() !== ""
      ),

    defaultValue: yup
      .string()
      .default("")
      .max(255, "Default value must not exceed 255 characters")
      .test(
        "valid-type",
        "Invalid default value for selected data type",
        function (value) {
          if (!value || value.trim() === "") return true;

          const dataTypeName = this.options.context?.dataTypeName || "";

          switch (dataTypeName?.toUpperCase()) {
            case "INTEGER":
              return (
                /^-?\d+$/.test(value) ||
                this.createError({
                  message: "Default value must be a valid integer",
                })
              );

            case "NUMBER":
            case "DECIMAL":
              return (
                /^-?\d*\.?\d+$/.test(value) ||
                this.createError({
                  message: "Default value must be a valid number",
                })
              );
            case "BOOLEAN":
              return (
                ["true", "false"].includes(value.toLowerCase()) ||
                this.createError({
                  message: "Default value must be true or false",
                })
              );
            case "DATE":
              return (
                !isNaN(Date.parse(value)) ||
                this.createError({
                  message: "Default value must be a valid date",
                })
              );
            default:
              return true;
          }
        }
      ),
    description: yup
      .string()
      .default("")
      .max(500, "Description must not exceed 500 characters"),
    isRequired: yup.boolean().default(false),
    isActive: yup.boolean().default(true),
  });
