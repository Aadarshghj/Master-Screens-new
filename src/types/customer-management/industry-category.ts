export interface IndustryCategoryType {
  industryCategoryName: string;
  description?: string;
}

export interface IndustryCategoryResponseDto {
  industryCategoryId: number;
  industryCategoryName: string;
  description?: string;
  identity: string;
}
