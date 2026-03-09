import * as yup from "yup";

export const supplierInformationSchema = yup.object({
  id: yup.string(),

  supplierName: yup
    .string()
    .required("Supplier Name is required"),

  tradeName: yup
    .string(),

  supplierRiskCategory: yup
    .string()
    .required("Supplier Risk Category is required"),

  panNumber: yup
    .string()
    .required("PAN Number is required")
    .matches(
      /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
      "Invalid PAN Number format"
    ),

  gstRegistrationType: yup
    .string()
    .required("GST Registration Type is required"),

  gstin: yup
    .string()
    .matches(
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
      "Invalid GSTIN format"
    )
    .nullable(),

  msmeRegistrationNo: yup
    .string(),

  msmeType: yup
    .string(),

  cinOrLlpin: yup
    .string(),

  incorporationDate: yup
    .string()
    .required("Incorporation Date is required"),

  contactPersonName: yup
    .string()
    .required("Contact Person Name is required"),

  designation: yup
    .string(),

  isActive: yup
    .boolean(),
});