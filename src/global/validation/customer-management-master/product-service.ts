import * as yup from "yup";

export const ProductServiceSchema = yup.object({
  productServiceName: yup.string().required("Product Name is required"),
  description: yup.string().optional().default(""),
});
