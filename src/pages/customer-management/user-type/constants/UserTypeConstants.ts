import type { UserType } from "@/types/customer-management/user-type";

export const DEFAULT_USER_TYPE: UserType = {
  userTypeIdentity: "",
  userTypeCode: "",
  userTypeName: "",
  userTypeDesc: "",
  isAdmin: false,
  isActive: true,
};

export const generateUserTypeCode = (existingCodes: string[]): string => {
  const prefix = "USR";
  let counter = existingCodes.length + 1;
  let code = `${prefix}${String(counter).padStart(3, "0")}`;
  while (existingCodes.includes(code)) {
    counter++;
    code = `${prefix}${String(counter).padStart(3, "0")}`;
  }
  return code;
};

export const MOCK_USER_TYPES: UserType[] = [
  {
    userTypeIdentity: "1",
    userTypeCode: "USR001",
    userTypeName: "SUPER ADMIN",
    userTypeDesc: "FULL SYSTEM ACCESS WITH ALL PRIVILEGES",
    isAdmin: true,
    isActive: true,
  },
  {
    userTypeIdentity: "2",
    userTypeCode: "USR002",
    userTypeName: "BRANCH MANAGER",
    userTypeDesc: "MANAGES BRANCH LEVEL OPERATIONS",
    isAdmin: true,
    isActive: true,
  },
  {
    userTypeIdentity: "3",
    userTypeCode: "USR003",
    userTypeName: "TELLER",
    userTypeDesc: "HANDLES CUSTOMER TRANSACTIONS",
    isAdmin: false,
    isActive: true,
  },
  {
    userTypeIdentity: "4",
    userTypeCode: "USR004",
    userTypeName: "LOAN OFFICER",
    userTypeDesc: "PROCESSES AND APPROVES LOAN APPLICATIONS",
    isAdmin: false,
    isActive: true,
  },
  {
    userTypeIdentity: "5",
    userTypeCode: "USR005",
    userTypeName: "AUDITOR",
    userTypeDesc: "READ ONLY ACCESS FOR AUDIT PURPOSES",
    isAdmin: false,
    isActive: false,
  },
  {
    userTypeIdentity: "6",
    userTypeCode: "USR006",
    userTypeName: "CUSTOMER SERVICE",
    userTypeDesc: "HANDLES CUSTOMER QUERIES AND COMPLAINTS",
    isAdmin: false,
    isActive: true,
  },
];
