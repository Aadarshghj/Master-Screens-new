import * as yup from 'yup'

export const supplierEmpanelSchema =  yup.object({

  supplierName:yup
    .string()
    .max(20,"Maximum 20 characters allowed")
    .matches(/^[A-Za-z0-9_/ ]+$/,
    "Only alphanumeric characters are allowed"),
   
  tradename:yup
    .string()
    .max(30,"Maximum 30 characters allowed")
    .matches(/^[A-Za-z0-9_/ ]+$/,
    "Only alphanumeric characters are allowed"),

  panNumber:yup
    .string()
    .max(20,"Maximum 20 characters allowed")
    .matches(/^[A-Za-z0-9_/ ]+$/,
    "Only alphanumeric characters, underscore (_) and slash (/) are allowed"),

  gstNumber:yup
    .string()
    .max(20,"Maximum 20 characters allowed")
    .matches(/^[A-Za-z0-9_/ ]+$/,
    "Only alphanumeric characters, underscore (_) and slash (/) are allowed"),

  supplierNameSearch:yup
    .string()
    .max(30,"Maximum 30 characters allowed")
    .matches(/^[A-Za-z0-9_/ ]+$/,
    "Only alphanumeric characters are allowed"),

  amount: yup
    .string()
    .max(15, "Maximum 15 characters allowed")
    .matches(/^\d+(\.\d{1,2})?$/, "Enter a valid amount"),

  termsAndCondition:yup
    .string()
    .max(150,"Maximum 150 characters allowed"),
    
});
