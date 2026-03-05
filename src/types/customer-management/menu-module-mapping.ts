export interface MenuModuleMappingType {
  id: string;
  menuName: string;
  moduleName: string;
  isActive: boolean;
}

export type MenuModuleMappingRequestDto = {
  //   menuName: string;
  // moduleName: string;
  isActive: boolean;
    menuIdentity: string;
    moduleIdentity: string;
};
export type MenuModuleMappingResponseDto = {
    identity: string;
    menuName: string;
  moduleName: string;
  isActive: boolean;
    menuIdentity: string;
    moduleIdentity: string;
};

export interface Option {
  value: string;
  label: string;
}
export interface MenuDetailsResponseDto {
  identity: string;
  menuName: string;
}

export interface ModuleResponseDto {
  label: any;
  identity: string;
  moduleName: string;
}
