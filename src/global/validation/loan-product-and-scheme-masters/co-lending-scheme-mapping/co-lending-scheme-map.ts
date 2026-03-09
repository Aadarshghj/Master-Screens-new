import * as yup from "yup";

export const coLenderSChemeMapSchema = yup.object({
  productcode: yup
    .string() .required("Asset Type is required")
    ,
  schemecode: yup
    .string().required("Asset Type is required"),

  bankcode: yup
    .string() .required("Asset Type is required"),

  bankname: yup
    .string()
})