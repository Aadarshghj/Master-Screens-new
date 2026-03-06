import * as yup from "yup";

export const addressTypeSchema = yup.object({
  identity: yup.string(),

  addressType: yup.string().required("Address Type is required"),

  context: yup.string().required("Context is required"),

  isMandatory: yup.boolean().required(),

  isActive: yup.boolean().required(),
});