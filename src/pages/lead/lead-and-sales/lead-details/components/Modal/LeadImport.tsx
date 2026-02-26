import React, { useState, useCallback, useRef, useEffect } from "react";
import { Modal } from "@/components/ui/modal/modal";
import { Button } from "@/components/ui/button";
import { Flex } from "@/components/ui/flex";
import { CheckCircle, RotateCw, AlertCircle } from "lucide-react";
import { logger } from "@/global/service";
import { useDMSFileUpload, type DMSFileData } from "@/hooks/useDMSFileUpload";
import { useBulkImportLeadsMutation } from "@/global/service/end-points/lead/lead-details";
import { Form } from "@/components/ui/form";

interface LeadImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess?: (fileData: DMSFileData) => void;
}

export const LeadImportModal: React.FC<LeadImportModalProps> = ({
  isOpen,
  onClose,
  onImportSuccess,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [bulkImportLeads, { isLoading: isBulkImporting }] =
    useBulkImportLeadsMutation();

  const { uploadFile, isUploading } = useDMSFileUpload({
    module: "leads",
    referenceId: "BulkImport",
    documentCategory: "inprogress",
    documentType: "",
    onSuccess: async fileData => {
      logger.info("Lead file uploaded to S3 successfully", { toast: false });

      try {
        setIsProcessing(true);

        const bulkImportPayload = {
          s3DocumentUrl: fileData.filePath,
          fileName: fileData.fileName,
        };

        await bulkImportLeads(bulkImportPayload).unwrap();
        logger.info("Lead bulk import initiated successfully", { toast: true });
        setUploadSuccess(true);
        setUploadError(null);

        onImportSuccess?.(fileData);
      } catch (bulkImportError) {
        const errorMessage =
          typeof bulkImportError === "object" &&
          bulkImportError !== null &&
          "data" in bulkImportError
            ? (bulkImportError.data as { message?: string })?.message ||
              "Failed to initiate bulk import"
            : "Failed to initiate bulk import";

        logger.error(`Bulk import failed: ${errorMessage}`, { toast: true });
        setUploadError(errorMessage);
        setUploadSuccess(false);
      } finally {
        setIsProcessing(false);
      }
    },
    onError: errorMsg => {
      logger.error(`Lead file upload failed: ${errorMsg}`, { toast: true });
      setUploadError(errorMsg);
      setUploadSuccess(false);
    },
  });

  useEffect(() => {
    if (!isOpen) {
      setSelectedFile(null);
      setUploadSuccess(false);
      setUploadError(null);
      setIsProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }, [isOpen]);

  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        const allowedTypes = [
          "text/csv",
          "application/vnd.ms-excel",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        ];
        const allowedExtensions = [".csv", ".xls", ".xlsx"];

        const fileExtension = file.name
          .toLowerCase()
          .substring(file.name.lastIndexOf("."));
        const isValidType =
          allowedTypes.includes(file.type) ||
          allowedExtensions.includes(fileExtension);

        if (!isValidType) {
          logger.error(
            "Invalid file type. Please upload a CSV or Excel file.",
            { toast: true, pushLog: false }
          );
          return;
        }

        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
          logger.error(
            "File size exceeds 10MB. Please upload a smaller file.",
            { toast: true, pushLog: false }
          );
          return;
        }

        setSelectedFile(file);
        setUploadSuccess(false);
        setUploadError(null);
      }
    },
    []
  );

  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleSave = useCallback(async () => {
    if (!selectedFile) {
      logger.error("Please select a file to import", {
        toast: true,
        pushLog: false,
      });
      return;
    }

    setUploadSuccess(false);
    setUploadError(null);

    await uploadFile(selectedFile);
  }, [selectedFile, uploadFile]);

  const handleClose = useCallback(() => {
    setSelectedFile(null);
    setUploadSuccess(false);
    setUploadError(null);
    setIsProcessing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onClose();
  }, [onClose]);

  const isLoading = isUploading || isBulkImporting || isProcessing;

  return (
    <Modal
      isOpen={isOpen}
      close={handleClose}
      width="md"
      isClosable={false}
      compact={false}
      className="mx-4 w-md"
      title="Import Lead Details"
      titleVariant="default"
    >
      <div className="space-y-4">
        <p className="mb-10 text-sm text-gray-500">
          Choose a file to import lead details
        </p>

        {/* File Upload Section */}
        <Form.Field label="Upload File">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xls,.xlsx,text/csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            onChange={handleFileSelect}
            className="hidden"
            disabled={isLoading}
          />
          <Button
            type="button"
            variant="default"
            size="default"
            onClick={handleUploadClick}
            disabled={isLoading}
            className="w-xs"
          >
            {isLoading ? (
              <>
                <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                <span>
                  {isUploading
                    ? "Uploading..."
                    : isProcessing
                      ? "Processing..."
                      : "Loading..."}
                </span>
              </>
            ) : (
              <span>Choose File</span>
            )}
          </Button>

          <p className="text-muted-foreground mt-1 text-xs">
            Accepted format xlsx, Max size: 5MB
          </p>
        </Form.Field>

        {/* Selected File Display */}
        {selectedFile && !uploadError && !uploadSuccess && (
          <div className="flex items-center space-x-2 px-3 py-2">
            <CheckCircle className="h-4 w-4 flex-shrink-0 text-blue-600" />
            <p className="text-xs text-blue-800">{selectedFile.name}</p>
          </div>
        )}

        {/* Processing Status */}
        {isProcessing && (
          <div className="flex items-center space-x-2 px-3 py-2">
            <RotateCw className="h-4 w-4 flex-shrink-0 animate-spin text-blue-600" />
            <p className="text-xs text-blue-800">Processing bulk import...</p>
          </div>
        )}

        {/* Success Message */}
        {uploadSuccess && (
          <div className="flex items-center space-x-2 px-3 py-2">
            <CheckCircle className="h-4 w-4 flex-shrink-0 text-green-600" />
            <div className="flex-1">
              <p className="text-xs font-medium text-green-800">
                File imported successfully!
              </p>
              {selectedFile && (
                <p className="text-xs text-green-600">{selectedFile.name}</p>
              )}
            </div>
          </div>
        )}

        {/* Error Message */}
        {uploadError && (
          <div className="flex items-start space-x-2 px-3 py-2">
            <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-600" />
            <div className="flex-1">
              <p className="text-xs font-medium text-red-800">Import failed</p>
              <p className="text-xs text-red-600">{uploadError}</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <Flex justify="end" gap={2} className="pt-2">
          <Button
            type="button"
            variant="outline"
            size="compactPrimary"
            onClick={handleClose}
            disabled={isLoading}
          >
            Close
          </Button>
          <Button
            type="button"
            variant="resetPrimary"
            size="compactWhite"
            onClick={handleSave}
            disabled={!selectedFile || isLoading || uploadSuccess}
          >
            {isLoading
              ? isUploading
                ? "Uploading..."
                : "Processing..."
              : "Save"}
          </Button>
        </Flex>
      </div>
    </Modal>
  );
};
