
import type { CoLendingSchemeMapType } from "@/types/loan-product-and-scheme-masters/co-lending-scheme-mapping/co-lending-scheme-map";

export const COL_LENDING_SCHEME_MAP_SAMPLE_DATA: CoLendingSchemeMapType[] =[
     {
     productcode: "Personal Loan",
   schemecode: "PL-STANDARD",
    bankcode: "HDFC001 ICICI001",
    bankname: "ACTIVE",
  },
  
]

export const PRODUCT_CODE_OPTIONS = [
  { value: "1", label: "SYSTEM USER" },
  { value: "2", label: "CUSTOMER" },
  { value: "3", label: "STAFF" },
];
export const SAMPLE_CODE_OPTIONS = [
  { value: "1", label: "SYSTEM USER" },
  { value: "2", label: "CUSTOMER" },
  { value: "3", label: "STAFF" },
];
export const BANK_CODE_OPTIONS = [
  { value: "1", label: "SYSTEM USER" },
  { value: "2", label: "CUSTOMER" },
  { value: "3", label: "STAFF" },
];
