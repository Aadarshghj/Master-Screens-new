import type { AssetItemType } from "@/types/customer-management/asset-item";

export const ASSET_ITEM_DATA: AssetItemType[] = [
  {
    assetItemCode: "AI-001",
    assetItemName: "Office Laptop",
    assetType: "ASSET_TYPE_1",
    assetGroup: "ASSET_GROUP_1",
    assetCategory: "ASSET_CATEGORY_1",
    depreciationRate: 15,
    depreciationMethod: "STRAIGHT_LINE",
    unitOfMeasurement: "NOS",
    assetDescription: "Dell Latitude Laptop",
    tangible: true,
    active: true,
  },
  {
    assetItemCode: "AI-002",
    assetItemName: "Office Chair",
    assetType: "ASSET_TYPE_2",
    assetGroup: "ASSET_GROUP_2",
    assetCategory: "ASSET_CATEGORY_2",
    depreciationRate: 10,
    depreciationMethod: "REDUCING_BALANCE",
    unitOfMeasurement: "UNIT",
    assetDescription: "Ergonomic Chair",
    tangible: true,
    active: false,
  },
];