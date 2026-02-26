import * as yup from "yup";

export const approvalFlowSchema = yup.object({
  workflow: yup.string().required("Workflow is required"),
  fromAmount: yup
    .number()
    .typeError("From amount must be a number")
    .required("From amount is required")
    .min(0, "From amount cannot be negative"),

  toAmount: yup
    .number()
    .typeError("To amount must be a number")
    .required("To amount is required")
    .moreThan(
      yup.ref("fromAmount"),
      "To amount must be greater than From amount"
    ),

  amountOn: yup.string().required("Amount On is required"),

  approvalFlow: yup.string().required("Approval flow is required"),

  isActive: yup.boolean().required(),
});
