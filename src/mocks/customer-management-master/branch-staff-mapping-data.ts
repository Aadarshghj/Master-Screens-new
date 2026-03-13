import type { AvailableStaff, Branch } from "@/types/customer-management/branch-staff";

export const MOCK_BRANCH: Branch[] = [
  {
    id: "b1",
    branchName: "Kakkanad - Info",
    branchCode: "B-001",
    adminUnitTypeIdentity: " ",
    adminUnitTypeName:""
  },
  {
    id: "b2",
    branchName: "Edappally - Info",
    branchCode: "B-002",
    adminUnitTypeIdentity: " ",
     adminUnitTypeName:""
  },
  {
    id: "b3",
    branchName: "Fort Kochi - Info",
    branchCode: "B-003",
    adminUnitTypeIdentity: " ",
     adminUnitTypeName:""
  },
  {
    id: "b4",
    branchName: "Aluva - Info",
    branchCode: "B-004",
    adminUnitTypeIdentity: " ",
     adminUnitTypeName:""
  },
  {
    id: "b5",
    branchName: "Vyttila - Info",
    branchCode: "B-005",
    adminUnitTypeIdentity: " ",
     adminUnitTypeName:""
  },
];

export const AVAILABLE_STAFF: AvailableStaff[] = [
  { id: "S1", staffName: "Anusree", staffCode: "QW12" },
  { id: "S2", staffName: "Uthra", staffCode: "QW123" },
  { id: "S3", staffName: "Christeena", staffCode: "QW124" },
];