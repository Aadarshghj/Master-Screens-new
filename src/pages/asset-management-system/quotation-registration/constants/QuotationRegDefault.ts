import type { QuotationFilter ,QuotReqDetails, Options, SupplierDetails, Terms } from "@/types/asset-management/quotation-registration-type";

export const QUOTATION_FILTER_DEFAULT_VALUES: QuotationFilter = {
    reqId:"",
    status: "ALL"
}

export const STATUS_OPTIONS: Options[] = [
  { label: "All", value: "ALL" },
  { label: "Active", value: "ACTIVE" },
  { label: "Inactive", value: "INACTIVE" },
  { label: "Pending", value:"Pending"},
];

export const CHARGES_OPTIONS: Options[] = [
  { label: "Transportation Charge" , value: "transportation" },
  { label: "Moving Charge" , value: "moving" },
  { label: "Duty Charge" , value: "duty" }
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