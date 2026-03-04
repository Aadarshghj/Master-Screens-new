import * as yup from "yup";

export const riskCategorySchema = yup.object({
  id: yup.string(),
  riskCategoryName: yup
    .string()
    .required("Risk Category Name is required")
    .max(50, "Maximum 50 characters allowed"),

  riskCategoryCode: yup
    .string()
    .required("Risk Category Code is required")
    .max(10, "Maximum 10 characters allowed"),
});
