import type { PurchaseReqItemRow } from "@/types/asset-mgmt/purchase-req";

export const MOCK_REQ_ITEM_LIST: PurchaseReqItemRow[] = [
  {
    id: 1,
    itemName: "Laptop",
    requestedOffice: "152 - Kalamassery",
    desc: "Need a laptop for the new employee onboarding",
    priority: "High",
    modelManufacturer: "Dell - Inspiron 15",
    quantity: 2,
    unit: "NOS",
    estimatedAmount: 150000,
    requestDate: "03-02-2026",
    requestedBy: "13409 - Rahul Rajan",
  },
  {
    id: 2,
    itemName: "Desktop",
    requestedOffice: "152 - Kalamassery",
    desc: "New desktop for branch operations",
    priority: "High",
    modelManufacturer: "HP - ProDesk 400",
    quantity: 1,
    unit: "NOS",
    estimatedAmount: 50000,
    requestDate: "03-02-2026",
    requestedBy: "13409 - Rahul Rajan",
  },
  {
    id: 3,
    itemName: "Printer",
    requestedOffice: "101 - MG Road",
    desc: "Laser printer for documentation",
    priority: "Normal",
    modelManufacturer: "Canon - LBP2900",
    quantity: 1,
    unit: "NOS",
    estimatedAmount: 12000,
    requestDate: "28-01-2026",
    requestedBy: "14021 - Arjun Nair",
  },
  {
    id: 4,
    itemName: "UPS",
    requestedOffice: "110 - Aluva",
    desc: "1KVA UPS backup for systems",
    priority: "Normal",
    modelManufacturer: "APC - BX1100C",
    quantity: 3,
    unit: "NOS",
    estimatedAmount: 24000,
    requestDate: "25-01-2026",
    requestedBy: "14567 - Maria Thomas",
  },
];

export const MOCK_LOGGED_IN_USER = {
  employeeId: "13409",
  employeeName: "Rahul Rajan",
  officeId: "152",
  officeName: "Kalamassery",
};

export const MOCK_ITEMS = [
  { id: "LAPTOP", name: "Laptop", assetGroup: "COMPUTER", assetType: "IT", unit: "NOS" },
  { id: "DESKTOP", name: "Desktop", assetGroup: "COMPUTER", assetType: "IT", unit: "NOS" },
  { id: "PRINTER", name: "Printer", assetGroup: "OFFICE", assetType: "FIXED", unit: "NOS" },
];