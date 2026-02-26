import type { Address } from "@/types/firm/firm-address.types";
import { AddressType, SiteType } from "@/types/firm/firm-address.types";

export const addressDefaultValues: Omit<Address, "addressType"> & {
  addressType: AddressType | "";
} = {
  addressType: "",
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
