import * as yup from "yup";

export const industryCategorySchema = yup.object({
  industryCategoryName: yup
    .string()
    .required("Industry Category Name is required"),
  description: yup.string().optional().default(""),
});
