import type { QuotationFilter ,QuotReqDetails, Options, SupplierDetails, Terms } from "@/types/asset-management-system/quotation-registration-type";

export const QUOTATION_FILTER_DEFAULT_VALUES: QuotationFilter = {
    reqId:"",
    status: ""
}

export const STATUS_OPTIONS: Options[] = [
  { label: "All", value: "ALL" },
  { label: "Quotation Received", value: "QUOTATION_RECEIVED" },
  { label: "No Quotation", value: "NO_QUOTATION" },
  { label: "Pending", value:"PENDING"},
];

export const CHARGES_OPTIONS: Options[] = [
  { label: "Transportation Charges" , value: "transportation" },
  { label: "Moving Charges" , value: "moving" },
  { label: "Duty Charges" , value: "duty" },
  { label: "Handling Charges" , value: "handling" }
]

export const QUOTATION_REG_DETAIL_DEFAULT_VALUES: QuotReqDetails = {
  quotReqDate: "",
  quotReqId: "",
  reqBy: "",
  description: "",
};

export const SUPPLIER_DETAILS_DEFAULT_VALUES: SupplierDetails = {
    supplierName: "",
    quotationNumber: 0,
    quotationDate: "",
    quotationAmount: 0
}

export const OTHER_CHARGES_DEFAULT_VALUES: Terms = {
    termsAndC: "",
    totQuot: ""
}