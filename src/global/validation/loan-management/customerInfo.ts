import * as yup from "yup";

const optionSchema = yup
  .object({
    label: yup.string().required(),
    value: yup.string().required(),
  })
  .nullable();

export const customerInformationSchema = yup.object({
  customerCode: yup.string().required("Customer code is required"),
  customerName: yup.string().required("Customer name is required"),
  contactNo: yup
    .string()
    .required("Contact number is required")
    .matches(/^[0-9]{10}$/, "Invalid contact number"),

  loanPurpose: optionSchema.nullable(),

  overallLoanExpense: yup
    .number()
    .required("Overall loan expense is required")
    .min(0),

  nomineeName: yup.string().required("Nominee name is required"),
  nomineeDob: yup.string().required("Nominee DOB is required"),
  nomineeRelation: optionSchema.nullable(),

  customerPhotoUrl: yup.string().nullable(),
});
