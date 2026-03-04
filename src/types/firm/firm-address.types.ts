// address-details.types.ts

export const AddressType = {
  REGISTERED_OFFICE: "Registered Office",
  CORPORATE_OFFICE: "Corporate Office",
  BRANCH_OFFICE: "Branch Office",
  FACTORY: "Factory",
  WAREHOUSE: "Warehouse",
} as const;

export type AddressType = (typeof AddressType)[keyof typeof AddressType];

export const SiteType = {
  RENTED: "Rented",
  OWNED: "Owned",
  LEASED: "Leased",
} as const;

export type SiteType = (typeof SiteType)[keyof typeof SiteType];
export interface Address {
  addressType: AddressType;
  streetLaneName: string;
  placeName: string;
  pinCode: string;
  country: string;
  state: string;
  district: string;
  postOffice: string;
  city: string;
  landmark: string;
  latitude: string;
  longitude: string;
  siteType: SiteType;
  ownerName: string;
  relationshipWithFirm: string;
  landlineNumber: string;
  mobileNumber: string;
  emailId: string;
  addressId?: string;
  isPrimary?: boolean;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  digiPin?: string;
}
export interface AddressErrors {
  addressType?: string;
  streetLaneName?: string;
  placeName?: string;
  pinCode?: string;
  country?: string;
  state?: string;
  district?: string;
  postOffice?: string;
  city?: string;
  landmark?: string;
  latitude?: string;
  longitude?: string;
  siteType?: string;
  ownerName?: string;
  relationshipWithFirm?: string;
  landlineNumber?: string;
  mobileNumber?: string;
  emailId?: string;
}

export interface AddressFormState {
  data: Address;
  errors: AddressErrors;
  isSubmitting: boolean;
  isValid: boolean;
  isDirty: boolean;
  selectedAddressType: AddressType | null;
}
export interface DropdownOption<T = string> {
  label: string;
  value: T;
}

export type AddressFieldChangeHandler = <K extends keyof Address>(
  field: K,
  value: Address[K]
) => void;
export interface LocationCoordinates {
  latitude: string;
  longitude: string;
}

export interface PinCodeLookupResult {
  country: string;
  state: string;
  district: string;
  postOffice: string;
  city: string;
}

export interface LocationOperations {
  fetchLocationByPinCode: (pinCode: string) => Promise<PinCodeLookupResult>;
  getCurrentLocation: () => Promise<LocationCoordinates>;
  generateDigiPin: () => string;
}

export interface SaveAddressRequest {
  address: Address;
  firmId?: string;
  customerId?: string;
}

export interface SaveAddressResponse {
  success: boolean;
  message: string;
  addressId?: string;
  errors?: AddressErrors;
}

export interface GetAddressRequest {
  addressId: string;
}

export interface GetAddressResponse {
  success: boolean;
  data?: Address;
  message?: string;
}

export interface GetAddressesByTypeRequest {
  addressType: AddressType;
  firmId?: string;
}

export interface GetAddressesByTypeResponse {
  success: boolean;
  addresses: Address[];
  total: number;
}

export interface DeleteAddressRequest {
  addressId: string;
}

export interface DeleteAddressResponse {
  success: boolean;
  message: string;
}
export interface AddressDetailsScreenProps {
  firmId?: string;
  customerId?: string;
  addressId?: string;
  onSave?: (address: Address) => void;
  onCancel?: () => void;
  mode?: "create" | "edit" | "view";
}

export interface AddressFormProps {
  formData: Address;
  errors: AddressErrors;
  onChange: AddressFieldChangeHandler;
  onSave: () => void;
  onReset: () => void;
  isLoading?: boolean;
  mode?: "create" | "edit" | "view";
}

export interface AddressCardProps {
  address: Address;
  onEdit?: (addressId: string) => void;
  onDelete?: (addressId: string) => void;
  isEditable?: boolean;
}

export interface AddressListProps {
  addresses: Address[];
  selectedAddressType: AddressType | null;
  onAddressTypeChange: (type: AddressType) => void;
  onEdit: (addressId: string) => void;
  onDelete: (addressId: string) => void;
}

export interface LocationInputProps {
  latitude: string;
  longitude: string;
  onLatitudeChange: (value: string) => void;
  onLongitudeChange: (value: string) => void;
  onFetchLocation: () => void;
  isLoading?: boolean;
}
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: unknown) => string | undefined;
}

export interface FieldConfig {
  name: keyof Address;
  label: string;
  type: "text" | "select" | "search" | "email" | "tel" | "number";
  placeholder?: string;
  required?: boolean;
  validation?: ValidationRule;
  options?: DropdownOption[];
  disabled?: boolean;
}
export const defaultAddress: Address = {
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
export interface NavigationAction {
  type: "previous" | "next" | "save" | "reset";
}

export interface NavigationState {
  canGoBack: boolean;
  canGoNext: boolean;
  currentStep?: number;
  totalSteps?: number;
}
export const isAddressComplete = (
  address: Partial<Address>
): address is Address => {
  return !!(
    address.addressType &&
    address.streetLaneName &&
    address.pinCode &&
    address.country &&
    address.state &&
    address.city
  );
};
export type AddressSummary = Pick<
  Address,
  "addressId" | "addressType" | "streetLaneName" | "city" | "state" | "pinCode"
>;
