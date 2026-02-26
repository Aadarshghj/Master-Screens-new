export interface BankDetails {
  accountNumber: string;
  verifyAccountNumber: string;
  ifsc: string;
  bankName: string;
  branchName: string;
  accountHolderName: string;
  accountType: string;
  upiId: string;
  accountStatus: string;
  bankProof: File | null | string;
  pennyDropVerification: boolean;
  upiIdVerification: string;
  primary: boolean;
  active: boolean;
}

export interface ConfigOption {
  value: string;
  label: string;
}
