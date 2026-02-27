export interface MsmeType {
  msmeType: string;
  msmeTypeDesc?: string;
  status: boolean;
}

export interface MsmeTypeRequestDto {
  msmeType: string;
  msmeTypeDesc?: string;
  status: string;
}

export interface MsmeTypeResponseDto {
  msmeTypeId: string;
  msmeType: string;
  msmeTypeDesc?: string;
  status: string;
}
