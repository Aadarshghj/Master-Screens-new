export interface RequiredDocumentRow {
  id: number;
  documentName: string;
  file?: File | null;
}

export interface DocumentUploadProps {
  isOpen: boolean;
  close: () => void;
  onSubmit: (file: File) => void;
  documentName?: string;
}
