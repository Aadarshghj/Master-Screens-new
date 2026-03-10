export interface menuSubmenu {
  menuName: string;
  menucode: string;
  description: string ;
   menuOrder:string;
   parentMenu:string;
  url: boolean;
  pageurl: string;
  isActive:boolean
  menuIdentity: string;
}
export interface  menuSubmenuDto extends Record<string, unknown> {
  menuName: string;
  menucode: string;
  description: string ;
   menuOrder:string;
   parentMenu:string;
  url: boolean;
  pageurl: string;
  isActive:boolean
}
export interface menuSubmenuResponseDto {
  menuName: string;
  menucode: string;
  description: string ;
   menuOrder:string;
   parentMenu:string;
  url: boolean;
  pageurl: string;
  isActive:boolean;
   menuIdentity: string;
}

