import type { SelectOption } from "@/components";
import type { TransferDetailRow } from "@/types/loan-management/payment-mode";

export const TRANSFER_DATA: TransferDetailRow[] = [
  {
    id: "1",
    modeOfTransfer: "NEFT",
    fundsBranch: "Hyderabad Main",
    fundGlAccNo: "GL-102345",
    cashLimit: 1000000,
    bankAccount: "HDFC",
    ifsc: "HDFC0001234",
    benificiaryName: "Ravi Kumar",
    transferAmount: 250000,
    referenceNumber: "REF123456",
  },
  {
    id: "2",
    modeOfTransfer: "RTGS",
    fundsBranch: "Bangalore Central",
    fundGlAccNo: "GL-204589",
    cashLimit: 2000000,
    bankAccount: "SBI",
    ifsc: "ICIC0005678",
    benificiaryName: "Anita Sharma",
    transferAmount: 500000,
    referenceNumber: "REF987654",
  },
];

export const MODE_OF_TRANSFER_OPTIONS: SelectOption[] = [
  { label: "Cash", value: "CASH" },
  { label: "NEFT", value: "NEFT" },
  { label: "RTGS", value: "RTGS" },
  { label: "IMPS", value: "IMPS" },
  { label: "UPI", value: "UPI" },
  { label: "Cheque", value: "CHEQUE" },
];

export const BANK_ACCOUNT_OPTIONS: SelectOption[] = [
  {
    label: "SBI - 1234567890",
    value: "ACC_SBI_1234567890",
  },
  {
    label: "HDFC - 9876543210",
    value: "ACC_HDFC_9876543210",
  },
  {
    label: "ICICI - 4567891230",
    value: "ACC_ICICI_4567891230",
  },
];
