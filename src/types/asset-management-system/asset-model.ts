export interface AssetModelType {
    assetItem:string;
    assetModelCode:string;
    description:string;
}
export interface AssetModelRequestDto {
    assetitem:string;
    assetcode:string;
    desc:string;
}
export interface AssetModelResponseDto {
    assetItem:string;
    assetModelCode:string;
    description:string;
}
// export interface AssetItem{
//     assetItem:string;
//     assetModelCode:string;
//     description:string;
// }
export interface Option {
  value: string;
  label: string;
}

