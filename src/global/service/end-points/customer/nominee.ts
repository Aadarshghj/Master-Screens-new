import type {
  NomineeData,
  NomineeResponse,
  CreateNomineeRequest,
  ShareValidationResponse,
  NomineeFormData,
  NomineeApiResponseData,
  NomineeListApiResponse,
} from "@/types/customer/nominee.types";
import { api } from "@/api";
import { apiInstance } from "../../api-instance";
import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@/global/store";
import { transformFormData } from "@/global/validation/customer/nominee-schema";

// Data transformation functions
const transformNomineeResponse = (
  response: NomineeApiResponseData
): NomineeData => {
  return {
    nomineeIdentity: response.nomineeIdentity || response.id || "",
    fullName: response.fullName || "",
    relationship: response.relationship || "",
    dob: response.dob || "",
    contactNumber: response.contactNumber || "",
    percentageShare: response.percentageShare || 0,
    isMinor: response.isMinor || false,
    guardianName: response.guardianName || "",
    guardianDob: response.guardianDob || "",
    guardianEmail: response.guardianEmail || "",
    guardianContactNumber: response.guardianContactNumber || "",
    isSameAddress: response.isSameAddress || false,
    addressTypeId: response.addressTypeId || "",
    doorNumber: response.doorNumber || "",
    addressLine1: response.addressLine1 || "",
    landmark: response.landmark || "",
    placeName: response.placeName || "",
    city: response.city || "",
    district: response.district || "",
    state: response.state || "",
    country: response.country || "India",
    pincode: response.pincode || "",
    postOfficeId: response.postOfficeId || "",
    latitude: response.latitude || "",
    longitude: response.longitude || "",
    digipin: response.digipin || "",
    createdAt: response.createdAt || "",
    updatedAt: response.updatedAt || "",
    docRefId: response.docRefId || "",
    filePath: response.filePath || "",
  };
};

const transformFormDataForSubmission = (
  data: NomineeFormData
): CreateNomineeRequest => {
  const transformedData = transformFormData(data);

  return {
    fullName: transformedData.fullName?.toUpperCase(),
    relationship: transformedData.relationship,
    dob: transformedData.dob,
    contactNumber: transformedData.contactNumber,
    percentageShare: transformedData.percentageShare,
    isMinor: transformedData.isMinor,
    guardianName: transformedData.guardianName?.toUpperCase(),
    guardianDob: transformedData.guardianDob,
    guardianEmail: transformedData.guardianEmail,
    guardianContactNumber: transformedData.guardianContactNumber,
    isSameAddress: transformedData.isSameAddress,
    addressTypeId: transformedData.addressTypeId,
    doorNumber: transformedData.doorNumber?.toUpperCase(),
    addressLine1: transformedData.addressLine1?.toUpperCase(),
    landmark: transformedData.landmark?.toUpperCase(),
    placeName: transformedData.placeName?.toUpperCase(),
    city: transformedData.city?.toUpperCase(),
    district: transformedData.district,
    state: transformedData.state,
    country: transformedData.country,
    pincode: transformedData.pincode,
    postOfficeId: transformedData.postOfficeId,
    latitude: transformedData.latitude,
    longitude: transformedData.longitude,
    digipin: transformedData.digipin,
    filePath: transformedData.filePath,
    docRefId: transformedData.docRefId,
  };
};

