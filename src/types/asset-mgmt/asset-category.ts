export interface AssetCategory {
  assetGroupCode: string;
  assetCategoryName: string;
  assetCategoryDesc?: string;
  status: boolean;
}

export interface AssetCategoryRequestDto {
  assetGroupcode: string;
  assetCategoryName: string;
  assetCategoryDesc?: string;
  status: string;
}

export interface AssetCategoryResponseDto {
  assetGroupId: string;
  assetGroupCode: string;
  assetCatgeoryName: string;
  assetCategoryDesc?: string;
  status: string;
}
