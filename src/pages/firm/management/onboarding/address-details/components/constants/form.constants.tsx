import type {
  Address,
  AddressFormState,
  LocationCoordinates,
  PinCodeLookupResult,
} from "@/types/firm/firm-address.types";
import { AddressType, SiteType } from "@/types/firm/firm-address.types";

export const addressDefaultValues: Address = {
  addressType: AddressType.REGISTERED_OFFICE,
  streetLaneName: "",
  placeName: "",
  pinCode: "",
  country: "",
  state: "",
  district: "",
  postOffice: "",
  city: "",
  landmark: "",
  digiPin: "",
  latitude: "",
  longitude: "",
  siteType: SiteType.RENTED,
  ownerName: "",
  relationshipWithFirm: "",
  landlineNumber: "",
  mobileNumber: "",
  emailId: "",
  isPrimary: false,
  isActive: true,
};

export const addressFormStateDefaultValues: AddressFormState = {
  data: addressDefaultValues,
  errors: {},
  isSubmitting: false,
  isValid: false,
  isDirty: false,
  selectedAddressType: null,
};

export const locationDefaultValues: LocationCoordinates = {
  latitude: "",
  longitude: "",
};

export const pinCodeLookupDefaultValues: PinCodeLookupResult = {
  country: "",
  state: "",
  district: "",
  postOffice: "",
  city: "",
};
export const addressFormMeta = {
  requiredFields: [
    "addressType",
    "streetLaneName",
    "pinCode",
    "country",
    "state",
    "city",
  ],

  recommendedFields: [
    "placeName",
    "district",
    "postOffice",
    "landmark",
    "ownerName",
    "mobileNumber",
  ],

  autoPopulatedFields: [
    "country",
    "state",
    "district",
    "postOffice",
    "city",
    "digiPin",
  ],

  locationFields: ["latitude", "longitude"],

  pinCodeDependentFields: [
    "country",
    "state",
    "district",
    "postOffice",
    "city",
  ],

  defaultAddressType: AddressType.REGISTERED_OFFICE,
  defaultSiteType: SiteType.RENTED,
  defaultCountry: "India",
};
export const addressFieldLengths = {
  streetLaneName: { min: 5, max: 200 },
  placeName: { min: 3, max: 100 },
  pinCode: { exact: 6 },
  city: { min: 2, max: 100 },
  landmark: { min: 3, max: 150 },
  ownerName: { min: 3, max: 100 },
  relationshipWithFirm: { min: 3, max: 100 },
  landlineNumber: { min: 10, max: 15 },
  mobileNumber: { exact: 10 },
  emailId: { min: 5, max: 100 },
  digiPin: { exact: 12 },
};

export const addressFieldPlaceholders = {
  addressType: "Select Address Type",
  streetLaneName: "Enter Street/Lane Name",
  placeName: "Enter Place Name",
  pinCode: "Enter 6-digit PIN Code",
  country: "Auto-fetch from PIN Code",
  state: "Auto-fetch from PIN Code",
  district: "Auto-fetch from PIN Code",
  postOffice: "Select Post Office",
  city: "Enter the city ",
  landmark: "Enter Landmark",
  latitude: "Latitude",
  longitude: "Longitude",
  siteType: "Select Site Type",
  ownerName: "Enter Owner Name",
  relationshipWithFirm: "Enter Relationship with Firm",
  landlineNumber: "Enter Landline Number",
  mobileNumber: "Enter 10-digit Mobile Number",
  emailId: "Enter Email ID",
  digiPin: "Auto generated unique pin",
};

export const addressFieldLabels = {
  addressType: "Address Type",
  streetLaneName: "Street/Lane Name",
  placeName: "Place Name",
  pinCode: "PIN Code",
  country: "Country",
  state: "State",
  district: "District",
  postOffice: "Post Office",
  city: "City",
  landmark: "Landmark",
  digiPin: "Digi Pin",
  latitude: "Latitude",
  longitude: "Longitude",
  siteType: "Site/Factory Premise",
  ownerName: "Name of the Owner",
  relationshipWithFirm: "Relationship with Firm",
  landlineNumber: "Landline Number",
  mobileNumber: "Mobile Number",
  emailId: "Email ID",
};
export const addressValidationPatterns = {
  pinCode: /^\d{6}$/,
  mobileNumber: /^[6-9]\d{9}$/,
  landlineNumber: /^[0-9]{2,4}-?[0-9]{6,8}$/,
  emailId: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  latitude: /^-?([0-8]?[0-9]|90)(\.[0-9]{1,10})?$/,
  longitude: /^-?([0-9]{1,2}|1[0-7][0-9]|180)(\.[0-9]{1,10})?$/,
  digiPin: /^[A-Z0-9]{12}$/,
  addressField: /^(?=.*[a-zA-Z])[a-zA-Z0-9\s.,]+$/,
};

