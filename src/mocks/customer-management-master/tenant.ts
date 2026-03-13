import type { TenantType } from "@/types/customer-management/tenant";
import type { TenantAddressType } from "@/types/customer-management/tenant";

export const TENANT_DATA: TenantType[] = [
  {
    tenantName: "INCEDE",
    id: "",
    tenantCode: "",
    legalEntityName: "",
    tenantType: "",
    registrationNo: "",
    rbiRegistrationNumber: "",
    panNumber: "",
    gstNumber: "",
    cinNumber: "",
    contactNumber: "",
    website: "",
    businessEmail: "",
    chooseFile: null,
    tenantAddress: {
      addressType: "",
      streetLaneName: "",
      placeName: "",
      pinCode: undefined,
      country: "",
      state: "",
      district: "",
      postOffice: "",
      city: "",
      landmark: "",
      siteFactoryPremise: "",
      nameOfTheOwner: "",
      relationshipWithTenant: "",
      landlineNumber: "",
      timeZone: "",
    },
    attributes: [],
    isActive: true
  },
];

export const TENANT_ADDRESS_DATA: TenantAddressType[] = [
  {
    addressType: "",
    streetLaneName: "",
    placeName: "",
    pinCode: undefined,
    country: "",
    state: "",
    district: "",
    postOffice: "",
    city: "",
    landmark: "",
    siteFactoryPremise: "",
    nameOfTheOwner: "",
    relationshipWithTenant: "",
    landlineNumber: "",
    timeZone: "",
  },
];

export const TENANT_TYPE_OPTIONS = [
  { value: "nbfc", label: "NBFC" },
  { value: "bank", label: "BANK" },
  { value: "fintech", label: "FINTECH" },
  { value: "microfinance", label: "MICROFINANCE" },
  { value: "corporate", label: "CORPORATE" },

];

export const TENANT_ADDRESS_TYPE_OPTIONS = [
  { value: "registered office", label: "REGISTERED OFFICE" },
  { value: "corporate office", label: "CORPORATE OFFICE" },

  { value: "factory", label: "FACTORY" },

];

export const POST_OFFICE_OPTIONS = [
  { value: "DEMO1", label: "demo1" },
  { value: "DEMO2", label: "demo2" },

  { value: "DEMO3", label: "demo3" },

  { value: "DEMO4", label: "demo4" },
];

export const SITE_FACTORY_PREMISES_OPTIONS = [
  { value: "site", label: "SITE" },
  { value: "rented", label: "RENTED" },

  { value: "factory", label: "FACTORY" },

];

export const TIME_ZONE_OPTIONS = [
  { value: "DEMO1", label: "demo1" },
  { value: "DEMO2", label: "demo2" },

  { value: "DEMO3", label: "demo3" },

  { value: "DEMO4", label: "demo4" },
];