import { apiInstance } from "../../api-instance";
import { api } from "@/api";
import { customer } from "@/api/customer/customer.api";
import type {
  AddressCaptureResponse,
  // ApiResponse,
  AddressApiResponse,
  SaveAddressRequest,
  UpdateAddressRequest,
  DeleteAddressRequest,
} from "@/types/customer/address.types";
import type { Address, DropdownOption } from "@/types/firm/firm-address.types";

interface MasterDataOption {
  id: number;
  name: string;
  identity?: string;
}

interface PostOfficeResponse {
  id: number;
  name: string;
  pincode: string;
}

interface LocationResponse {
  country: string;
  state: string;
  district: string;
  city: string;
  latitude: number;
  longitude: number;
}

interface AddressTypesApiResponse {
  context: string;
  addressTypes: {
    identity: string;
    addressTypeName: string;
    isActive: boolean;
    isMandatoryInThisContext: boolean;
  }[];
  total: number;
}

interface PincodeDetailsResponse {
  pincode: string;
  country: string;
  state: string;
  district: string;
  city: string;
  latitude: number;
  longitude: number;
  postOffices: PostOfficeResponse[];
}

const transformToDropdownOptions = (
  data: MasterDataOption[]
): DropdownOption[] => {
  return data.map(item => ({
    identity: item.identity || String(item.id),
    addressTypeName: item.name,
    value: item.identity || String(item.id),
    label: item.name,
  }));
};

// const transformAddressTypes = (
//   data: AddressTypeResponse[]
// ): DropdownOption[] => {
//   return data.map(item => ({
//     identity: item.identity,
//     addressTypeName: item.addressTypeName,
//     value: item.identity,
//     label: item.addressTypeName,
//   }));
// };

