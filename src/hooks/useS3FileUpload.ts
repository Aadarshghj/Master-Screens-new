import { toaster } from "@/components";
import { logger, useUploadToDMSMutation } from "@/global/service";
import { useCallback } from "react";

export interface UseS3FileUploadOptions {
  customerId: string;
  documentType: string;
  onSuccess?: (documentPath: string) => void;
  onError?: (error: string) => void;
}

export interface UseS3FileUploadReturn {
  uploadFile: (file: File) => Promise<void>;
  isUploading: boolean;
  uploadProgress?: number;
  error?: string;
  success?: boolean;
}

export const useS3FileUpload = ({
  customerId,

  onSuccess,
  onError,
}: UseS3FileUploadOptions): UseS3FileUploadReturn => {
  const [uploadToDMS, { isLoading: isUploading }] = useUploadToDMSMutation();

  const uploadFile = useCallback(
    async (file: File): Promise<void> => {
      if (!file) {
        const errorMessage = "File is required";
        logger.error(`Upload failed - Error: ${errorMessage}`);
        onError?.(errorMessage);
        return;
      }

      if (!customerId) {
        const errorMessage = "Customer ID is required";
        logger.error(`Upload failed - Error: ${errorMessage}`);
        onError?.(errorMessage);
        return;
      }

      try {
        logger.info(
          `Uploading file - FileName: ${file.name}, CustomerId: ${customerId}`
        );

        const response = await uploadToDMS({
          file,
          customerId,
        }).unwrap();

        logger.info(
          `File uploaded successfully - DocumentPath: ${response.documentPath}`
        );
        onSuccess?.(response.documentPath);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to upload file";
        logger.error(
          `Upload failed - Error: ${errorMessage}, FileName: ${file.name}`
        );
        toaster.error(`Failed to upload file: ${errorMessage}`);
        onError?.(errorMessage);
      }
    },
    [uploadToDMS, customerId, onSuccess, onError]
  );

  return {
    uploadFile,
    isUploading,
  };
};
