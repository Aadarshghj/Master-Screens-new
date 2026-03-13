export interface AssetClassificationType{
    identity:string
    assetClassiName:string;
    description:string;
    isActive:boolean;
}
export interface LoanAssetRequestDto
  extends Record<string, unknown> {
  assetClassiName: string;
  description: string;
  isActive: boolean;
}

export interface LoanAssetResponseDto{
    assetClassiName:string;
    description:string;
    isActive:boolean;
    identity:string
}

export interface LoanAssetTableRow {
  value: string;
  label: string;
}
