import type { DesignationType } from "@/types/customer-management/designation";

export const DESIGNATION_SAMPLE_DATA: DesignationType[] = [
  {
    designationName: "Manager",
    designationCode: "MGR",
    level: "L3",
    occupation: "Operations",
    description: "Responsible for managing daily operations",
    managerial: true,
  },
  {
    designationName: "Senior Software Engineer",
    designationCode: "SSE",
    level: "L4",
    occupation: "Engineering",
    description: "Leads development and mentors junior engineers",
    managerial: false,
  },
  {
    designationName: "HR Executive",
    designationCode: "HRE",
    level: "L2",
    occupation: "Human Resources",
    description: "Handles recruitment and employee relations",
    managerial: false,
  },
  {
    designationName: "Team Lead",
    designationCode: "TL",
    level: "L3",
    occupation: "Engineering",
    description: "Coordinates team tasks and delivery",
    managerial: true,
  },
  {
    designationName: "Accountant",
    designationCode: "ACC",
    level: "L2",
    occupation: "Finance",
    description: "Manages accounts and financial reporting",
    managerial: false,
  },
];
