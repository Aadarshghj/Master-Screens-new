import React from "react";
import { RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFileUpload } from "@/hooks/useFileUpload";

interface FileUploadProps {
  onFileSelect: (file: File, base64?: string) => void;
  accept?: string;
  disabled?: boolean;
  className?: string;
  returnBase64?: boolean;
  resetTrigger?: number;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  accept = ".png,.jpg,.jpeg,.tiff,.tif,.pdf",
  disabled = false,
  className = "",
  returnBase64 = true,
  resetTrigger = 0,
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const {
    selectedFile,
    base64Data,
    loading,
    error,
    success,
    handleFileSelect: hookHandleFileSelect,
    clearFile,
  } = useFileUpload({ shouldConvertToBase64: returnBase64 });

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      await hookHandleFileSelect(file);
    }
  };

  React.useEffect(() => {
    if (selectedFile && success) {
      onFileSelect(selectedFile, returnBase64 ? base64Data : undefined);
    }
  }, [selectedFile, base64Data, success, onFileSelect, returnBase64]);

  React.useEffect(() => {
    if (resetTrigger > 0) {
      clearFile();
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }, [resetTrigger, clearFile]);

  const triggerFileInput = () => {
    if (!loading && !disabled) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className={`relative ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled || loading}
      />

      <Button
        type="button"
        variant="default"
        size="compact"
        onClick={triggerFileInput}
        disabled={loading || disabled}
        className={`file-upload-button flex h-[28px] w-full items-center justify-center rounded-md px-2 text-center font-normal ${
          loading || disabled
            ? "bg-muted cursor-not-allowed"
            : "bg-primary hover:bg-primary/90"
        }`}
      >
        {loading ? (
          <>
            <RotateCw className="mr-1 h-3 w-3 animate-spin" />
            <span className="text-primary-foreground text-xxs font-medium">
              Choose File
            </span>
          </>
        ) : (
          <span className="text-primary-foreground text-xxs font-medium">
            Choose File
          </span>
        )}
      </Button>

      {error && <p className="text-status-error mt-1 text-[8px]">{error}</p>}

      {success && !error && (
        <p className="text-status-success mt-1 text-[11px]">
          {selectedFile && selectedFile.name}
        </p>
      )}
    </div>
  );
};
