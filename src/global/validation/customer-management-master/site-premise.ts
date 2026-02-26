import * as yup from "yup";

export const SitePremiseSchema = yup.object({
  premiseTypeName: yup
    .string()
    .required("Premise Type is required")
    .max(20, "Maximum 20 characters"),

  description: yup.string().optional().default(""),
});
