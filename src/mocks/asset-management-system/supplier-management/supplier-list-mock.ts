import  type { SupplierMasterType } from "@/types/asset-management-system/supplier-management/supplier-list";

export const SUPPLIER_MASTER_MOCK: SupplierMasterType[] = [
  {
    supplierName: "Dell India Pvt Ltd",
    tradeName: "Dell",
    panNumber: "PURPS3791W",
    gstin: "29ABCDE1234F1Z5",
    msmeNo: "UDYAM-KL-12-0012456",
    address: "Infopark Phase 1",
    city: "Kalamassery",
    state: "Kerala",
    country: "India",
    pincode: "682042",
    status: "ACTIVE",
    blacklisted: false,
  },
  {
    supplierName: "Lenovo Technologies",
    tradeName: "Lenovo",
    panNumber: "PQERT9362W",
    gstin: "32ABCDE4567G1Z2",
    msmeNo: "UDYAM-KL-12-0034589",
    address: "SmartCity Kochi",
    city: "Kakkanad",
    state: "Kerala",
    country: "India",
    pincode: "682030",
    status: "ACTIVE",
    blacklisted: false,
  },
  {
    supplierName: "HP India Pvt Ltd",
    tradeName: "HP",
    panNumber: "ABCDE1234F",
    gstin: "27ABCDE1234F1Z9",
    msmeNo: "UDYAM-MH-10-0045623",
    address: "Andheri East",
    city: "Mumbai",
    state: "Maharashtra",
    country: "India",
    pincode: "400069",
    status: "INACTIVE",
    blacklisted: true,
  },
];

export const STATUS_DROPDOWN = [
  {
    label: "All",
    value: "ALL",
  },
  {
    label: "Active",
    value: "ACTIVE",
  },
  {
    label: "Inactive",
    value: "INACTIVE",
  },
];


