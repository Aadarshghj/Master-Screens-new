import type {  empanelItemOption, SupplierSearchResult } from "@/types/asset-management-system/supplier-empanelment";

export const MOCK_ITEM_NAMES: empanelItemOption[] = [
  { label: "A4 100 GSM Paper", value: "A4_100_GSM" },
  { label: "A4 80 GSM Paper", value: "A4_80_GSM" },
];
export const MOCK_MODELS: empanelItemOption[] = [
  { label: "Dell", value: "DELL" },
  { label: "HP", value: "HP" },
];
export const MOCK_SUPPLIERS: SupplierSearchResult[] = [
  {
    supplierName: "ABC Traders",
    tradeName: "ABC",
    panNumber: "ABCDE1234F",
    gstNumber: "32ABCDE1234F1Z5"
  },
  {
    supplierName: "Global Supplies",
    tradeName: "Global",
    panNumber: "PQRSX6789L",
    gstNumber: "32PQRSX6789L1Z2"
  }
]