import { useCallback, useState } from "react";
import { useDMSLazyFileViewQuery } from "@/global/service/end-points/dms/dms.api";
import { logger } from "@/global/service/logger";
import { toaster } from "@/components";

export interface UseViewDocumentOptions {
  onSuccess?: (url: string) => void;
  onError?: (error: string) => void;
}

export interface UseViewDocumentReturn {
  viewDocument: (filePath: string) => Promise<void>;
  isViewing: boolean;
  imageUrl: string | null;
}

export const useViewDocument = ({
  onSuccess,
  onError,
}: UseViewDocumentOptions = {}): UseViewDocumentReturn => {
  const [triggerQuery, { isLoading: isViewing }] = useDMSLazyFileViewQuery();
  const [imageUrl, setImageUrl] = useState<string | null>(null); // store URL

  const viewDocument = useCallback(
    async (filePath: string): Promise<void> => {
      if (!filePath) {
        const errorMessage = "File path is required";
        logger.error(`View document failed - Error: ${errorMessage}`);
        onError?.(errorMessage);
        return;
      }

      try {
        logger.info(`Requesting view URL for document - FilePath: ${filePath}`);

        const response = await triggerQuery({
          filePath,
          accessType: "", // Empty accessType as per your API
        }).unwrap();

        // Try different possible response structures
        const rawUrl =
          response.preSignedUrl ||
          (response as { url?: string }).url ||
          (response as { data?: string }).data ||
          response;

        // Clean the URL by removing spaces
        const cleanUrl = rawUrl
          ? String(rawUrl).trim().replace(/\s+/g, "")
          : null;

        logger.info(`View URL obtained successfully - URL: ${cleanUrl}`);

        if (cleanUrl) {
          setImageUrl(cleanUrl);
          // Open the document in a new tab
          // window.open(cleanUrl, "_blank");
        } else {
          throw new Error("No pre-signed URL received from server");
        }

        onSuccess?.(response.preSignedUrl);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to get view URL";
        logger.error(
          `View document failed - Error: ${errorMessage}, FilePath: ${filePath}`
        );
        toaster.error(`Failed to open document: ${errorMessage}`);
        onError?.(errorMessage);
      }
    },
    [triggerQuery, onSuccess, onError]
  );

  return {
    viewDocument,
    isViewing,
    imageUrl,
  };
};
