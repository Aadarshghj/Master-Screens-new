import * as yup from "yup";

export const documentMasterSchema = yup.object({
  documentCode: yup
    .string()
    .required("Document Code is required")
    .max(20, "Max 20 characters"),

  documentName: yup
    .string()
    .required("Document Name is required")
    .max(50, "Max 50 characters"),

  documentCategory: yup.string().required("Document Category is required"),

  identityProof: yup.boolean().required(),
  addressProof: yup.boolean().required(),
});
