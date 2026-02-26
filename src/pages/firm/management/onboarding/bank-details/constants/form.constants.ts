import type { BankDetails } from "@/types/firm/firm-bankDetails";

export const bankDetailsDefaultValues: BankDetails = {
  accountNumber: "",
  verifyAccountNumber: "",
  ifsc: "",
  bankName: "",
  branchName: "",
  accountHolderName: "",
  accountType: "",
  upiId: "",
  accountStatus: "",
  bankProof: null,
  pennyDropVerification: false,
  upiIdVerification: "",
  primary: false,
  active: false,
};
