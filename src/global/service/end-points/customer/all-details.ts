/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@/api";
import { apiInstance } from "../../api-instance";

// Define the type for customer all details response
export interface CustomerAllDetails {
  customerId?: string | null;
  customerCode: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  displayName: string;
  dob: string;
  gender: string;
  maritalStatus: string;
  nationality?: string | null;
  taxCategory: string;
  occupation: string;
  employer: string;
  annualIncome: number;
  branchName: string;
  crmReferenceId: string;
  preferredLanguage?: string | null;
  mobileNumber: string;
  otpIsVerified: boolean;
  onboardingStatus: string;
  isFirm: boolean;
  isBusiness: boolean;
  isMinor: boolean;
  riskCategory?: string | null;
  customerCategory?: string | null;
  tenantCode: string;
  fatherName?: string;
  aadharNumber?: string;
  additionalInfo?: {
    employment?: any;
    referrals?: any;
    profileExtra?: any;
    assets?: any;
    additionalReferenceValues?: any;
  };
  addresses?: Array<{
    addressIdentity: string;
    addressType: string;
    doorNumber: string;
    addressLine1: string;
    addressLine2: string;
    landmark: string;
    placeName: string;
    city: string;
    district: string;
    state: string;
    country: string;
    pincode: string;
    postOffice: string;
    latitude: number;
    longitude: number;
    geoAccuracy: number;
    addressProofType: string;
    isActive: boolean;
    digipin: string;
  }>;
  customerPhotoResponseDtos?: Array<{
    firstname: string;
    photoId: number;
    photoRefId: number;
    capturedBy: string;
    latitude: number;
    longitude: number;
    captureTime: string;
    status: string;
    accuracy: number;
    captureDevice: string;
    locationDescription: string;
    filePath: string;
  }>;
  nomineeResponseDtos?: any[];
  bankAccountResponseDtos?: any[];
  contactResponseDtos?: Array<{
    contactType: string;
    contactDetails: string;
    isPrimary: boolean;
    isActive: boolean;
    isOptOutPromotionalNotification: boolean;
    contactIdentity?: string | null;
  }>;
  [key: string]: any; // Allow for additional properties
}

export const customerAllDetailsApiService = apiInstance.injectEndpoints({
  endpoints: build => ({
    getCustomerAllDetails: build.query<
      CustomerAllDetails,
      { customerId: string }
    >({
      query: ({ customerId }) => ({
        url: api.customer.getAllDetails({ customerId }),
        method: "GET",
      }),
      providesTags: (_result, _error, { customerId }) => [
        { type: "Customer", id: customerId },
        { type: "Customer", id: "LIST" },
      ],
    }),
  }),
});

export const { useGetCustomerAllDetailsQuery } = customerAllDetailsApiService;
