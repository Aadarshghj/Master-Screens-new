import * as yup from "yup";

export const staffSchema = yup.object({
  staffName: yup.string().required("Staff Name is required"),
  staffCode: yup.string().required("Staff Code is required"),
  reportingToIdentity: yup.string().required("Reporting To is required"),
  contactAddress: yup.string().required("Contact Address is required"),
  contactPhone: yup
    .string()
    .required("Contact Phone is required")
    .matches(/^[0-9]{10}$/, "Enter valid phone number"),
  email: yup.string().email("Invalid email").required("Email is required"),
  isAppUser: yup.boolean(),
  appUserRefId: yup.string().when("isAppUser", {
    is: true,
    then: schema => schema.required("App User Reference ID is required"),
    otherwise: schema => schema.notRequired(),
  }),
});
