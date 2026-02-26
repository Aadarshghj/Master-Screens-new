import * as yup from "yup";

export const branchContactSchema = yup.object({
  value: yup.string().required("Branch Contact Type is required"),
  remarks: yup.string().nullable(),
  isPrimary: yup.boolean(),
  branch: yup.string().required("Branch is required"),
  channel: yup.string().required("Channel is required"),
});
