export interface DocumentMaster {
  documentCode: string;
  documentName: string;
  documentCategory: string;
  identityProof: boolean;
  addressProof: boolean;
}

export interface DocumentMasterRequestDto {
  docCode: string;
  docName: string;
  docCategory: string;
  isIdentityProof: boolean;
  isAddressProof: boolean;
}

export interface DocumentMasterResponseDto {
  documentId: number;
  docCode: string;
  docName: string;
  isIdentityProof: boolean;
  isAddressProof: boolean;
  identity: string;
}
