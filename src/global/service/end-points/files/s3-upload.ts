import { apiInstance } from "../../api-instance";

import axios from "axios";
import { logger } from "../../logger";

// Create a clean axios instance for S3 uploads (no auth interceptors)
const s3AxiosInstance = axios.create({
  timeout: 30000, // 30 seconds for file uploads
});

export interface PreSignedUrlRequest {
  module: string;
  referenceId: string;
  documentCategory: string;
  documentType: string;
  fileName: string;
  contentType: string;
}

export interface PreSignedUrlResponse {
  url: string;
  file: string;
}

export interface S3UploadResult {
  success: boolean;
  fileKey?: string;
  error?: string;
}

export const s3UploadApiService = apiInstance.injectEndpoints({
  endpoints: build => ({
    getPreSignedUrl: build.mutation<PreSignedUrlResponse, PreSignedUrlRequest>({
      query: payload => {
        // Validate required fields
        if (!payload.fileName || payload.fileName.trim() === "") {
          throw new Error("fileName is required and cannot be empty");
        }

        return {
          url: "/api/v1/dms/file/upload/presignedUrl",
          method: "POST",
          data: payload as unknown as Record<string, unknown>, // Cast to match AxiosBaseQueryArgs
        };
      },
    }),

    uploadToS3: build.mutation<
      S3UploadResult,
      {
        file: File;
        uploadUrl: string;
        fileName: string;
      }
    >({
      queryFn: async ({ file, uploadUrl, fileName }) => {
        try {
          logger.info("S3 Upload Request started");

          // Use clean axios instance (no auth interceptors)
          await s3AxiosInstance.put(uploadUrl, file, {
            headers: {
              "Content-Type": file.type,
            },
            // No Authorization header will be added
          });

          logger.info("S3 Upload Success");

          return {
            data: {
              success: true,
              fileKey: fileName,
            },
          };
        } catch (error: unknown) {
          logger.error(error);
          return {
            error: {
              status:
                (error as { response?: { status?: number } }).response
                  ?.status || 500,
              data: {
                message:
                  (error as { response?: { data?: { message?: string } } })
                    .response?.data?.message ||
                  (error as Error).message ||
                  "Upload failed",
              },
            },
          };
        }
      },
    }),
  }),
});

export const { useGetPreSignedUrlMutation, useUploadToS3Mutation } =
  s3UploadApiService;
