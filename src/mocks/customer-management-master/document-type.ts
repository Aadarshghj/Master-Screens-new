import type { DocumentType } from "@/types/customer-management/document-type";

export const DOCUMENT_TYPE_DATA: DocumentType[] = [
  {
    documentTypeCode: "ID_PROOF",
    displayName: "Identity Proof",
    remarks: "Used for KYC verification",
  },
  {
    documentTypeCode: "ADDR_PROOF",
    displayName: "Address Proof",
    remarks: "Residential address verification",
  },
];
