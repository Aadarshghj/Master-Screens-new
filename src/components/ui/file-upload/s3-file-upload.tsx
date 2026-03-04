import React, { useCallback, useRef } from "react";
import { useS3FileUpload } from "@/hooks/useS3FileUpload";
import { logger } from "@/global/service/logger";

interface S3FileUploadProps {
  customerId: string;
  documentType?: string;
  accept?: string;
  maxSize?: number; // in MB
  disabled?: boolean;
  buttonText?: string;
  loadingText?: string;
  className?: string;
  onUploadSuccess?: (fileKey: string, fileName: string) => void;
  onUploadError?: (error: string) => void;
  validateFile?: (file: File) => string | null;
}

export const S3FileUpload: React.FC<S3FileUploadProps> = ({
  customerId,
  documentType = "document",
  accept = ".png,.jpg,.jpeg,.tiff,.tif,.pdf",
  maxSize = 50,
  disabled = false,
  buttonText = "Choose file",
  loadingText = "Uploading...",
  className = "",
  onUploadSuccess,
  onUploadError,
  validateFile,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { uploadFile, isUploading, uploadProgress, error, success } =
    useS3FileUpload({
      customerId,
      documentType,
      onSuccess: (fileKey: string) => {
        onUploadSuccess?.(
          fileKey,
          fileInputRef.current?.files?.[0]?.name || ""
        );
      },
      onError: (error: string) => {
        onUploadError?.(error);
      },
    });

  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];

      if (!file) {
        return;
      }

      // Size validation
      if (file.size > maxSize * 1024 * 1024) {
        const errorMsg = `File size exceeds ${maxSize}MB limit`;
        logger.error(errorMsg);
        onUploadError?.(errorMsg);
        return;
      }

      // Custom validation
      if (validateFile) {
        const validationError = validateFile(file);
        if (validationError) {
          logger.error(validationError);
          onUploadError?.(validationError);
          return;
        }
      }

      try {
        await uploadFile(file);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Upload failed";
        onUploadError?.(errorMessage);
      }
    },
    [uploadFile, maxSize, validateFile, onUploadError]
  );

  const triggerFileInput = useCallback(() => {
    if (!isUploading && !disabled) {
      fileInputRef.current?.click();
    }
  }, [isUploading, disabled]);

  const getButtonText = () => {
    if (isUploading) {
      return `${loadingText} ${uploadProgress}%`;
    }
    if (success) {
      return "Upload Complete";
    }
    return buttonText;
  };

  const getButtonClass = () => {
    const baseClass = "px-4 py-2 rounded-md font-medium transition-colors";

    if (isUploading) {
      return `${baseClass} bg-blue-500 text-white cursor-not-allowed`;
    }
    if (success) {
      return `${baseClass} bg-green-500 text-white`;
    }
    if (error) {
      return `${baseClass} bg-red-500 text-white`;
    }
    if (disabled) {
      return `${baseClass} bg-gray-300 text-gray-500 cursor-not-allowed`;
    }
    return `${baseClass} bg-blue-600 text-white hover:bg-blue-700`;
  };

  return (
    <div className={`relative ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled || isUploading}
      />

      <button
        type="button"
        onClick={triggerFileInput}
        disabled={disabled || isUploading}
        className={getButtonClass()}
      >
        {getButtonText()}
      </button>

      {/* Progress bar */}
      {isUploading && (
        <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
          <div
            className="h-2 rounded-full bg-blue-600 transition-all duration-300"
            style={{ width: `${uploadProgress}%` }}
          />
        </div>
      )}

      {/* Error message */}
      {error && <div className="mt-2 text-sm text-red-600">{error}</div>}

      {/* Success message */}
      {success && (
        <div className="mt-2 text-sm text-green-600">
          File uploaded successfully!
        </div>
      )}
    </div>
  );
};
