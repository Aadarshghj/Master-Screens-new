import * as yup from "yup"

export const supplierSearchSchema = yup.object({

  supplierName: yup
    .string()
    .transform(v => v === "" ? undefined : v)
    .max(20, "Maximum 20 characters allowed")
    .matches(/^[A-Za-z0-9_/ ]+$/, "Only alphanumeric characters are allowed")
    .notRequired(),

  tradeName: yup
    .string()
    .transform(v => v === "" ? undefined : v)
    .max(30, "Maximum 30 characters allowed")
    .matches(/^[A-Za-z0-9_/ ]+$/, "Only alphanumeric characters are allowed")
    .notRequired(),

  panNumber: yup
    .string()
    .transform(v => v === "" ? undefined : v)
    .max(20, "Maximum 20 characters allowed")
    .matches(/^[A-Za-z0-9_/ ]+$/, "Only alphanumeric characters allowed")
    .notRequired(),

  gstNumber: yup
    .string()
    .transform(v => v === "" ? undefined : v)
    .max(20, "Maximum 20 characters allowed")
    .matches(/^[A-Za-z0-9_/ ]+$/, "Only alphanumeric characters allowed")
    .notRequired()

})


export const supplierEmpanelSchema = yup.object({
 empanelmentDate: yup.string().optional(),

    empanelmentBy: yup.string().optional(),

    description: yup.string().optional(),

    validuptoDate: yup.string().optional(),
     registrationNumber: yup.string().optional(),

    email: yup.string().optional(),

    contact: yup.string().optional(),

    empanelmentType: yup.string().optional(),
    document: yup.mixed().nullable(),

    empanelItems: yup.array().optional(),
  supplierNameSearch: yup
    .string()
    .required("Supplier name is required")
    .max(30, "Maximum 30 characters allowed")
    .matches(/^[A-Za-z0-9_/ ]+$/, "Only alphanumeric characters are allowed"),

  amount: yup
    .string()
    .max(15, "Maximum 15 characters allowed")
    .matches(/^\d+(\.\d{1,2})?$/, "Enter a valid amount"),

  termsAndConditions: yup
    .string()
    .max(150, "Maximum 150 characters allowed")

})