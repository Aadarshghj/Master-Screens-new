import type { BankConfig, Options } from "@/types/loan-product-and-scheme-masters/co-lending-scheme-mapping/co-lending-bank-config.types";

export const BANK_CONFIG_DEFAULT_VALUES: BankConfig = {
  bankCode : "",
  bankName : "",
  interestRate : undefined,
  interestCalcOn : "",
  handoff : "",
  isActive: true,
  mode: true,
  clmId: true,
};

export const interestCalcOnOptions = [
    { value: "Disbursal Date", label: "Disbursal Date" },
    { value: "Repayment Date", label: "Repayment Date" },
] as Options[];

export const handoffOptions = [
    { value: "Yes", label: "Yes" },
    { value: "No", label: "No" },
] as Options[];