import type { AvailableStaff, Branch } from "@/types/branch-staff-mapping/branch-staff";

export const MOCK_BRANCH: Branch[] = [
  {
    id: "b1",
    branchName: "kakkanad- info",
    code: "B-001",
    level:1,
    description: "Kakkanad Infopark",
    isActive:true,
    isManagerial:true,
    color: "bg-red-600",
    assignedStaffCount: 0,
  },
  {
  id: "b2",
  branchName: "Edappally - info",
  code: "B-002",
  level: 1,
  description: "Edappally Information Center",
  isActive: true,
  isManagerial: true,
  color: "bg-blue-600",
  assignedStaffCount: 0,
},
{
  id: "b3",
  branchName: "Fort Kochi - info",
  code: "B-003",
  level: 2,
  description: "Fort Kochi Branch Office",
  isActive: true,
  isManagerial: true,
  color: "bg-green-600",
  assignedStaffCount: 0,
},
{
  id: "b4",
  branchName: "Aluva-info",
  code: "B-004",
  level: 2,
  description: "Aluva Regional Center",
  isActive: true,
  isManagerial: true,
  color: "bg-yellow-600",
  assignedStaffCount: 0,
},
{
  id: "b5",
  branchName: "Vyttila - info",
  code: "B-005",
  level: 3,
  description: "Vyttila City Office",
  isActive: true,
  isManagerial: true,
  color: "bg-purple-600",
  assignedStaffCount: 0,
}
];

export const AVAILABLE_STAFF: AvailableStaff[] = [
  { id: "S1", name: "Anusree", designation:"Administrative Officer",empCode:"emp001" },
  { id: "S2", name: "Arjun Nair", designation: "Branch Manager", empCode: "emp002" },
  { id: "S3", name: "Meera Joseph", designation: "Customer Support Executive", empCode: "emp003" },
  { id: "S4", name: "Rahul Menon", designation: "Operations Coordinator", empCode: "emp004" },
  { id: "S5", name: "Divya Krishnan", designation: "HR Executive", empCode: "emp005" },
];
