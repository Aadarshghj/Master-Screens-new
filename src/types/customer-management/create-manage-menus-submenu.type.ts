export interface menuSubmenu {
  parent: any
  identity?: string
  menuName: string
  menuCode: string
  description: string
  menuOrder: number | null
  parentMenu?: string
  isUrl: boolean
  pageUrl?: string
  isActive: boolean
}

export interface menuSubmenuDto extends Record<string , unknown> {
  menuName: string
  menuCode: string
  description: string
  menuOrder: number | null
  parentMenu?: string
  isActive: boolean
  pageUrl?: string
  isUrl: boolean
}

export interface menuSubmenuResponseDto {
  identity: string
  menuName: string
  menuCode: string
  description: string
  menuOrder: number
  isUrl: boolean
  pageUrl?: string
  isActive: boolean
  parent?: {
    identity: string
    menuName: string
  }
}

export interface ParentMenuResponseDto {
  identity: string;
  menuName: string;
  parent?: ParentMenuResponseDto  ;
}

export interface ParentMenu {
  identity: string
  menuName: string
  parent?: ParentMenu | null
}

