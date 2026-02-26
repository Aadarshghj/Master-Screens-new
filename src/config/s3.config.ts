/**
 * S3 Configuration
 *
 * This file contains configuration for AWS S3 file uploads
 */

import { ENV } from "./env.config";

export const S3_CONFIG = {
  bucketName: ENV.VITE_S3_BUCKET_NAME || "incede-nbfc-uploads",
  region: ENV.VITE_S3_REGION || "ap-south-1",
  uploadEnabled: ENV.VITE_S3_UPLOAD_ENABLED === "true",

  // Upload settings
  maxFileSize: 50 * 1024 * 1024, // 50MB
  allowedFileTypes: [
    "application/pdf",
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/tiff",
    "image/tif",
  ],

  // S3 paths
  paths: {
    customerDocuments: "customer-documents",
    kycDocuments: "kyc-documents",
    form60Documents: "form60-documents",
    photoDocuments: "photo-documents",
  },

  // Pre-signed URL settings
  presignedUrlExpiry: 300, // 5 minutes
} as const;

export const getS3Key = (
  customerId: string,
  documentType: string,
  fileName: string
): string => {
  const timestamp = Date.now();
  const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
  return `${S3_CONFIG.paths.customerDocuments}/${customerId}/${documentType}/${timestamp}-${sanitizedFileName}`;
};

export const isS3UploadEnabled = (): boolean => {
  return S3_CONFIG.uploadEnabled;
};
