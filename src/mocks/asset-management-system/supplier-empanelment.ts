import type {  SupplierSearchResult } from "@/types/asset-management-system/supplier-empanelment";

export const EMPANELMENT_TYPE_OPTIONS = [
  { value: "REGULAR", label: "Regular" },
  { value: "RATEWISE", label: "Rate Wise" }
]

export const ITEM_OPTIONS = [
  { value: "A4 100 gsm", label: "A4 100 GSM" },
  { value: "PRINTER", label: "Printer Cartridge" }
]
export const MODEL_OPTIONS = [
  { value: "JK_COPIER", label: "JK Copier" },
  { value: "B2B", label: "B2B" },
];
export const MOCK_SUPPLIERS: SupplierSearchResult[] = [
  {
    supplierName: "ABC Traders Pvt Ltd",
    tradeName: "ABC Traders",
    panNumber: "ABCDE1234F",
    gstNumber: "32ABCDE1234F1Z5",
    msmeRegistrationNo: "UDYAM-KL-12-0001234",
    address: "12 Industrial Estate, Kalamassery",
    city: "Kochi",
    state: "Kerala",
    country: "India",
    pincode: "682033"
  },
  {
    supplierName: "Global Supplies India Pvt Ltd",
    tradeName: "Global Supplies",
    panNumber: "PQRSX6789L",
    gstNumber: "32PQRSX6789L1Z2",
    msmeRegistrationNo: "UDYAM-KL-07-0005678",
    address: "45 MG Road, Ernakulam",
    city: "Kochi",
    state: "Kerala",
    country: "India",
    pincode: "682016"
  },
  {
    supplierName: "Prime Office Solutions",
    tradeName: "Prime Office",
    panNumber: "LMNOP4321K",
    gstNumber: "32LMNOP4321K1Z9",
    msmeRegistrationNo: "UDYAM-KL-11-0009988",
    address: "78 Business Park, Kakkanad",
    city: "Kochi",
    state: "Kerala",
    country: "India",
    pincode: "682030"
  },
  {
    supplierName: "Prime Office ",
    tradeName: "Prime Office SN2",
    panNumber: "LMNOP430DG",
    gstNumber: "32LMNOP43356GFHN",
    msmeRegistrationNo: "UDYAM-KL-11-034667",
    address: "78 Business Park, Kakkanad",
    city: "Kochi",
    state: "Kerala",
    country: "India",
    pincode: "682030"
  }
]