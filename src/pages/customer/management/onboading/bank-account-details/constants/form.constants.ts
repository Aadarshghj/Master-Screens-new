import type { BankAccountFormData } from "@/types/customer/bank.types";

export const DEFAULT_FORM_VALUES: BankAccountFormData = {
  accountNumber: "",
  verifyAccountNumber: "",
  ifsc: "",
  bankName: "",
  branchName: "",
  accountHolderName: "",
  accountType: "",
  upiId: "",
  accountStatus: "73ed979e-7ac9-4170-9d48-eb97e364a45f", // Active status ID
  isPrimary: false,
  activeStatus: true,
  documentFile: null,
  customerCode: "",
  // File upload and UI state moved to useForm
  dmsFileData: null,
};
