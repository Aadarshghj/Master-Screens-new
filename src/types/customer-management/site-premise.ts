export interface SitePremiseType {
  premiseTypeName: string;
  description?: string;
}

export interface SitePremiseResponseDto {
  sitePremiseId: number;
  premiseTypeName: string;
  description?: string;
  identity: string;
}
