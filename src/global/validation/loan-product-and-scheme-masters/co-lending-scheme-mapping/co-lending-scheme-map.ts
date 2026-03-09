import * as yup from "yup";

export const coLenderSChemeMapSchema = yup.object({
  productcode: yup
    .string() .required("Product Code is required")
    ,
  schemecode: yup
    .string().required("Scheme Code is required"),

  bankcode: yup
    .string() .required("Bank Code is required"),

  bankname: yup
    .string()
})