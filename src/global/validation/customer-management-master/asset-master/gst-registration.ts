import * as yup from "yup";

export const gstRegistrationSchema = yup.object({
  gstRegType: yup
    .string()
    .required("GST Registration Type is required")
    .max(50, "Maximum 50 characters allowed"),

  description: yup
    .string()
    .max(150, "Maximum 150 characters allowed"),
    
  isActive: yup
    .boolean(),
  
  identity: yup
  .string(),
}); 