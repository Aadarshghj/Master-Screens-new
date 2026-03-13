export interface AssetItemAttributeBase {
  assetItem: string;
  attributeKey: string;
  attributeName: string;
  dataType: string;
  defaultValue?: string;
  listValues?: string;
  description?: string;
  isRequired: boolean;
  isActive: boolean;
  identity?: string;
}

export interface AssetItemAttributeSearchForm {
  assetItem: string,
  attributeName: string,
  status: boolean,
 // dataType: string,
}

export interface AssetItemAttributeTable {
  assetItem: string;
  attributeKey: string;
  attributeName: string;
  dataType: string;
  defaultValue?: string;
  listValues?: string;
  description?: string;
  isActive: boolean;
  identity: string;
}