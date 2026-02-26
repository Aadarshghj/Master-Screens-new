export interface AssetItemType {
  assetItemCode: string;

  assetItemName: string;
  assetType: string;
  assetGroup: string;
  assetCategory: string;

  depreciationRate?: string;
  depreciationMethod: string;

  unitOfMeasurement: string;
  assetDescription?: string;

  tangible: boolean;
  active: boolean;
}

export interface AssetItemRequestDto {
  assetItemName: string;
  assetType: string;
  assetGroup: string;
  assetCategory: string;
  depreciationRate: string;
  depreciationMethod: string;
  unitOfMeasurement: string;
  assetDescription?: string;
  tangible: boolean;
  active: boolean;
}

export interface AssetItemResponseDto extends AssetItemRequestDto {
  assetItemId: string;
  identity: string;
}