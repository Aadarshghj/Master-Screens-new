import * as yup from "yup";

export const paymentModeSchema = yup.object({
  id: yup.string(),
  modeOfTransfer: yup.string().required("Mode of transfer is required"),
  fundsBranch: yup.string().required("Branch is required"),
  fundGlAccNo: yup.string().required("Fund GL Account is required"),
  cashLimit: yup
    .number()
    .typeError("Cash limit must be a number")
    .min(0, "Cash limit must be positive")
    .required(),
  bankAccount: yup.string().required("Bank account is required"),
  referenceNumber: yup.string().optional(),

  ifsc: yup.string().required("IFSC is required"),
  benificiaryName: yup.string().required("Beneficiary name is required"),
  transferAmount: yup
    .number()
    .typeError("Transfer amount must be a number")
    .positive("Amount must be greater than zero")
    .required(),
});
