import type { Bank } from "@/types/customer-management/bank";

export const BANK_TABLE_DATA: Bank[] = [
  {
    bankCode: "SBI",
    bankName: "State Bank of India",
    swiftBicCode: "SBININBB",
    country: "India",
    psu: true,
  },
  {
    bankCode: "HDFC",
    bankName: "HDFC Bank",
    swiftBicCode: "HDFCINBB",
    country: "India",
    psu: false,
  },
  {
    bankCode: "ICICI",
    bankName: "ICICI Bank",
    swiftBicCode: "ICICINBB",
    country: "India",
    psu: false,
  },
  {
    bankCode: "AXIS",
    bankName: "Axis Bank",
    swiftBicCode: "AXISINBB",
    country: "India",
    psu: false,
  },
];
