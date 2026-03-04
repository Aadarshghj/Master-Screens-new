// Fixed photo API service
import type {
  PhotoCaptureResponse,
  SavePhotoRequest,
  UploadedPhotoDocument,
  ImageVerifyRequest,
  ImageVerifyResult,
  LivenessCheckRequest,
  LivenessCheckResult,
} from "@/types/customer/photo.types";
import { api } from "@/api";
import { apiInstance } from "../../api-instance";

export const photoApiService = apiInstance.injectEndpoints({
  endpoints: build => ({
    getUploadedPhotoDocuments: build.query<UploadedPhotoDocument[], void>({
      query: () => ({
        url: api.customer.getUploadedPhotos(),
        method: "GET",
      }),
      providesTags: ["CustomerPhoto"],
    }),

    getCustomerPhoto: build.query<PhotoCaptureResponse, string>({
      query: customerId => ({
        url: api.customer.getPhotoById({ customerId }),
        method: "GET",
      }),
      providesTags: (_result, _error, customerId) => [
        { type: "CustomerPhoto", id: customerId },
      ],
    }),

    performImageVerify: build.mutation<ImageVerifyResult, ImageVerifyRequest>({
      query: ({ image1, image2 }) => {
        const formData = new FormData();
        formData.append("image1", image1);
        formData.append("image2", image2);

        return {
          url: api.customer.imageVerify(),
          method: "POST",
          data: formData,
        };
      },
    }),

    performLivenessCheck: build.mutation<
      LivenessCheckResult,
      LivenessCheckRequest
    >({
      query: ({ image }) => ({
        url: api.customer.livenessCheck(),
        method: "POST",
        data: { image },
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),

    // Updated photo API service to use DMS S3 upload
    saveCustomerPhoto: build.mutation<
      { message: string; data: PhotoCaptureResponse },
      { customerId: string; payload: SavePhotoRequest }
    >({
      query: ({ customerId, payload }) => {
        // CRITICAL: Keep coordinates as strings with exactly 6 decimal places
        const formatCoordinate = (value: string | number): string => {
          const num = Number(value);
          if (isNaN(num)) return "0.000000";
          return num.toFixed(6); // Returns string with exactly 6 decimals
        };

        const requestData = {
          capturedBy: "5d7b5d84-f2b2-4e6c-a3c9-44c7d2bffb31",
          latitude: formatCoordinate(payload.latitude || "19.076000"),
          longitude: formatCoordinate(payload.longitude || "72.877700"),
          accuracy: Number(payload.accuracy) || 0,
          photoLivenessStatus: payload.photoLivenessStatus || "success",
          captureDevice: payload.captureDevice || "Mobile Camera",
          locationDescription:
            payload.locationDescription || "Current Location",
          captureTime: payload.captureTime || new Date().toISOString(),
          filePath: payload.filePath,
          photoRefId: payload.documentRefId,

          // DMS file metadata
          // documentRefId: payload.documentRefId,
          // fileName: payload.fileName,
          // fileType: payload.fileType,

          // Existing metadata
        };

        return {
          url: api.customer.savePhoto({ customerId }),
          method: "POST",
          data: requestData,
          headers: {
            "Content-Type": "application/json",
          },
        };
      },
      invalidatesTags: ["CustomerPhoto"],
    }),
    deletePhoto: build.mutation<
      { message: string },
      { customerId: string; photoIdentity: string }
    >({
      query: ({ customerId, photoIdentity }) => ({
        url: api.customer.deletePhoto({ customerId, photoIdentity }),
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetUploadedPhotoDocumentsQuery,
  useGetCustomerPhotoQuery,
  usePerformImageVerifyMutation,
  usePerformLivenessCheckMutation,
  useSaveCustomerPhotoMutation,
  useDeletePhotoMutation,
} = photoApiService;
