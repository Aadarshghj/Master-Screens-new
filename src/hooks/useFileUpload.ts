import { useState, useCallback } from "react";
import { validateFile, convertFileToBase64 } from "@/utils/file.utils";
import type { UseFileUploadReturn, UseFileUploadOptions } from "@/types/hooks";
export const useFileUpload = ({
  shouldConvertToBase64 = true,
}: UseFileUploadOptions = {}): UseFileUploadReturn => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [base64Data, setBase64Data] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleFileSelect = useCallback(
    async (file: File) => {
      setLoading(true);
      setError("");

      try {
        validateFile(file);

        let base64 = "";
        if (shouldConvertToBase64) {
          base64 = await convertFileToBase64(file);
          setBase64Data(base64);
        } else {
          setBase64Data("");
        }

        setSelectedFile(file);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "File processing failed";
        setError(errorMessage);
        setSelectedFile(null);
        setBase64Data("");
      } finally {
        setLoading(false);
      }
    },
    [shouldConvertToBase64]
  );

  const clearFile = useCallback(() => {
    setSelectedFile(null);
    setBase64Data("");
    setError("");
  }, []);

  const success =
    !!selectedFile && (!shouldConvertToBase64 || !!base64Data) && !error;

  return {
    selectedFile,
    base64Data,
    loading,
    error,
    success,
    handleFileSelect,
    clearFile,
  };
};
