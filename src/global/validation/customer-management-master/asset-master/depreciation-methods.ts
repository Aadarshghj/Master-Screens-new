import * as yup from "yup";

export const depreciationMethodsSchema = yup.object({
  id: yup.string(),
  depreciationType: yup.string().required("Depreciation Type is reqired"),
  calculationLogic: yup.string(),
  isActive:yup.boolean(),
 
});
