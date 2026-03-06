export interface ModuleType {
  identity: string;
  moduleCode: string;
  moduleName: string;
  description: string;
  isActive: boolean;
}

export interface ModuleMgmtRequestDto 
extends Record<string, unknown> {
  moduleCode: string,
  moduleName: string,
  description: string,
  isActive: boolean,
}

export interface ModuleMgmtResponseDto {
  identity: string,
  moduleCode: string,
  moduleName: string,
  description: string,
  isActive: boolean,
}
