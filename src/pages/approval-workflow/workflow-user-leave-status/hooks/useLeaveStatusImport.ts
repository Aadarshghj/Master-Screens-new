import { useState, useCallback, useRef, useEffect } from "react";
import { logger } from "@/global/service";
import { useDMSFileUpload } from "@/hooks/useDMSFileUpload";
import { useBulkImportLeaveStatusMutation } from "@/global/service/end-points/approval-workflow/user-leave-status";

interface UseLeaveStatusImportParams {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess?: (fileData: unknown) => void;
  handleRefetchData: () => void;
}

export const useLeaveStatusImport = ({
  isOpen,
  onClose,
  onImportSuccess,
  handleRefetchData,
}: UseLeaveStatusImportParams) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [bulkImportLeaveStatus, { isLoading: isBulkImporting }] =
    useBulkImportLeaveStatusMutation();

  const { uploadFile, isUploading } = useDMSFileUpload({
    module: "userLeaveStatus",
    referenceId: "bulkImport",
    documentCategory: "inProgress",
    documentType: "",
    onSuccess: async fileData => {
      try {
        setIsProcessing(true);

        await bulkImportLeaveStatus({
          s3DocumentUrl: fileData.filePath,
          fileName: fileData.fileName,
        }).unwrap();

        logger.info("Leave status imported successfully", { toast: true });
        setUploadSuccess(true);
        setUploadError(null);

        onImportSuccess?.(fileData);
        handleRefetchData();
        onClose();
      } catch (error) {
        logger.error(error);
        const message = "Failed to initiate bulk import";
        logger.error("Failed to initiate bulk import", { toast: true });
        setUploadError(message);
      } finally {
        setIsProcessing(false);
      }
    },
    onError: errorMsg => {
      logger.error(errorMsg, { toast: true });
      setUploadError(errorMsg);
    },
  });

  useEffect(() => {
    if (!isOpen) {
      resetState();
    }
  }, [isOpen]);

  const resetState = () => {
    setSelectedFile(null);
    setUploadSuccess(false);
    setUploadError(null);
    setIsProcessing(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const allowedExtensions = [".csv", ".xls", ".xlsx"];
      const extension = file.name
        .slice(file.name.lastIndexOf("."))
        .toLowerCase();

      if (!allowedExtensions.includes(extension)) {
        logger.error("Invalid file format", { toast: true });
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        logger.error("File size exceeds 10MB", { toast: true });
        return;
      }

      setSelectedFile(file);
      setUploadError(null);
      setUploadSuccess(false);
    },
    []
  );

  const handleSave = async () => {
    if (!selectedFile) {
      logger.error("Please select a file", { toast: true });
      return;
    }
    await uploadFile(selectedFile);
  };

  const isLoading = isUploading || isBulkImporting || isProcessing;

  return {
    fileInputRef,
    selectedFile,
    uploadSuccess,
    uploadError,
    isProcessing,
    isLoading,
    handleFileSelect,
    handleSave,
    handleClose: () => {
      resetState();
      onClose();
    },
  };
};
