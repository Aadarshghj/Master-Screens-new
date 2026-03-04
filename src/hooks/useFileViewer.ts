import { useCallback, useEffect, useRef, useState } from "react";
import { useDMSLazyFileViewQuery } from "@/global/service/end-points/dms/dms.api";
import { logger } from "@/global/service/logger";

export interface UseFileViewerOptions {
  onSuccess?: (url: string) => void;
  onError?: (error: string) => void;
}

export interface UseFileViewerReturn {
  viewDocument: (filePath: string, fileName?: string) => Promise<void>;
  isViewing: boolean;
  isViewerOpen: boolean;
  documentUrl: string | null;
  documentType: string | null;
  closeViewer: () => void;
}

export const useFileViewer = ({
  onSuccess,
  onError,
}: UseFileViewerOptions = {}): UseFileViewerReturn => {
  const [triggerQuery] = useDMSLazyFileViewQuery();
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [documentUrl, setDocumentUrl] = useState<string | null>(null);
  const [documentType, setDocumentType] = useState<string | null>(null);

  const currentObjectUrlRef = useRef<string | null>(null);

  const getFileType = useCallback((fileName: string): string => {
    const extension = fileName.split(".").pop()?.toLowerCase() || "";
    return extension;
  }, []);

  const getMimeType = useCallback((extension: string): string => {
    const mimeTypes: Record<string, string> = {
      pdf: "application/pdf",
      png: "image/png",
      jpg: "image/jpg",
      jpeg: "image/jpeg",
      gif: "image/gif",
      webp: "image/webp",
      svg: "image/svg+xml",
      bmp: "image/bmp",
      doc: "application/msword",
      docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      xls: "application/vnd.ms-excel",
      xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    };
    return mimeTypes[extension.toLowerCase()] || "application/octet-stream";
  }, []);

  const revokeCurrentObjectUrl = useCallback(() => {
    const url = currentObjectUrlRef.current;
    if (url && url.startsWith("blob:")) {
      try {
        URL.revokeObjectURL(url);
        logger.info("Revoked previous blob URL");
      } catch {
        logger.warn("Error revoking blob URL:");
      }
    }
    currentObjectUrlRef.current = null;
  }, []);

  useEffect(() => {
    return () => {
      revokeCurrentObjectUrl();
    };
  }, [revokeCurrentObjectUrl]);

  const viewDocument = useCallback(
    async (filePath: string, fileName?: string): Promise<void> => {
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
          accessType: "",
        }).unwrap();

        // typed interface to avoid `any`
        type ResponseShape = {
          preSignedUrl?: string;
          url?: string;
          data?: string;
        };

        const res = response as ResponseShape;

        const rawUrl =
          res.preSignedUrl || res.url || res.data || (response as unknown);

        const cleanUrl = rawUrl ? String(rawUrl).trim() : null;

        if (!cleanUrl) {
          throw new Error("No valid view URL received from server");
        }

        logger.info(`View URL obtained successfully - URL: ${cleanUrl}`);

        const fileExtension = fileName
          ? getFileType(fileName)
          : (cleanUrl.split(".").pop() || "").split(/\?|#/)[0].toLowerCase();

        logger.info(`Detected file extension: ${fileExtension}`);

        setDocumentType(fileExtension || null);

        try {
          logger.info("Fetching file as blob...");

          const fetchResponse = await fetch(cleanUrl, {
            mode: "cors",
            credentials: "omit",
          });

          logger.info(`Fetch response status: ${fetchResponse.status}`);
          logger.info(
            "Fetch response headers:",
            Object.fromEntries(fetchResponse.headers.entries())
          );

          if (!fetchResponse.ok) {
            throw new Error(
              `Failed to fetch file. Status: ${fetchResponse.status}`
            );
          }

          const arrayBuffer = await fetchResponse.arrayBuffer();
          logger.info(`Fetched ${arrayBuffer.byteLength} bytes`);

          const correctMimeType = getMimeType(fileExtension);
          logger.info(`Using MIME type: ${correctMimeType}`);

          const blob = new Blob([arrayBuffer], { type: correctMimeType });
          logger.info(
            `Created blob with type: ${blob.type}, size: ${blob.size}`
          );

          revokeCurrentObjectUrl();

          const objectUrl = URL.createObjectURL(blob);
          currentObjectUrlRef.current = objectUrl;

          logger.info(`Created object URL: ${objectUrl}`);

          setDocumentUrl(objectUrl);
          setIsViewerOpen(true);
          onSuccess?.(objectUrl);

          logger.info(
            "✅ Document blob loaded and object URL created for viewing"
          );
          return;
        } catch {
          logger.warn(
            "Fetching file as blob failed, falling back to direct URL"
          );

          setDocumentUrl(cleanUrl);
          setIsViewerOpen(true);
          onSuccess?.(cleanUrl);
          return;
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to get view URL";
        logger.error(
          `View document failed - Error: ${errorMessage}, FilePath: ${filePath}`
        );
        onError?.(errorMessage);
      }
    },
    [
      triggerQuery,
      onSuccess,
      onError,
      getFileType,
      getMimeType,
      revokeCurrentObjectUrl,
    ]
  );

  const closeViewer = useCallback(() => {
    setIsViewerOpen(false);
    setDocumentUrl(null);
    setDocumentType(null);
    revokeCurrentObjectUrl();
  }, [revokeCurrentObjectUrl]);

  return {
    viewDocument,
    isViewing: !!documentUrl,
    isViewerOpen,
    documentUrl,
    documentType,
    closeViewer,
  };
};
