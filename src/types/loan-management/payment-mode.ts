export interface SelectOption {
  label: string;
  value: string;
}

export interface TransferDetailRow {
  id: string;
  modeOfTransfer: string;
  fundsBranch: string;
  fundGlAccNo: string;
  transferAmount: number;
  referenceNumber: string;
  cashLimit: number;
  bankAccount: string;
  ifsc: string;
  benificiaryName: string;
}

export interface PaymentModeModalProps {
  isOpen: boolean;
  close: () => void;
}
