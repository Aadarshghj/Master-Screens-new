import * as yup from "yup";

export const purposeSchema = yup.object({
  id: yup.string(),
  purposeType: yup.string().required("Purpose Type is required"),
  purposeCode: yup.string().required("Purpose Code is required"),
});
