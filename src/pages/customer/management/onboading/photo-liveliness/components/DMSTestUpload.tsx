import React, { useState, useCallback } from "react";
import {
  Input,
  Form,
  Flex,
  Grid,
  Button,
  HeaderWrapper,
  TitleHeader,
} from "@/components";
import { FileUpload } from "@/components/shared/file-upload/FileUpload";
import { useS3FileUpload } from "@/hooks/useS3FileUpload";
import { logger } from "@/global/service";
import { Upload, CheckCircle, AlertCircle } from "lucide-react";

interface DMSTestUploadProps {
  customerId: string;
}

export const DMSTestUpload: React.FC<DMSTestUploadProps> = ({ customerId }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle");
  const [uploadResult, setUploadResult] = useState<string>("");

  const { uploadFile, isUploading } = useS3FileUpload({
    customerId,
    documentType: "TEST_DOCUMENT",
    onSuccess: (fileKey: string) => {
      setUploadStatus("success");
      setUploadResult(`File uploaded successfully! File Key: ${fileKey}`);
      logger.info("Test file uploaded successfully", { toast: true });
    },
    onError: (errorMessage: string) => {
      setUploadStatus("error");
      setUploadResult(`Upload failed: ${errorMessage}`);
      logger.error("Test file upload failed", { toast: true });
    },
  });

  const handleFileSelect = useCallback((file: File) => {
    setSelectedFile(file);
    setUploadStatus("idle");
    setUploadResult("");
  }, []);

  const handleUpload = useCallback(async () => {
    if (!selectedFile || !customerId) {
      logger.error("No file selected or customer ID missing", { toast: true });
      return;
    }

    setUploadStatus("uploading");
    setUploadResult("");

    try {
      await uploadFile(selectedFile);
    } catch (error) {
      setUploadStatus("error");
      setUploadResult(
        `Upload failed: ${error instanceof Error ? error.message : "Unknown error"}`
      );
      logger.error("Test file upload failed", { toast: true });
    }
  }, [selectedFile, customerId, uploadFile]);

  const handleReset = useCallback(() => {
    setSelectedFile(null);
    setUploadStatus("idle");
    setUploadResult("");
  }, []);

  return (
    <div className="bg-background border-border rounded-lg border p-6">
      <HeaderWrapper>
        <TitleHeader title="DMS Test Upload" />
      </HeaderWrapper>

      <Form className="mt-4">
        <Grid gap={4}>
          <Form.Row gap={6}>
            <Form.Col span={12}>
              <Form.Field label="Test File Upload">
                <FileUpload
                  onFileSelect={handleFileSelect}
                  accept=".png,.jpg,.jpeg,.pdf,.doc,.docx"
                  disabled={isUploading}
                />
                {selectedFile && (
                  <div className="text-muted-foreground mt-2 text-sm">
                    Selected: {selectedFile.name} (
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                  </div>
                )}
              </Form.Field>
            </Form.Col>
          </Form.Row>

          <Form.Row gap={6}>
            <Form.Col span={12}>
              <Form.Field label="Customer ID">
                <Input
                  type="text"
                  value={customerId}
                  disabled
                  className="bg-muted"
                />
              </Form.Field>
            </Form.Col>
          </Form.Row>

          {uploadResult && (
            <Form.Row gap={6}>
              <Form.Col span={12}>
                <div
                  className={`rounded-md p-3 ${
                    uploadStatus === "success"
                      ? "border border-green-200 bg-green-50 text-green-800"
                      : uploadStatus === "error"
                        ? "border border-red-200 bg-red-50 text-red-800"
                        : "border border-blue-200 bg-blue-50 text-blue-800"
                  }`}
                >
                  <Flex align="center" gap={2}>
                    {uploadStatus === "success" && (
                      <CheckCircle className="h-4 w-4" />
                    )}
                    {uploadStatus === "error" && (
                      <AlertCircle className="h-4 w-4" />
                    )}
                    <span className="text-sm font-medium">
                      {uploadStatus === "success"
                        ? "Success"
                        : uploadStatus === "error"
                          ? "Error"
                          : "Info"}
                    </span>
                  </Flex>
                  <p className="mt-1 text-sm">{uploadResult}</p>
                </div>
              </Form.Col>
            </Form.Row>
          )}

          <Form.Row gap={6}>
            <Form.Col span={12}>
              <Flex gap={3}>
                <Button
                  type="button"
                  variant="default"
                  onClick={handleUpload}
                  disabled={
                    !selectedFile || isUploading || uploadStatus === "uploading"
                  }
                >
                  <Upload className="mr-2 h-4 w-4" />
                  {isUploading || uploadStatus === "uploading"
                    ? "Uploading..."
                    : "Upload Test File"}
                </Button>

                <Button
                  type="button"
                  variant="reset"
                  onClick={handleReset}
                  disabled={isUploading || uploadStatus === "uploading"}
                >
                  Reset
                </Button>
              </Flex>
            </Form.Col>
          </Form.Row>
        </Grid>
      </Form>
    </div>
  );
};