export const addressErrorMessages = {
  required: (fieldName: string) => `${fieldName} is required`,
  invalidFormat: (fieldName: string) => `Invalid ${fieldName} format`,
  minLength: (fieldName: string, min: number) =>
    `${fieldName} must be at least ${min} characters`,
  maxLength: (fieldName: string, max: number) =>
    `${fieldName} must not exceed ${max} characters`,
  exactLength: (fieldName: string, length: number) =>
    `${fieldName} must be exactly ${length} characters`,

  invalidPinCode: "PIN Code must be a valid 6-digit number",
  invalidMobileNumber:
    "Mobile number must be a valid 10-digit number starting with 6-9",
  invalidLandlineNumber: "Invalid landline number format",
  invalidEmail: "Invalid email address format",
  invalidLatitude: "Latitude must be between -90 and 90",
  invalidLongitude: "Longitude must be between -180 and 180",
  invalidAddressField:
    "Address must contain letters and can only include letters, numbers, spaces, and symbols (. , - /)",

  pinCodeNotFound: "No data found for this PIN Code",
  locationFetchFailed: "Failed to fetch current location",
  saveAddressFailed: "Failed to save address details",

  formIncomplete: "Please fill all required fields",
  duplicateAddress: "An address of this type already exists",
};

export const addressSearchFilterDefaultValues = {
  addressType: "all",
  city: "",
  state: "",
  pinCode: "",
  isActive: true,
};

export const addressListFilterOptions = {
  addressTypes: ["all", ...Object.values(AddressType)],
  siteTypes: ["all", ...Object.values(SiteType)],
  sortBy: ["recent", "type", "city", "pinCode"],
  sortOrder: ["asc", "desc"],
};
export const addressUIConstants = {
  maxAddressesPerType: 5,
  pinCodeDebounceDelay: 500,
  locationFetchTimeout: 10000,

  cardTruncateLength: 50,
  showEditButton: true,
  showDeleteButton: true,
  autoSaveDelay: 2000, // ms
  showValidationOnBlur: true,
  showValidationOnSubmit: true,
};

export const addressAPIEndpoints = {
  saveAddress: "/api/address/save",
  getAddress: "/api/address/get",
  deleteAddress: "/api/address/delete",
  getAddressesByType: "/api/address/list",
  lookupPinCode: "/api/location/pincode-lookup",
  getCurrentLocation: "/api/location/current",
  generateDigiPin: "/api/location/generate-digipin",
};

export const addressStorageKeys = {
  draftAddress: "address_draft",
  lastUsedAddressType: "address_last_type",
  savedLocations: "address_saved_locations",
  recentPinCodes: "address_recent_pincodes",
};

export const addressNavigationSteps = {
  steps: [
    { id: "firm-customer", label: "Firm Customer Details" },
    { id: "business-info", label: "Business Information" },
    { id: "bank-account", label: "Bank Account Details" },
    { id: "address-details", label: "Address Details" },
    { id: "document-upload", label: "Document Upload" },
  ],
  currentStepIndex: 3,
};

export const addressHelpers = {
  formatAddress: (address: Address): string => {
    const parts = [
      address.streetLaneName,
      address.placeName,
      address.landmark,
      address.city,
      address.district,
      address.state,
      address.country,
      address.pinCode,
    ].filter(Boolean);

    return parts.join(", ");
  },

  generateDigiPin: (): string => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let pin = "";
    for (let i = 0; i < 12; i++) {
      pin += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return pin;
  },

  isValidPinCode: (pinCode: string): boolean => {
    return addressValidationPatterns.pinCode.test(pinCode);
  },

  formatMobileNumber: (mobile: string): string => {
    const cleaned = mobile.replace(/\D/g, "");
    if (cleaned.length === 10) {
      return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
    }
    return mobile;
  },
};

export const isCompleteAddress = (
  address: Partial<Address>
): address is Address => {
  return addressFormMeta.requiredFields.every(
    field =>
      address[field as keyof Address] !== undefined &&
      address[field as keyof Address] !== ""
  );
};

export const hasLocationData = (address: Address): boolean => {
  return !!(address.latitude && address.longitude);
};

export const isPrimaryAddress = (address: Address): boolean => {
  return address.isPrimary === true;
};
