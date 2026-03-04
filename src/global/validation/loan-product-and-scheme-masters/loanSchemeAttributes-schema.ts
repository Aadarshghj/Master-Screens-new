import type { LoanSchemeAttributeFormData } from "@/types/loan-product-and-scheme-masters/loan-scheme-attributes.types";
import * as yup from "yup";

export const loanSchemeAttributeValidationSchema: yup.ObjectSchema<LoanSchemeAttributeFormData> =
  yup.object().shape({
    loanProduct: yup
      .string()
      .required("Loan product is required")
      .test(
        "not-empty",
        "Loan product is required",
        value => value?.trim() !== ""
      ),

    attributeKey: yup
      .string()
      .required("Attribute key is required")
      .matches(
        /^[a-z_]+$/,
        "Attribute Key must follow the naming rule: lowercase letters with underscores only, no spaces, no special characters except underscore."
      )
      .min(2, "Attribute key must be at least 2 characters")
      .max(50, "Attribute key must not exceed 50 characters"),

    attributeName: yup
      .string()
      .required("Attribute name is required")
      .matches(
        /^[A-Za-z0-9 ]+$/,
        "Attribute name must contain only letters, numbers, and spaces"
      )
      .min(2, "Attribute name must be at least 2 characters")
      .max(100, "Attribute name must not exceed 100 characters"),

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
      .required("Default value is required")
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
      )
      .test(
        "in-list-values",
        "Default value must be one of the List Values",
        function (value) {
          const listValues = this.parent.listValues;
          if (!listValues || listValues.trim() === "") return true;
          if (!value || value.trim() === "") return true;

          const listArray = listValues.split(",").map((v: string) => v.trim());
          return (
            listArray.includes(value.trim()) ||
            this.createError({
              message: `Default value must be one of the List Values: ${listArray.join(", ")}`,
            })
          );
        }
      ),
    listValues: yup
      .string()
      .default("")
      .max(500, "List values must not exceed 500 characters")
      .test(
        "no-spaces",
        "Spaces are not allowed. Separate each word with a comma (,)",
        function (value) {
          if (!value || value.trim() === "") return true;
          return !/\s/.test(value);
        }
      )
      .test(
        "comma-separated",
        "Separate each word with a comma (,)",
        function (value) {
          if (!value || value.trim() === "") return true;
          if (!value.includes(",")) {
            const hasLetters = /[a-zA-Z]/.test(value);
            if (hasLetters && value.length > 1) {
              return false;
            }
          }
          return true;
        }
      ),
    description: yup
      .string()
      .default("")
      .max(500, "Description must not exceed 500 characters"),
    isRequired: yup.boolean().default(false),
    isActive: yup.boolean().default(true),
    takeoverBtiScheme: yup.boolean().default(false),
  });
