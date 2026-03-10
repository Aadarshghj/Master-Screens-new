import type { BankConfigData } from "@/types/loan-product-and-scheme-masters/co-lending-scheme-mapping/co-lending-bank-config.types";

export const BANK_TABLE_DATA: BankConfigData[] = [
  {
    bankCode: "BR001",
    bankName: "Mumbai Central",
    interestRate: 12,
    mode: true,
    isActive: true,
  },
  {
    bankCode: "BR002",
    bankName: "Chennai Central",
    interestRate: 5,
    mode: false,
    isActive: false,
  },
];
