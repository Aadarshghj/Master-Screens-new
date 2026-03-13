import * as yup from "yup";

export const quotationRegistrationSchema = yup.object({
  quotReq: yup.object({
    quotReqDate: yup
      .date()
      .typeError("Quotation Request Date is required")
      .required("Quotation Request Date is required"),

    quotReqId: yup
      .string()
      .required("Quotation Request ID is required"),

    reqBy: yup
      .string()
      .required("Requested By is required"),

    description: yup
      .string()
      .required("Description is required"),
  }),

  supplier: yup.object({
    supplierName: yup
      .string()
      .required("Supplier Name is required"),

    quotationNumber: yup
      .string()
      .required("Quotation Number is required"),

    quotationDate: yup
      .date()
      .typeError("Quotation Date is required")
      .required("Quotation Date is required"),

    quotationAmount: yup
      .number()
      .typeError("Quotation Amount must be a number")
      .required("Quotation Amount is required"),

    totalQuotationAmount: yup
      .number()
      .typeError("Total Quotation Amount must be a number")
      .required("Total Quotation Amount is required"),
  }),

  upload: yup.object({
    uploadQuot: yup
      .mixed()
      .required("Quotation file is required"),
  }),
});