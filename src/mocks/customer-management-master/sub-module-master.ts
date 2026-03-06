import type { SubModule } from "@/types/customer-management/sub-module-management-type";

export const SUB_MODULE_SAMPLE_DATA: SubModule[] = [
  {
    module: "Customer Management",
    subModuleCode: "CUST",
    subModuleName: "Customer Onboarding",
    subModuleDescription: "Fixed Asset",
    isActive: true,
  },
  {
    module: "Customer Management",
    subModuleCode: "KYC01",
    subModuleName: "KYC Verification",
    subModuleDescription: "Handles customer identity verification process",
    isActive: true,
  },
  {
    module: "Customer Management",
    subModuleCode: "CUSTUPD",
    subModuleName: "Customer Profile Update",
    subModuleDescription: "Manage updates to customer personal and contact details",
    isActive: true,
  },
  {
    module: "Customer Management",
    subModuleCode: "CUSTDOC",
    subModuleName: "Customer Document Management",
    subModuleDescription: "Upload and manage customer documents",
    isActive: false,
  },
];



export const Module_CODE_OPTIONS = [
  { value: "1", label: "Customer Management" },
  { value: "2", label: "CUSTOMER" },
  { value: "3", label: "STAFF" },
];