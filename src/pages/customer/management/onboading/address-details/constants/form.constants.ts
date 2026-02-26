import type { AddressFormData } from "@/types/customer/address.types";

export const DEFAULT_ADDRESS_VALUES: AddressFormData = {
  addressType: "",
  addressTypeId: "",
  houseNo: "",
  isCommunicationSame: false,
  streetLane: "",
  placeName: "",
  pinCode: "",
  country: "India",
  state: "",
  district: "",
  postOfficeId: "",
  city: "",
  landmark: "",
  digPin: "",
  latitude: "",
  longitude: "",
  addressProofType: "",
  addressProofTypeId: "",
  uploadedDocuments: [],
  coordinates: { latitude: 0, longitude: 0 },
  isEnabled: true,
  selectedFile: null,
  dmsFileData: null,
  selectedPostOfficeId: "",
  isMapLoading: false,
  triggerPinCodeSearch: false,
};

export const REQUIRED_ADDRESS_FIELDS: (keyof AddressFormData)[] = [
  "addressType",
  "houseNo",
  "streetLane",
  "placeName",
  "pinCode",
  "country",
  "state",
  "district",
  "postOfficeId",
  "city",
];

export const ADDRESS_CONFIG = {
  DEFAULT_CITY: "Bangalore",
  DEFAULT_DISTRICT: "Bangalore Urban",
  DEFAULT_STATE: "Karnataka",
  DEFAULT_COUNTRY: "India",
  DEFAULT_CITY_ID: 101,
  DEFAULT_DISTRICT_ID: 10,
  DEFAULT_STATE_ID: 5,
  DEFAULT_COUNTRY_ID: 1,
  DEFAULT_PINCODE: 560001,
  DEFAULT_LATITUDE: 12.9716,
  DEFAULT_LONGITUDE: 77.5946,
  DEFAULT_GEO_ACCURACY: 5.5,
  DEFAULT_ADDRESS_PROOF_TYPE: "0667c120-8f31-4b97-8b00-85dc022b8c12",
  DEFAULT_CREATED_BY: 1,
  DEFAULT_UPDATED_BY: 1,
} as const;

export const ADDRESS_TYPE = {
  PERMANENT: "84a8e877-6a0e-4e8f-8243-89bc4c4a453b",
  COMMUNICATION: "316f27bc-f6cd-4cd7-884a-b0f6f70d586c",
};
