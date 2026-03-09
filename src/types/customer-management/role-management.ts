export interface RoleManagementType {
  roleName: string;
  roleShortDesc: string | null;
  isActive: boolean;

  
}

export interface RoleManagementRequestDto extends Record<string, unknown> {
  roleName: string;
  roleShortDesc: string | null;
  isActive: boolean;
}

export interface RoleManagementResponseDto {
  roleName: string;
  roleShortDesc: string | null;
  isActive: boolean;
  identity: string;
}
