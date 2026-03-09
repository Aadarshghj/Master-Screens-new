export interface menuSubmenu {
  menuName: string;
  menuCode: string;
  description: string ;
   menuOrder:string;
   parent:string;
  isUrl:boolean;
  pageUrl: string;
  isActive:boolean
  identity: string;
}
export interface  menuSubmenuDto extends Record<string, unknown> {
  menuName: string;
  menuCode: string;
  description: string ;
   menuOrder:string;
   parent:string;
  isUrl: boolean;
  pageUrl: string;
  isActive:boolean
}
export interface menuSubmenuResponseDto {
  menuName: string;
  menuCode: string;
  description: string ;
   menuOrder:string;
   parent:string;
  isUrl: boolean;
  pageUrl: string;
  isActive:boolean;
   identity: string;
}

