import type { AssetGroupType } from "@/types/asset-management-system/asset-group.types";

export const ASSET_GROUP_SAMPLE_DATA: AssetGroupType[] = [
  {
    id: "1",
    assetCode: "AS-0098",
    assetType: "Select",
    assetName: "COMPACC",
    postingGL: "66",
    description: "Fixed Assets",
    isActive: true,
  },
];

export const ASSET_TYPE_OPTIONS = [
  { value: "DEMO1", label: "demo1" },
  { value: "DEMO2", label: "demo2" },

  { value: "DEMO3", label: "demo3" },

  { value: "DEMO4", label: "demo4" },
];
