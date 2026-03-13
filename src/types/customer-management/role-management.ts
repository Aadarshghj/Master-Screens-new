export interface RoleManagementType {
  roleCode:string
  roleName: string;
  roleShortDesc: string | null;
  isActive: boolean;
  identity:string 
  accesslevel:string
}

export interface RoleManagementRequestDto extends Record<string, unknown> {
   roleCode:string
  roleName: string;
  accesslevel:string
  roleShortDesc: string | null;
  isActive: boolean;
  
}

export interface RoleManagementResponseDto {
   roleCode:string
  roleName: string;
  accesslevel:string
  roleShortDesc: string | null;
  isActive: boolean;
  identity: string;
}

export interface options{
  value:string
  label:string
}