import * as yup from "yup";

export const customerGroupSchema = yup.object({
  customerGroupName: yup
    .string()
    .required("Customer Group Name is required")
    .max(50),

  customerGroupCode: yup
    .string()
    .required("Customer Group Code is required")
    .max(10),
});
