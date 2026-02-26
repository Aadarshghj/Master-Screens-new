export type AccessType = "Read" | "Write" | "Full";

export interface DesignationProfile {
  id: string;
  name: string;
  empId: string;
  department: string;
  initial: string;
  color: string;
  assignedCount: number;
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
