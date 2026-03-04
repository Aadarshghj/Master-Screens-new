import { useCallback, useState } from "react";
import {
  downloadFileFromPresignedUrl,
  getFileNameFromPath,
} from "@/utils/download.utils";
import { logger } from "@/global/service";
import { useLazyGetFileViewQuery } from "@/global/service/end-points/lead/lead-details";

const LEAD_TEMPLATE_PATH = "CommonCsv/LeadCsv/bulkLead/lead_template.xlsx";

export const useLeadTemplateDownload = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [triggerGetFileView] = useLazyGetFileViewQuery();

  const downloadTemplate = useCallback(async () => {
    setIsDownloading(true);

    try {
      //  Get the presigned URL from the API
      const response = await triggerGetFileView({
        filePath: LEAD_TEMPLATE_PATH,
      }).unwrap();

      if (!response.preSignedUrl) {
        throw new Error("No presigned URL received from server");
      }

      //  Extract filename from the filepath
      const fileName = getFileNameFromPath(response.filePath);

      //  Download the file using the presigned URL
      await downloadFileFromPresignedUrl(response.preSignedUrl, fileName);
    } catch (error) {
      // logger.error("Failed to download template", { toast: true });
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
