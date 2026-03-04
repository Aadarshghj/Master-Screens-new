import { useState, useCallback } from "react";
import { useGetDMSPreSignedUrlMutation } from "@/global/service/end-points/dms/dms.api";
import { logger } from "@/global/service/logger";
import axios from "axios";
import {
  getImageFormatFromFileName,
  getMimeTypeFromFileName,
} from "@/utils/get-mime-type-from-file-name.util";
import { convertFileToBase64 } from "@/utils";
import { useMaskAadharMutation } from "@/global/service";

export interface UseDMSFileUploadOptions {
  module: string;
  referenceId: string;
  documentCategory: string;
  documentType: string;
  onSuccess?: (fileData: DMSFileData) => void;
  onError?: (error: string) => void;
  fileCategory?: string;
  maskedFile?: string;
}

export interface DMSFileData {
  preSignedUrl: string;
  filePath: string;
  fileName: string;
  originalFileName: string;
  originalFileType: string;
  documentRefId?: string;
}

export interface UseDMSFileUploadReturn {
  uploadFile: (file: File) => Promise<DMSFileData | null>;
  isUploading: boolean;
  uploadProgress: number;
  error: string | null;
  success: boolean;
}

export const useDMSFileUpload = ({
  module,
  referenceId,
  documentCategory,
  documentType,
  onSuccess,
  onError,
  fileCategory,
}: UseDMSFileUploadOptions): UseDMSFileUploadReturn => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [getPreSignedUrl] = useGetDMSPreSignedUrlMutation();
  const [maskAadhar] = useMaskAadharMutation();

  const uploadFile = useCallback(
    async (file: File): Promise<DMSFileData | null> => {
      setIsUploading(true);
      setError(null);
      setSuccess(false);
      setUploadProgress(0);

      try {
        let finalContentType = getMimeTypeFromFileName(file.name, file.type);
        let finalFileName = file.name;
        let fileToUpload: File | Blob = file;

        if (fileCategory === "AADHAAR") {
          const base64 = await convertFileToBase64(file);
          const imageFormat = getImageFormatFromFileName(file.name);

          logger.info(
            `Masking Aadhaar - Original format: ${imageFormat}, File type: ${file.type}`,
            { toast: false }
          );

          const maskedResponse = await maskAadhar({
            aadhar_image: base64,
            image_format: imageFormat,
          }).unwrap();

          if (
            maskedResponse.msg !== "SUCCESS" ||
            !maskedResponse.aadhaar_masked
          ) {
            throw new Error("Aadhaar masking failed");
          }

          logger.info("Aadhaar masked successfully, converting to blob", {
            toast: false,
          });

          const base64Data = maskedResponse.response_image;
          const base64Clean = base64Data.includes(",")
            ? base64Data.split(",")[1]
            : base64Data;

          const isPDF = base64Clean.startsWith("JVBERi0");

          if (isPDF) {
            finalContentType = "application/pdf";
            finalFileName = file.name.replace(
              /\.(jpg|jpeg|png|tiff|tif)$/i,
              ".pdf"
            );
          }

          const byteCharacters = atob(base64Clean);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);

          fileToUpload = new Blob([byteArray], { type: finalContentType });
          logger.info(
            `Blob created - Size: ${fileToUpload.size} bytes, Type: ${fileToUpload.type}`,
            { toast: false }
          );
        }

        logger.info(
          `Requesting pre-signed URL from DMS - Module: ${module}, ReferenceId: ${referenceId}, DocumentType: ${documentType}`
        );

        const dmsPayload = {
          module,
          referenceId,
          documentCategory,
          documentType,
          fileName: finalFileName,
          contentType: finalContentType,
        };

        let dmsResponse;
        try {
          dmsResponse = await getPreSignedUrl(dmsPayload).unwrap();
        } catch (dmsError) {
          throw new Error(`DMS API call failed: ${dmsError}`);
        }

        setUploadProgress(25);

        logger.info(
          `Uploading file to S3 - FilePath: ${dmsResponse.filePath}, FileName: ${dmsResponse.fileName}`
        );

        await axios.put(dmsResponse.preSignedUrl, fileToUpload, {
          headers: {
            "Content-Type": finalContentType,
          },
          onUploadProgress: progressEvent => {
            if (progressEvent.total) {
              const progress = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setUploadProgress(25 + progress * 0.5);
            }
          },
        });

        setUploadProgress(75);

        const fileData: DMSFileData = {
          preSignedUrl: dmsResponse.preSignedUrl,
          filePath: dmsResponse.filePath,
          fileName: dmsResponse.fileName,
          originalFileName: file.name,
          originalFileType: file.type,
          documentRefId: undefined,
        };

        setUploadProgress(100);
        setSuccess(true);

        logger.info(
          `File upload completed successfully - FilePath: ${dmsResponse.filePath}, FileName: ${dmsResponse.fileName}, OriginalFileName: ${file.name}`
        );

        onSuccess?.(fileData);
        return fileData;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Upload failed";
        setError(errorMessage);
        setSuccess(false);

        logger.error(
          `File upload failed - Error: ${errorMessage}, FileName: ${file.name}, Module: ${module}, ReferenceId: ${referenceId}`
        );

        onError?.(errorMessage);
        return null;
      } finally {
        setIsUploading(false);
      }
    },
    [
      module,
      referenceId,
      documentCategory,
      documentType,
      getPreSignedUrl,
      maskAadhar,
      onSuccess,
      onError,
      fileCategory,
    ]
  );

  return {
    uploadFile,
    isUploading,
    uploadProgress,
    error,
    success,
  };
};
