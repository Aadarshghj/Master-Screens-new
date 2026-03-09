export interface SupplierMasterType {
  supplierName: string;
  tradeName: string;
  panNumber: string;
  gstin: string;
  msmeNo: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  status: "" | "ACTIVE" | "INACTIVE";
  identity?: string;
  blacklisted: boolean;
}
export interface SupplierFormType {
  supplierName: string;
  tradeName: string;
  panNumber: string;
  gstin: string;
msmeNo: string | null | undefined;
  status: "" | "ACTIVE" | "INACTIVE";
}
export interface SupplierMasterRequestDto {
  supplierName: string;
  tradeName: string;
  panNumber: string;
  gstin: string;
  msmeNo: string;
  status: string;
}
export interface SupplierMasterResponseDto {
  supplierId: string;
  supplierName: string;
  tradeName: string;
  panNumber: string;
  gstin: string;
  msmeNo: string;
  status: string;
  identity: string;
}
export interface SupplierMasterFilter {
  supplierName?: string;
  tradeName?: string;
  panNumber?: string;
  gstin?: string;
  msmeNo?: string;
  status?: string;
}