import type { DMSFileData } from "@/hooks/useDMSFileUpload";
import type { SelectOption } from "./shared.types";
import type { ConfirmationModalData } from "@/layout/BasePageLayout";

export interface BankAccountFormData {
  accountNumber: string;
  verifyAccountNumber: string;
  ifsc: string;
  bankName: string;
  branchName: string;
  accountHolderName: string;
  accountType: string;
  upiId: string;
  accountStatus: string;
  isPrimary: boolean;
  activeStatus: boolean;
  documentFile: File | null | string;
  customerCode?: string;
  // File upload and UI state moved to useForm
  dmsFileData: DMSFileData | null;
  pdStatus?: null | string;
}

export interface GetBankAccountsResponse {
  identity: string;
  customerCode: string;
  status: string;
  bankAccounts: BankAccountResponse[];
}

export interface BankAccountResponse {
  bankName: string;
  branchName: string;
  ifscCode: string;
  upiId: string;
  accountNumber: string;
  maskedAccountNumber: string;
  accountHolderName: string;
  accountType: string;
  accountStatus: string;
  isPrimary: boolean;
  pdStatus: string;
  upiVerified: boolean | null;
  isActive: boolean;
  bankProofDocumentRefId: number;
  bankAccountIdentity: string;
  bankProofFilePath: string;
}

export interface CreateBankAccountRequest {
  bankName: string;
  ifscCode: string;
  accountNumber: string;
  upiId?: string;
  accountType: string;
  accountStatus: string;
  accountHolderName: string;
  branchName: string;
  bankProofDocumentRefId?: number;
  bankProofFilePath?: string;
  isActive: boolean;
  isPrimary: boolean;
  upiVerified?: boolean | null;
  pdStatus?: string | null;
  pdTxnId?: string;
  customerCode: string;
  // createdBy: number;
  // updatedBy?: number;
  // DMS file metadata
  // documentRefId?: string;
  // filePath?: string;
  // fileName?: string;
  // fileType?: string;
}

export interface BankAccountFormErrors {
  accountNumber?: string;
  verifyAccountNumber?: string;
  ifsc?: string;
  bankName?: string;
  branchName?: string;
  accountHolderName?: string;
  accountType?: string;
  upiId?: string;
  accountStatus?: string;
  general?: string;
}

export interface BankAccountState {
  isReady: boolean;
}

export interface AccountVerificationRequest {
  accountNumber: string;
  ifsc: string;
}

export interface AccountVerificationResult {
  status: "success" | "error" | "failed";
  decentroTxnId: string;
  accountStatus: "valid" | "invalid" | "blocked";
  responseCode: string;
  message: string;
  beneficiaryName: string;
  bankReferenceNumber: string;
  transactionStatus: "success" | "failed" | "pending";
}

export interface UpiVerificationRequest {
  upiId: string;
}

export interface UpiVerificationResult {
  decentroTxnId: string;
  status: "SUCCESS" | "ERROR" | "FAILED" | "Success";
  responseCode: string;
  message: string;
  responseKey: string;
  data: {
    upiVpa: string;
    nameAsPerBank: string;
    accountNumber: string;
    ifsc: string;
    bankReferenceNumber: string;
    npciTransactionId: string;
  };
}

export interface BankAccountTableProps {
  onSetPrimary?: (bankAccountId: string) => void;
  customerIdentity?: string | null;
  isView?: boolean;
  readOnly?: boolean;
  pendingForApproval?: boolean;
}

export interface BankAccountFormProps {
  readonly?: boolean;
  onSuccess?: (data: BankAccountResponse) => void;
  customerIdentity?: string | null;
  handleSetConfirmationModalData?: (data: ConfirmationModalData) => void;
  confirmationModalData?: ConfirmationModalData;
}

export interface BankSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  // API response fields
  identity?: string;
  statusName?: string;
  isActive?: boolean;
}

// ConfigOption moved to shared.types.ts to avoid duplication

export interface BankAccountConfig {
  accountTypeOptions: SelectOption[];
  accountStatusOptions: SelectOption[];
}

export interface IFSCCodeResponse {
  ifscCode: string;
  bankName: string;
  branchName: string;
  branchPlace: string;
  pincodes: number;
  rbiFlag: boolean;
  isActive: boolean;
  identity: string;
}

export interface BankAccountDetailsPageProps {
  customerIdentity?: string | null;
  isView?: boolean;
  readOnly?: boolean;
  pendingForApproval?: boolean;
  handleSetConfirmationModalData?: (data: ConfirmationModalData) => void;
  confirmationModalData?: ConfirmationModalData;
}

export interface DuplicateAccountSuccess {
  isDuplicate: boolean;
}

export interface DuplicateAccountError {
  errorCode: string;
  message: string;
  existingIdentity: string;
  existingDetails: {
    customerIdentity: string;
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    customerName: string;
  };
}
