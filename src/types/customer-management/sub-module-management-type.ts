// The exact shape of the object coming from the GET request
export interface SubModuleResponseDto {
  identity: string;
  moduleName: string;
  modules: string; // The ID of the module
  subModuleCode: string;
  subModuleName: string;
  description: string;
  isActive: boolean;
}

export interface SubModule {
  id: string; // Mapped from identity
  moduleName: string;
  moduleId: string; // Mapped from modules
  subModuleCode: string;
  subModuleName: string;
  description: string;
  isActive: boolean;
}

// Keeping your request DTO as is (assuming this is what POST/PUT expects)
export interface SubModuleRequestDto {
  subModuleName: string;
  moduleIdentity: string; // Updated
  subModuleCode: string;
  description: string; // Updated
  isActive: string;
}

export interface ModuleResponseDto {
  identity: string;
  moduleCode: string;
  moduleName: string;
  description: string;
  isActive: boolean;
  subModules: unknown[]; // We can just type this as any[] since the dropdown doesn't use it
}

export interface Module {
  id: string; // We map identity to id
  moduleCode: string;
  moduleName: string;
  description: string;
  isActive: boolean;
}
