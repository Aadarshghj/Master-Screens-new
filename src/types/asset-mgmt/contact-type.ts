export interface ContactType {
  contactType: string;
  contactTypeDesc?: string;
  status: boolean;
}

export interface ContactTypeRequestDto {
  contactType: string;
  contactTypeDesc?: string;
  status: string;
}

export interface ContactTypeResponseDto {
  contactTypeId: string;
  contactType: string;
  contactTypeDesc?: string;
  status: string;
}
