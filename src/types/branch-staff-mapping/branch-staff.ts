
export interface Branch {
  id: string;
  branchName: string;
  branchCode: string;
  
}


export interface AvailableStaff {
  id: string;
  staffName: string;
  staffCode:string;
}
export interface BranchStaffRequestDto
  extends Record<string, unknown> {
  branchIdentity: string;
  staffIdentity: string;
}

export interface BranchStaffResponseDto {
  identity: string;
  branchIdentity: string;
  branchName: string;
  staffIdentity: string;
  staffName: string;
  isActive: boolean;
}


export interface AssignedStaff {
  identity: string;
  staffName: string;
  staffIdentity:string,
  branchName:string;
  branchIdentity:string;
  status: "Active" | "Pending";
  isActive:boolean
}

export interface AvailableStaff {
  id: string;
  staffName: string;
  staffCode:string;
}

export interface BranchApiResponse {
  identity: string;
  branchName: string;
  branchCode: string;
  
}
export interface staffApiResponse {
  identity: string;
  staffName: string;
  staffCode: string;
  isActive: boolean;
}
export interface assignedStaffApiResponse {
  identity: string;        // mapping id
  branchIdentity: string;
  branchName: string;
  staffIdentity: string;   // staff id
  staffName: string;
  isActive: boolean;
}

