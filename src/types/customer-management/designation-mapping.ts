export type AccessType = "Read" | "Write" | "Full Access";

export interface DesignationProfile {
  id: string;
  name: string;
  code: string;
  level: number;
  description: string;
  occupationId: string;
  isActive: boolean;
  isManagerial: boolean;
  initial: string;
  color: string;
  assignedRoleCount: number;
}

export interface AssignedRole {
  id: string;
  mappingId?: string;
  title: string;
  subtitle: string;
  accessLevel: AccessType;
  status: "Active" | "Pending";
  description: string;
}
export interface AvailableRole {
  id: string;
  title: string;
  subtitle: string;
}
export interface DesignationRoleMappingRequestDto {
  designationIdentity: string;
  roleIdentity: string;
  isActive: boolean;
}

export interface DesignationRoleMappingResponseDto {
  identity: string;
  designationIdentity: string;
  designation: string;
  roleIdentity: string;
  role: string;
  isActive: boolean;
}
export interface RoleDto {
  identity: string;
  roleName: string;
  roleCode: string;
  roleShortDesc: string | null;
  isActive: boolean;
}
