import * as yup from "yup";

export const leadSourceSchema = yup.object({
  id: yup.string(),
  leadSourceName: yup.string().required("Lead Source Name is required"),
  description: yup.string().nullable(),
});
