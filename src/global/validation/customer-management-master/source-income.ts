import * as yup from "yup";

export const sourceOfIncomeSchema = yup.object({
  name: yup.string().required("Source of Income Name is required"),
  code: yup.string().required("Source of Income Code is required"),
});
