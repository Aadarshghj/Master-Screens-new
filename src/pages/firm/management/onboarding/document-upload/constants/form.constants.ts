import type { FirmDocument } from "@/types/firm/firm-document.types";

export const defaultDocumentValues: FirmDocument = {
  firmType: "",
  documentType: "",
  idNumber: "",
  documentFile: null,
  isActive: true,
};

// Document types are now fetched from API
