import { useCallback, useState } from "react";
import {
  downloadFileFromPresignedUrl,
  getFileNameFromPath,
} from "@/utils/download.utils";
import { logger } from "@/global/service";
import { useDMSLazyFileViewQuery } from "@/global/service/end-points/dms/dms.api";

export const useTemplateDownload = (templatePath: string) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [triggerGetFileView] = useDMSLazyFileViewQuery();

  const downloadTemplate = useCallback(async () => {
    setIsDownloading(true);

    try {
      const response = await triggerGetFileView({
        filePath: templatePath,
      }).unwrap();

      if (!response.preSignedUrl) {
        throw new Error("No presigned URL received from server");
      }

      const fileName = getFileNameFromPath(response.filePath);

      await downloadFileFromPresignedUrl(response.preSignedUrl, fileName);
    } catch (error) {
      logger.error(error, { toast: true });
    } finally {
      setIsDownloading(false);
    }
  }, [triggerGetFileView]);

  return {
    downloadTemplate,
    isDownloading,
  };
};
