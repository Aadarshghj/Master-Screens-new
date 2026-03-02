import * as yup from "yup";

export const assetgroupSchema = yup.object({
  id: yup.string(),
  assetCode: yup.string(),
  assetType: yup.string().required("This field is required"),
  assetName: yup.string().required("This field is required"),
  postingGL: yup.string().required("This field is required"),
  description: yup.string(),
  isActive: yup.boolean().required(),
});