export const nomineeApiService = apiInstance.injectEndpoints({
  endpoints: build => ({
    getNominees: build.query<NomineeData[], string>({
      query: customerId => ({
        url: api.customer.getNominees({ customerId }),
        method: "GET",
      }),
      transformResponse: (
        response: NomineeListApiResponse | NomineeApiResponseData[]
      ) => {
        let nominees: NomineeApiResponseData[] = [];

        // Handle the new API response structure
        if (Array.isArray(response)) {
          nominees = response;
        } else if (response && typeof response === "object") {
          if (
            "nominees" in response &&
            response.nominees &&
            Array.isArray(response.nominees)
          ) {
            nominees = response.nominees;
          } else if (
            "data" in response &&
            response.data &&
            Array.isArray(response.data)
          ) {
            nominees = response.data;
          }
        }

        // Transform each nominee
        return nominees.map(transformNomineeResponse);
      },
      providesTags: (_result, _error, customerId) => [
        { type: "Nominee", id: customerId },
        { type: "Nominee", id: "LIST" },
      ],
      keepUnusedDataFor: 300, // 5 minutes cache
    }),

    getActiveNominees: build.query<NomineeData[], string>({
      query: customerId => ({
        url: api.customer.getActiveNominees({ customerId }),
        method: "GET",
      }),
      providesTags: (_result, _error, customerId) => [
        { type: "Nominee", id: customerId },
      ],
    }),

    getNomineeById: build.query<
      NomineeData,
      { customerId: string; nomineeId: string }
    >({
      query: ({ customerId, nomineeId }) => ({
        url: api.customer.getNomineeById({ customerId, nomineeId }),
        method: "GET",
      }),
    }),

    createNominee: build.mutation<
      NomineeResponse,
      { customerId: string; payload: NomineeFormData }
    >({
      query: ({ customerId, payload }) => ({
        url: api.customer.createNominee({ customerId }),
        method: "POST",
        data: transformFormDataForSubmission(payload),
      }),
      invalidatesTags: (_result, _error, { customerId }) => [
        { type: "Nominee", id: customerId },
        { type: "Nominee", id: "LIST" },
      ],
    }),

    updateNominee: build.mutation<
      NomineeResponse,
      { customerId: string; nomineeId: string; payload: NomineeFormData }
    >({
      query: ({ customerId, nomineeId, payload }) => ({
        url: api.customer.updateNominee({ customerId, nomineeId }),
        method: "PUT",
        data: transformFormDataForSubmission(payload),
      }),
      invalidatesTags: (_result, _error, { customerId, nomineeId }) => [
        { type: "Nominee", id: customerId },
        { type: "Nominee", id: nomineeId },
        { type: "Nominee", id: "LIST" },
      ],
    }),

    deleteNominee: build.mutation<
      { message: string },
      { customerId: string; nomineeId: string; updatedBy: string }
    >({
      query: ({ customerId, nomineeId, updatedBy }) => ({
        url: api.customer.deleteNominee({ customerId, nomineeId }),
        method: "DELETE",
        params: { updatedBy },
      }),
      invalidatesTags: (_result, _error, { customerId, nomineeId }) => [
        { type: "Nominee", id: customerId },
        { type: "Nominee", id: nomineeId },
        { type: "Nominee", id: "LIST" },
      ],
    }),

    validateNomineeShare: build.mutation<
      ShareValidationResponse,
      { customerId: string; percentageShare: number; excludeNomineeId?: string }
    >({
      query: ({ customerId, percentageShare, excludeNomineeId }) => ({
        url: api.customer.validateNomineeShare({ customerId }),
        method: "POST",
        data: { percentageShare, excludeNomineeId },
      }),
    }),
  }),
});

export const {
  useGetNomineesQuery,
  useGetActiveNomineesQuery,
  useGetNomineeByIdQuery,
  useCreateNomineeMutation,
  useUpdateNomineeMutation,
  useDeleteNomineeMutation,
  useValidateNomineeShareMutation,
} = nomineeApiService;

// Selectors for derived data
export const selectNominees = createSelector(
  [
    (state: RootState) =>
      nomineeApiService.endpoints.getNominees.select("")(state),
  ],
  nomineesQuery => {
    const nominees = nomineesQuery.data as NomineeData[];
    return nominees || [];
  }
);

export const selectNomineeFormData = createSelector(
  [
    (state: RootState) =>
      nomineeApiService.endpoints.getNomineeById.select({
        customerId: "",
        nomineeId: "",
      })(state),
  ],
  nomineeQuery => {
    const nominee = nomineeQuery.data as NomineeData;
    if (!nominee) return null;

    return {
      fullName: nominee.fullName || "",
      relationship: nominee.relationship || "",
      dob: nominee.dob || "",
      contactNumber: nominee.contactNumber || "",
      percentageShare: nominee.percentageShare || 0,
      isMinor: nominee.isMinor || false,
      guardianName: nominee.guardianName || "",
      guardianDob: nominee.guardianDob || "",
      guardianEmail: nominee.guardianEmail || "",
      guardianContactNumber: nominee.guardianContactNumber || "",
      isSameAddress: nominee.isSameAddress || false,
      addressTypeId: nominee.addressTypeId || "",
      doorNumber: nominee.doorNumber || "",
      addressLine1: nominee.addressLine1 || "",
      landmark: nominee.landmark || "",
      placeName: nominee.placeName || "",
      city: nominee.city || "",
      district: nominee.district || "",
      state: nominee.state || "",
      country: nominee.country || "India",
      pincode: nominee.pincode || "",
      postOfficeId: nominee.postOfficeId || "",
      latitude: nominee.latitude || "",
      longitude: nominee.longitude || "",
      digipin: nominee.digipin || "",
    };
  }
);
