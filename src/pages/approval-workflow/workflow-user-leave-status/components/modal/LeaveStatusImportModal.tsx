import React from "react";
import { Modal } from "@/components/ui/modal/modal";
import { Flex } from "@/components/ui/flex";
import { CheckCircle, RotateCw, AlertCircle } from "lucide-react";
import { Form } from "@/components/ui/form";
import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button";
import type { UserLeaveStatusModalProps } from "@/types/approval-workflow/user-leave-status.types";
import { useLeaveStatusImport } from "../../hooks/useLeaveStatusImport";

export const LeaveStatusImportModal: React.FC<UserLeaveStatusModalProps> = ({
  isOpen,
  onClose,
  onImportSuccess,
  handleRefetchData,
}) => {
  const {
    fileInputRef,
    selectedFile,
    uploadSuccess,
    uploadError,
    isProcessing,
    isLoading,
    handleFileSelect,
    handleSave,
    handleClose,
  } = useLeaveStatusImport({
    isOpen,
    onClose,
    onImportSuccess,
    handleRefetchData,
  });
  return (
    <Modal
      isOpen={isOpen}
      close={handleClose}
      width="md"
      isClosable={false}
      compact={false}
      className="mx-4 w-md"
      title="Import Leave status"
      titleVariant="default"
    >
      <div className="space-y-4">
        <p className="mb-10 text-sm text-gray-500">
          Choose a file to import leave status
        </p>

        <Form.Field label="Upload File">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xls,.xlsx,text/csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            onChange={handleFileSelect}
            className="hidden"
            disabled={isLoading}
          />
          <NeumorphicButton
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                {isProcessing ? "Processing..." : "Uploading..."}
              </>
            ) : (
              "Choose File"
            )}
          </NeumorphicButton>

          <p className="text-muted-foreground mt-1 text-xs">
            Accepted format xlsx, Max size: 5MB
          </p>
        </Form.Field>

        {selectedFile && !uploadError && !uploadSuccess && (
          <div className="flex items-center space-x-2 px-3 py-2">
            <CheckCircle className="h-4 w-4 flex-shrink-0 text-blue-600" />
            <p className="text-xs text-blue-800">{selectedFile.name}</p>
          </div>
        )}

        {isProcessing && (
          <div className="flex items-center space-x-2 px-3 py-2">
            <RotateCw className="h-4 w-4 flex-shrink-0 animate-spin text-blue-600" />
            <p className="text-xs text-blue-800">Processing bulk import...</p>
          </div>
        )}

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

        {uploadError && (
          <div className="flex items-start space-x-2 px-3 py-2">
            <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-600" />
            <div className="flex-1">
              <p className="text-xs font-medium text-red-800">Import failed</p>
              <p className="text-xs text-red-600">{uploadError}</p>
            </div>
          </div>
        )}

        <Flex justify="end" gap={2} className="pt-2">
          <NeumorphicButton
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
          >
            Close
          </NeumorphicButton>
          <NeumorphicButton
            onClick={handleSave}
            disabled={!selectedFile || isLoading || uploadSuccess}
          >
            Save
          </NeumorphicButton>
        </Flex>
      </div>
    </Modal>
  );
};
