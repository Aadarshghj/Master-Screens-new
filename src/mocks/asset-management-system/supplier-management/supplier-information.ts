
import type { SupplierContactManagementType } from "@/types/asset-management-system/supplier-management/supplier-information";

export const SUPPLIER_RISK_CATEGORY_OPTIONS = [
  { value: "CATEGORY 1", label: "CATEGORY 1" },
  { value: "CATEGORY 2", label: "CATEGORY 2" },
];
export const GST_REGISTRATION_TYPE_OPTIONS = [
  { value: "REGISTERED", label: "REGISTERED" },
  { value: "UNREGISTERED", label: "UNREGISTERED" },
];
export const MSME_TYPE_OPTIONS = [
  { value: "TYPE 1", label: "TYPE 1" },
  { value: "TYPE 2", label: "TYPE 2" },
];
export const CONTACT_TYPE_OPTIONS = [
  { value: "TYPE 1", label: "TYPE 1" },
  { value: "TYPE 2", label: "TYPE 2" },
];

export const supplierContactMock: SupplierContactManagementType[] = [
  {
    contactType: "Mobile",
    contactValue: "9876543210",
    isActive: true,
    isPrimary: true,
  },
  {
    contactType: "Email",
    contactValue: "supplier@gmail.com",
    isActive: true,
    isPrimary: false,
  },
  {
    contactType: "Phone",
    contactValue: "0484-2233445",
    isActive: false,
    isPrimary: false,
  },
];

import type { SupplierAssetGroupType } from "@/types/asset-management-system/supplier-management/supplier-information";

export const supplierAssetGroupMock: SupplierAssetGroupType[] = [
  {
    assetGroup: "IT Assets",
    isActive: true,
  },
  {
    assetGroup: "Office Furniture",
    isActive: true,
  },
];