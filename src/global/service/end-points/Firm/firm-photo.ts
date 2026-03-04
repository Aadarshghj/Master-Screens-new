import { apiInstance } from "../../api-instance";
import { api } from "@/api";

export interface FirmPhotoUploadRequest extends Record<string, unknown> {
  photoRefId: string;
  photoCaption: string;
  documentPath: string;
  createdBy: number;
}

export interface FirmPhotoResponse {
  identity: string;
  customerIdentity: string;
  photoCaption: string;
  documentPath: string;
}

export const firmPhotoApiService = apiInstance.injectEndpoints({
  endpoints: build => ({
    uploadFirmPhoto: build.mutation<
      FirmPhotoResponse,
      { customerId: string; data: FormData | FirmPhotoUploadRequest[] }
    >({
      query: ({ customerId, data }) => {
        const isFormData = data instanceof FormData;
        return {
          url: api.firm.uploadFirmPhoto({ customerId }),
          method: "POST",
          data,
          headers: isFormData
            ? undefined
            : { "Content-Type": "application/json" },
        };
      },
      invalidatesTags: ["FirmPhotos"],
    }),

    getFirmPhotos: build.query<{ content: FirmPhotoResponse[] }, string>({
      query: customerId => ({
        url: api.firm.getFirmPhotos({ customerId }),
        method: "GET",
      }),
      providesTags: ["FirmPhotos"],
    }),
  }),
});

export const {
  useUploadFirmPhotoMutation: useUploadFirmPhotoMetaMutation,
  useGetFirmPhotosQuery: useGetFirmPhotoListQuery,
} = firmPhotoApiService;