export const firmAddressApiService = apiInstance.injectEndpoints({
  endpoints: build => ({
    // ---------------- CUSTOMER ADDRESS (MERGED) ----------------
    getCustomerAddress: build.query<AddressCaptureResponse[], string>({
      query: (customerId: string) => ({
        url: customer.getCustomerAddress({ customerId }),
        method: "GET",
      }),
      transformResponse: (
        response:
          | AddressApiResponse<AddressCaptureResponse[]>
          | AddressCaptureResponse[]
      ) => {
        if (Array.isArray(response)) return response;

        if (response && typeof response === "object") {
          if ("data" in response && Array.isArray(response.data)) {
            return response.data;
          }
          if ("addresses" in response && Array.isArray(response.addresses)) {
            return response.addresses;
          }
          if ("result" in response && Array.isArray(response.result)) {
            return response.result;
          }
        }

        return [];
      },
      providesTags: ["CustomerAddresses"],
    }),

    saveAddress: build.mutation<
      AddressApiResponse<AddressCaptureResponse>,
      SaveAddressRequest
    >({
      query: ({ customerId, payload }) => {
        // Force convert to JSON object
        let jsonPayload;
        if (payload instanceof FormData) {
          jsonPayload = Object.fromEntries(payload.entries());
        } else {
          jsonPayload = JSON.parse(JSON.stringify(payload)); // Deep clone to ensure serialization
        }

        return {
          url: customer.createAddress({ customerId }),
          method: "POST",
          headers: { "Content-Type": "application/json" },
          data: jsonPayload,
        };
      },
      transformResponse: (
        response: AddressApiResponse<AddressCaptureResponse>
      ) => response,
      invalidatesTags: [
        "CustomerAddresses",
        "AddressDocuments",
        "AddressProofType",
      ],
    }),

    updateAddress: build.mutation<
      AddressApiResponse<AddressCaptureResponse>,
      UpdateAddressRequest
    >({
      query: ({ customerId, addressId, payload }) => ({
        url: customer.updateAddress({ customerId, addressId }),
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        data: payload as unknown as Record<string, unknown>,
      }),
      transformResponse: (
        response: AddressApiResponse<AddressCaptureResponse>
      ) => response,
      invalidatesTags: [
        "CustomerAddresses",
        "AddressDocuments",
        "AddressProofType",
      ],
    }),

    deleteAddress: build.mutation<{ message: string }, DeleteAddressRequest>({
      query: ({ customerId, addressId }) => ({
        url: customer.deleteAddress({ customerId, addressId }),
        method: "DELETE",
      }),
      transformResponse: (
        response: { message: string } | AddressApiResponse<null>
      ) => {
        if (response && typeof response === "object" && "message" in response) {
          return {
            message: response.message || "Address deleted successfully",
          };
        }
        return { message: "Address deleted successfully" };
      },
      invalidatesTags: [
        "CustomerAddresses",
        "AddressDocuments",
        "AddressProofType",
      ],
    }),

    // ---------------- FIRM ADDRESS (ORIGINAL) ----------------
    getSitePremise: build.query<DropdownOption[], void>({
      query: () => ({
        url: api.master.getSitePremise(),
        method: "GET",
      }),
      transformResponse: (response: MasterDataOption[]) =>
        transformToDropdownOptions(response),
      keepUnusedDataFor: 300000,
      providesTags: ["SitePremise"],
    }),

    getAddressTypes: build.query<DropdownOption[], { context?: string } | void>(
      {
        query: () => ({
          url: api.master.getAddressTypes(),
          method: "GET",
        }),

        transformResponse: (response: AddressTypesApiResponse) =>
          response.addressTypes.map(item => ({
            identity: item.identity,
            value: item.addressTypeName,
            label: item.addressTypeName,
            addressTypeName: item.addressTypeName,
          })),

        keepUnusedDataFor: 300000,

        providesTags: (_result, _error, arg) =>
          arg
            ? [{ type: "AddressTypes", id: arg.context }]
            : [{ type: "AddressTypes", id: "UNKNOWN" }],
      }
    ),

    getEntityTypes: build.query<
      {
        identity: string;
        entityType: string;
        isActive: boolean;
        description?: string;
      }[],
      void
    >({
      query: () => ({
        url: api.master.getEntityTypes(),
        method: "GET",
      }),
      keepUnusedDataFor: 300000,
      providesTags: ["EntityTypes"],
    }),

    getPostOffices: build.query<PostOfficeResponse[], string>({
      query: pincode => ({
        url: api.master.getPostOffices({ pincode }),
        method: "GET",
      }),
      providesTags: ["PostOffices"],
    }),

    getLocationByPincode: build.query<LocationResponse, string>({
      query: pincode => ({
        url: api.master.getLocationByPincode({ pincode }),
        method: "GET",
      }),
      providesTags: ["LocationData"],
    }),

    getPincodeDetails: build.query<PincodeDetailsResponse, string>({
      query: pincode => ({
        url: api.master.getPincodeDetails({ pincode }),
        method: "GET",
      }),
      providesTags: ["PincodeDetails"],
    }),

    getFirmPincodeDetails: build.query<Record<string, unknown>[], string>({
      query: pincode => ({
        url: `/api/v1/master/pincodes/${pincode}`,
        method: "GET",
      }),
      providesTags: ["FirmPincode"],
    }),

    saveFirmAddress: build.mutation<
      Record<string, unknown>,
      { firmId: string; payload: Address }
    >({
      query: ({ firmId, payload }) => {
        return {
          url: `/api/v1/firm/${firmId}/address`,
          method: "POST" as const,
          data: payload as unknown as Record<string, unknown>,
          headers: {
            "Content-Type": "application/json",
          },
        };
      },
      invalidatesTags: ["FirmAddresses"],
    }),

    updateFirmAddress: build.mutation<
      Record<string, unknown>,
      { firmId: string; addressId: string; payload: Address }
    >({
      query: ({ firmId, addressId, payload }) => ({
        url: `/api/v1/firm/${firmId}/address/${addressId}`,
        method: "PUT" as const,
        data: payload as unknown as Record<string, unknown>,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["FirmAddresses"],
    }),

    getFirmAddresses: build.query<Address[], string>({
      query: (firmId: string) => ({
        url: `/api/v1/firm/${firmId}/addresses`,
        method: "GET",
      }),
      transformResponse: (response: Record<string, unknown> | Address[]) => {
        if (Array.isArray(response)) return response;
        if (response && typeof response === "object") {
          if ("data" in response && Array.isArray(response.data)) {
            return response.data as Address[];
          }
          if ("addresses" in response && Array.isArray(response.addresses)) {
            return response.addresses as Address[];
          }
        }
        return [];
      },
      providesTags: ["FirmAddresses"],
    }),

    deleteFirmAddress: build.mutation<
      { message: string },
      { firmId: string; addressId: string }
    >({
      query: ({ firmId, addressId }) => ({
        url: `/api/v1/firm/${firmId}/address/${addressId}`,
        method: "DELETE",
      }),
      transformResponse: (response: Record<string, unknown>) => {
        if (response && typeof response === "object" && "message" in response) {
          return {
            message:
              (response.message as string) || "Address deleted successfully",
          };
        }
        return { message: "Address deleted successfully" };
      },
      invalidatesTags: ["FirmAddresses"],
    }),
  }),
});

export const {
  // FIRM QUERIES
  useGetSitePremiseQuery,
  useGetAddressTypesQuery,
  useGetEntityTypesQuery,
  useGetPostOfficesQuery,
  useGetLocationByPincodeQuery,
  useGetPincodeDetailsQuery,
  useGetFirmPincodeDetailsQuery,
  useSaveFirmAddressMutation,
  useUpdateFirmAddressMutation,
  useGetFirmAddressesQuery,
  useDeleteFirmAddressMutation,
  useLazyGetPostOfficesQuery,
  useLazyGetLocationByPincodeQuery,
  useLazyGetPincodeDetailsQuery,
  useLazyGetFirmPincodeDetailsQuery,
  useGetCustomerAddressQuery,
  useSaveAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
} = firmAddressApiService;
