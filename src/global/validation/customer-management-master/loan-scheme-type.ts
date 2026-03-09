import * as yup from "yup";

export const loanSchemeTypeSchema = yup.object({
  id: yup.string(),
  schemeTypeName: yup.string() .required("Scheme Type Name is required"),
  schemeTypeDescription: yup.string().required("Scheme Type Description is required"),
  isActive: yup.boolean(),
 
});
