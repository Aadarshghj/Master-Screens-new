import type { AddressTypeMaster } from "@/types/customer-management/address-type-master";


export const ADDRESS_TYPE_MASTER_SAMPLE_DATA: AddressTypeMaster[] = [
  {
    addressType: "Home Address",
    context: "Customer",
    isMandatory: true,
    isActive: true,
  },
  {
    addressType: "Office Address",
    context: "Employee",
    isMandatory: false,
    isActive: true,
  },
  {
    addressType: "Billing Address",
    context: "Customer",
    isMandatory: true,
    isActive: true,
  },
  {
    addressType: "Shipping Address",
    context: "Vendor",
    isMandatory: false,
    isActive: false,
  },
];

export const ADDRESS_TYPE_OPTIONS = [
  { label: "Home", value: "HOME" },
  { label: "Office", value: "OFFICE" },
  { label: "Billing", value: "BILLING" },
  { label: "Shipping", value: "SHIPPING" },
];