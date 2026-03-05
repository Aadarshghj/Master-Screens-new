import type { AssetItemType } from "@/types/customer-management/asset-item";

export const DEFAULT_VALUES: AssetItemType = {
  assetItemCode: "",
  assetItemName: "",
  assetType: "",
  assetGroup: "",
  assetCategory: "",
  depreciationRate: "",
  depreciationMethod: "",
  unitOfMeasurement: "",
  assetDescription: "",
  tangible: false,
  active: false,
};

export const ASSET_TYPE_OPTIONS = [
  { label: "ASSET TYPE - 1", value: "ASSET_TYPE_1" },
  { label: "ASSET TYPE - 2", value: "ASSET_TYPE_2" },
  { label: "ASSET TYPE - 3", value: "ASSET_TYPE_3" },
];

export const ASSET_GROUP_OPTIONS = [
  { label: "ASSET GROUP - 1", value: "ASSET_GROUP_1" },
  { label: "ASSET GROUP - 2", value: "ASSET_GROUP_2" },
  { label: "ASSET GROUP - 3", value: "ASSET_GROUP_3" },
];

export const ASSET_CATEGORY_OPTIONS = [
  { label: "ASSET CATEGORY - 1", value: "ASSET_CATEGORY_1" },
  { label: "ASSET CATEGORY - 2", value: "ASSET_CATEGORY_2" },
  { label: "ASSET CATEGORY - 3", value: "ASSET_CATEGORY_3" },
];

export const DEPRECIATION_METHOD_OPTIONS = [
  { label: "Straight Line", value: "STRAIGHT_LINE" },
  { label: "Reducing Balance", value: "REDUCING_BALANCE" },
  { label: "Written Down Value", value: "WRITTEN_DOWN_VALUE" },
];

export const UNIT_OF_MEASUREMENT_OPTIONS = [
  { label: "Nos", value: "NOS" },
  { label: "Unit", value: "UNIT" },
  { label: "Kg", value: "KG" },
  { label: "Litre", value: "LITRE" },
  { label: "Meter", value: "METER" },
];
