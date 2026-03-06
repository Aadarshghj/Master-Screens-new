import * as yup from "yup";

export const gstCostMasterSchema = yup.object({
  id: yup.string(),
  gstBreakup: yup.string().required("GST Breakup is reqired"),
  gl: yup.string().required("GL is reqired"),
  description: yup.string(),
  isActive:yup.boolean(),
 
});
