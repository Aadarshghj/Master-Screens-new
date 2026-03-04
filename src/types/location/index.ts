export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface LocationData {
  latitude: string;
  longitude: string;
  locationDescription: string;
  accuracy?: string;
}

export interface AddressComponents {
  houseNumber?: string;
  road?: string;
  suburb?: string;
  village?: string;
  town?: string;
  city?: string;
  state?: string;
  country?: string;
}

export interface ReverseGeocodeResult {
  address: string;
  city: string;
  state: string;
  country: string;
  formattedAddress: string;
}
