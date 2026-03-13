import type { AssetCategory } from "../../types/asset-mgmt/asset-category";

export const ASSET_CATEGORY_SAMPLE_DATA: AssetCategory[] = [
  {
    assetGroupCode: "AA-0987",
    assetCategoryName: "LAND",
    assetCategoryDesc: "Land and plots owned by the organization.",
    status: true,
  },
  {
    assetGroupCode: "AA-0988",
    assetCategoryName: "BUILDING",
    assetCategoryDesc: "Office buildings, branches, and constructed properties.",
    status: true,
  },
  {
    assetGroupCode: "AA-0989",
    assetCategoryName: "VEHICLE",
    assetCategoryDesc: "Company-owned vehicles used for operations.",
    status: false,
  },
  {
    assetGroupCode: "AA-0990",
    assetCategoryName: "FURNITURE",
    assetCategoryDesc: "Office furniture including desks, chairs, and fixtures.",
    status: true,
  },
  {
    assetGroupCode: "AA-0991",
    assetCategoryName: "COMPUTER EQUIPMENT",
    assetCategoryDesc: "Computers, laptops, printers, and IT hardware.",
    status: true,
  },
  {
    assetGroupCode: "AA-0992",
    assetCategoryName: "MACHINERY",
    assetCategoryDesc: "Operational machinery and technical equipment.",
    status: false,
  },
];
