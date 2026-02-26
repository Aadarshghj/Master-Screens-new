export interface FirmDocument {
  id?: number;
  firmType: string;
  documentType: string;
  idNumber: string;
  documentFile: File | null;
  isActive: boolean;
}

export interface DocumentType {
  value: string;
  label: string;
}

export interface UploadedDocument {
  id: number;
  slNo: number;
  firmType: string;
  documentType: string;
  idNumber: string;
  verified: string;
  status: string;
  documentUrl?: string;
}
