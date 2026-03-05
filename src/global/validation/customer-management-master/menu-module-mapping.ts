import * as yup from "yup";

export const menuModuleMappingSchema = yup.object({
  id: yup.string(),
  menuName: yup.string().required("Menu name is required"),
  moduleName: yup.string().required("Module is required"),
  isActive: yup.boolean(),
});
