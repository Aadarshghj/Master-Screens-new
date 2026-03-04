// Download utility functions
import { logger } from "@/global/service";

/**
 * Downloads a file from a presigned URL
 * @param preSignedUrl - The presigned URL to download from
 * @param fileName - The name to save the file as
 */
export const downloadFileFromPresignedUrl = async (
  preSignedUrl: string,
  fileName: string = "download"
): Promise<void> => {
  try {
    // Fetch the file from the presigned URL
    const response = await fetch(preSignedUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/octet-stream",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to download file: ${response.statusText}`);
    }

    // Get the blob from the response
    const blob = await response.blob();

    // Create a temporary URL for the blob
    const blobUrl = window.URL.createObjectURL(blob);

    // Create a temporary anchor element and trigger download
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);

    logger.info("File downloaded successfully", {
      toast: true,
      pushLog: false,
    });
  } catch (error) {
    logger.error("Failed to download file", { toast: true });
    throw error;
  }
};

/**
 * Extracts filename from filepath
 * @param filePath - The full file path
 * @returns The filename extracted from the path
 */
export const getFileNameFromPath = (filePath: string): string => {
  const parts = filePath.split("/");
  return parts[parts.length - 1] || "download";
};
