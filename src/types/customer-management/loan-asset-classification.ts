export interface AssetClassificationType{
    identity:string
    assetClassificationName:string;
    description:string;
    isActive:boolean;
}
export interface LoanAssetRequestDto
  extends Record<string, unknown> {
  assetClassificationName: string;
  description: string;
  isActive: boolean;
}

export interface LoanAssetResponseDto{
    assetClassificationName:string;
    description:string;
    isActive:boolean;
    identity:string
}

export interface LoanAssetTableRow {
  value: string;
  label: string;
}
