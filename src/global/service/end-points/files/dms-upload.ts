import { apiInstance } from "../../api-instance";
import { api } from "@/api";
import { decodeUrlEntities } from "@/utils/url.utils";

export interface DMSUploadRequest {
  file: File;
  customerId: string;
  documentType?: string;
}

export interface DMSUploadResponse {
  documentPath: string;
  documentId?: string;
}

export const dmsUploadApiService = apiInstance.injectEndpoints({
  endpoints: build => ({
    uploadToDMS: build.mutation<DMSUploadResponse, DMSUploadRequest>({
      query: ({ file, customerId, documentType = "firm-photos" }) => {
        const formData = new FormData();
        formData.append("file", file);

        const endpoint =
          documentType === "kyc-documents"
            ? api.firm.uploadKycDocumentToDMS({ customerId })
            : api.firm.uploadFirmPhotoToDMS({ customerId });

        return {
          url: endpoint,
          method: "POST",
          data: formData,
          // Remove Content-Type header for FormData - let browser set it
        };
      },
      transformResponse: (response: DMSUploadResponse) => ({
        ...response,
        documentPath: decodeUrlEntities(response.documentPath || ""),
      }),
    }),
  }),
});

export const { useUploadToDMSMutation } = dmsUploadApiService;
