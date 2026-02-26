import { apiInstance } from "@/global/service";

interface DMSPreSignedUrlRequest {
  filePath: string;
  accessType: "READ" | "WRITE";
}

interface DMSPreSignedUrlResponse {
  preSignedUrl: string;
}

interface DMSUploadRequest {
  module: string;
  referenceId: string;
  documentCategory: string;
  documentType: string;
  fileName: string;
  contentType: string;
  payload: string;
}

interface DMSUploadResponse {
  preSignedUrl: string;
  filePath: string;
  fileName: string;
}

export const dmsApi = apiInstance.injectEndpoints({
  endpoints: builder => ({
    getDMSFileUrl: builder.query<
      DMSPreSignedUrlResponse,
      DMSPreSignedUrlRequest
    >({
      query: ({ filePath, accessType }) => ({
        url: "/api/v1/dms/file/view/presignedUrl",
        method: "GET",
        params: { filePath, accessType },
      }),
      transformResponse: (response: DMSPreSignedUrlResponse) => ({
        ...response,
        preSignedUrl: response.preSignedUrl?.replace(/&amp;/g, "&") || "",
      }),
    }),
    getDMSPreSignedUrl: builder.mutation<DMSUploadResponse, DMSUploadRequest>({
      query: ({ payload }) => ({
        url: "/api/v1/dms/file/upload/presignedUrl",
        method: "POST",
        data: payload,
      }),
      transformResponse: (response: DMSUploadResponse) => ({
        ...response,
        preSignedUrl: response.preSignedUrl?.replace(/&amp;/g, "&") || "",
      }),
    }),
  }),
});

export const { useGetDMSFileUrlQuery, useGetDMSPreSignedUrlMutation } = dmsApi;
