export interface DocumentType {
  documentTypeCode: string;
  displayName: string;
  remarks?: string;
}

export interface DocumentTypeRequestDto {
  code: string;
  displayName: string;
  description?: string;
}

export interface DocumentTypeResponseDto {
  documentTypeId: number;
  code: string;
  displayName: string;
  description?: string;
  identity: string;
}
