import * as yup from "yup";

export const customerCategorySchema = yup.object({
  categoryName: yup.string().required("Customer Category Name is required"),
  description: yup.string().nullable(),
});
