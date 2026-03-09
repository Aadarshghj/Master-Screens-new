import * as yup from "yup";

export const productReqSchema = yup.object({
  product: yup.string().required("Product is required"),
  status: yup.string().required("Status is required"),
});