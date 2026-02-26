export type AccessType = string;

export interface UserProfile {
  id: string;
  name: string;
  empId: string;
  department: string;
  initial: string;
  color: string;
  assignedCount: number;
}

export interface ApiRoleData {
  identity?: string;
  userIdentity?: string;
  value?: string;
  userName?: string;
  label?: string;
  userCode?: string;
  roleName?: string;
  roleIdentity?: string;
  roleCode?: string;
  effectiveFrom?: string;
  effectiveTo?: string;
}

export interface UserCardData {
  id: string;
  name: string;
  empId: string;
  department: string;
  initial: string;
  color: string;
  assignedCount: number;
}

export interface ApiUserRoleMapping {
  identity: string;
  userIdentity: string;
  userCode: string;
  userName: string;
  roleIdentity: string;
  roleName: string;
  roleCode: string;
  permissionIdentity: string;
  permissionName: string;
  permissionCode: string;
  isPrimary: boolean;
  effectiveFrom: string;
  effectiveTo: string;
}


export interface ApiMasterRole {
  identity: string;
  roleName: string;
  roleCode: string;
  roleShortDesc: string | null;
  isActive: boolean;
}
export interface AssignedRole {
  id: string;
  title: string;
  subtitle: string;
  accessLevel: string;
  status: "Active" | "Pending";
  roleId?: string;
  description?: string;
  permissionId?: string;
}

export interface AvailableRole {
  id: string;
  title: string;
  subtitle: string;
}



export interface ApiPermissionType {
  identity: string;
  permissionCode: string;
  permissionName: string;
  description: string;
  isActive: boolean;
}

export interface ApiMasterRole {
  identity: string;
  roleName: string;
  roleCode: string;
  roleShortDesc: string | null;
  isSupervisory: boolean | null;
  businessDivisionCode: string | null;
  accessLevel: number | null;
  isActive: boolean;
}


export type SaveRolePayload = {
  userIdentity: string;
  roleIdentity: string;
  permissionIdentity: string;
  effectiveFrom: string;
  effectiveTo: string;
  isPrimary: boolean;
};
