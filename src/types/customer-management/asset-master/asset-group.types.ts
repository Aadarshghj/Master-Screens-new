export interface AssetGroupType {
  id: string;
  assetCode: string;
  assetType: string;
  assetName: string;
  postingGL: string;
  description: string;
  isActive: boolean;
}
export interface Option {
  value: string;
  label: string;
}

export interface TAndCType{
  termsAndConditions: string;
}