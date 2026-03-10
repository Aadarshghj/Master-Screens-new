import * as yup from "yup";

export const chargesMasterSchema = yup.object({
  chargeName: yup
    .string()
    .required("Charge name is required")
    .max(50, "Maximum 50 characters allowed"),
    
  gl: yup
    .string()
    .required("GL is required")
    .max(20, "Maximum 20 characters allowed"),
    
  isActive: yup
    .boolean(),
  
  identity: yup
  .string(),
}); 