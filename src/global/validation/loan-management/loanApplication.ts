import * as yup from "yup";
// import { collateralSchema } from "./collateral";

const optionSchema = yup
  .object({
    label: yup.string().required(),
    value: yup.string().required(),
  })
  .nullable()
  .required("This field is required");

export const applicationInformationSchema = yup.object({
  applicationDate: yup.string().required("Application date is required"),

  applicationBranch: optionSchema,

  lendingRate: yup
    .number()
    .typeError("Lending rate must be a number")
    .min(0, "Lending rate cannot be negative")
    .required("Lending rate is required"),

  collateralType: optionSchema,

  applicationNumber: yup.string().required("Application number is required"),

  customerCode: yup.string().required("Customer code is required"),

  customerName: yup.string().required("Customer name is required"),

  contactNo: yup.string().required("Contact number is required"),

  loanPurpose: optionSchema.nullable(),

  overallLoanExpense: yup
    .number()
    .typeError("Overall loan expense must be a number")
    .min(0)
    .required("Overall loan expense is required"),

  nomineeName: yup.string().required("Nominee name is required"),

  nomineeDob: yup.string().required("Nominee DOB is required"),

  nomineeRelation: optionSchema.nullable(),

  customerPhotoUrl: yup.string().nullable(),

  canvassedType: yup.string().required("Canvassed type is required"),

  canvasserId: yup.string().required("Canvasser ID is required"),

  inventoryNumber: yup
    .number()
    .typeError("Inventory number must be a number")
    .positive("Inventory number must be greater than 0")
    .required("Inventory number is required"),

  totalGoldWeight: yup.string().required("Total gold weight is required"),

  eligibleAmount: yup
    .number()
    .typeError("Eligible amount must be a number")
    .min(0, "Eligible amount cannot be negative")
    .required("Eligible amount is required"),

  requestedAmount: yup
    .number()
    .typeError("Requested amount must be a number")
    .min(0, "Requested amount cannot be negative")
    .required("Requested amount is required"),

  approxInterest: yup
    .number()
    .typeError("Approx interest must be a number")
    .min(0, "Approx interest cannot be negative")
    .required("Approx interest is required"),

  approvedAmount: yup
    .number()
    .typeError("Approved amount must be a number")
    .min(0, "Approved amount cannot be negative")
    .required("Approved amount is required"),
  appraiserOneId: yup.string().required("Appraiser 1 ID is required"),
  appraiserOneName: yup.string().required("Appraiser 1 Name is required"),
  appraiserOneType: optionSchema,

  appraiserTwoId: yup.string().required("Appraiser 2 ID is required"),
  appraiserTwoName: yup.string().required("Appraiser 2 Name is required"),
  appraiserTwoType: optionSchema,

  //  collateralDetails: yup
  //     .array()
  //     .of(collateralSchema)
  //     .min(1, "At least one collateral is required")
  //     .required(),
});
