import { apiInstance } from "../../api-instance";
import { customer } from "@/api/customer/customer.api";
import type {
  AddressCaptureResponse,
  UploadedDocument,
  SaveAddressRequest,
  UpdateAddressRequest,
  DeleteAddressRequest,
  GetUploadedDocumentsParams,
  AddressApiResponse,
  AddressTypeData,
} from "@/types/customer/address.types";

export const addressApiService = apiInstance.injectEndpoints({
  endpoints: build => ({
    getUploadedAddressDocuments: build.query<
      UploadedDocument[],
      GetUploadedDocumentsParams
    >({
      query: ({ customerId }) => ({
        url: customer.getUploadedAddressDocuments({ customerId }),
        method: "GET",
      }),
      transformResponse: (
        response: AddressApiResponse<UploadedDocument[]> | UploadedDocument[]
      ) => {
        // Handle various response formats
        if (Array.isArray(response)) {
          return response;
        }
        if (response && typeof response === "object") {
          if ("data" in response && Array.isArray(response.data)) {
            return response.data;
          }
          if (
            "documents" in response &&
            Array.isArray(
              (response as { documents: UploadedDocument[] }).documents
            )
          ) {
            return (response as { documents: UploadedDocument[] }).documents;
          }
        }

        return [];
      },
      providesTags: ["AddressDocuments"],
    }),

    getCustomerAddress: build.query<AddressCaptureResponse[], string>({
      query: (customerId: string) => {
        return {
          url: customer.getCustomerAddress({ customerId }),
          method: "GET",
        };
      },
      transformResponse: (
        response:
          | AddressApiResponse<AddressCaptureResponse[]>
          | AddressCaptureResponse[]
      ) => {
        // Handle various response formats
        if (Array.isArray(response)) {
          return response;
        }

        if (response && typeof response === "object") {
          if ("data" in response && Array.isArray(response.data)) {
            return response.data;
          }

          if ("addresses" in response && Array.isArray(response.addresses)) {
            return response.addresses as AddressCaptureResponse[];
          }

          if ("result" in response && Array.isArray(response.result)) {
            return response.result as AddressCaptureResponse[];
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
        return {
          url: customer.createAddress({ customerId }),
          method: "POST",
          data: payload,
          headers: {
            "Content-Type": "application/json",
          },
        };
      },
      transformResponse: (
        response: AddressApiResponse<AddressCaptureResponse>
      ) => {
        return response;
      },
      invalidatesTags: [
        "CustomerAddresses",
        "AddressDocuments",
        "AddressProofType",
      ],
    }),

    saveAddressPermanentTrue: build.mutation<
      AddressApiResponse<AddressCaptureResponse>,
      SaveAddressRequest
    >({
      query: ({ customerId, payload }) => {
        return {
          url: customer.createPermanantAddressTrue({ customerId }),
          method: "POST",
          data: payload,
          headers: {
            "Content-Type": "application/json",
          },
        };
      },
      transformResponse: (
        response: AddressApiResponse<AddressCaptureResponse>
      ) => {
        return response;
      },
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
      query: ({ customerId, addressId, payload }) => {
        return {
          url: customer.updateAddress({ customerId, addressId }),
          method: "PUT",
          data: payload,
          headers: {
            "Content-Type": "application/json",
          },
        };
      },
      transformResponse: (
        response: AddressApiResponse<AddressCaptureResponse>
      ) => {
        return response;
      },
      invalidatesTags: [
        "CustomerAddresses",
        "AddressDocuments",
        "AddressProofType",
      ],
    }),

    deleteAddress: build.mutation<{ message: string }, DeleteAddressRequest>({
      query: ({ customerId, addressId }) => {
        return {
          url: customer.deleteAddress({ customerId, addressId }),
          method: "DELETE",
        };
      },
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

    getAddressOptions: build.query<
      AddressTypeData,
      { active: boolean; context: string }
    >({
      query: ({ active, context }) => {
        return {
          url: customer.getAddressOptions(),
          params: { active, context },
          method: "GET",
        };
      },
      providesTags: ["AddressOptions"],
    }),
  }),
});

export const {
  useGetUploadedAddressDocumentsQuery,
  useGetCustomerAddressQuery,
  useSaveAddressMutation,
  useSaveAddressPermanentTrueMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
  useGetAddressOptionsQuery,
} = addressApiService;
