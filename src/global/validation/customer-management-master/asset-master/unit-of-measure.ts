import * as yup from "yup";

export const unitOfMeasureSchema = yup.object({
  id: yup.string(),
  unitCode: yup.string(),
  description: yup.string(),
 
});
