export interface TenantType {
  id: string;
  tenantName: string;
  tenantCode: string;
  isActive: boolean;
}

export interface TenantRequestDto {
  tenantName: string;
  tenantCode: string;
  isActive: boolean;
}

export interface TenantResponseDto {
  identity: string;
  tenantName: string;
  tenantCode: string;
  isActive: boolean;
}