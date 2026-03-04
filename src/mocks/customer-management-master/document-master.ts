import type { DocumentMaster } from "@/types/customer-management/document-master";

export const DOCUMENT_MASTER_DATA: DocumentMaster[] = [
  {
    documentCode: "AADHAR",
    documentName: "Aadhar Card",
    documentCategory: "GOVT",
    identityProof: true,
    addressProof: true,
  },
  {
    documentCode: "PAN",
    documentName: "PAN Card",
    documentCategory: "GOVT",
    identityProof: true,
    addressProof: false,
  },
];
