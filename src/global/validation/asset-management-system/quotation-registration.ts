import * as yup from "yup";
// import type {
//   QuotReqDetails,
//   SupplierDetails,
//   UploadQuot,
// } from "@/types/asset-management-system/quotation-registration-type";

export const quotationRegistrationSchema = yup.object({
  quotReq: yup.object({
    quotReqDate: yup
      .string()
      .required("Quotation request date is required"),

    quotReqId: yup
      .string()
      .required("Quotation request ID is required"),

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
      .required("Supplier name is required"),

    quotationNumber: yup
      .string()
      .required("Quotation number is required"),

    quotationDate: yup
      .string()
      .required("Quotation date is required"),

    quotationAmount: yup
      .number()
      .typeError("Enter valid amount")
      .required("Quotation amount required"),
  }),

  upload: yup.object({
    uploadQuot: yup
      .mixed()
      .required("Please upload quotation file"),
  }),
});