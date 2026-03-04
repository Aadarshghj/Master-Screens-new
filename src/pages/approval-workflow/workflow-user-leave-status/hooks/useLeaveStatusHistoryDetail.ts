import { useState, useEffect, useMemo } from "react";
import { logger } from "@/global/service";
import {
  useGetUserListQuery,
  useLazyGetSingleHistoryLeaveDetailsQuery,
} from "@/global/service/end-points/approval-workflow/user-leave-status";
import type {
  ImportDetailsData,
  ImportDetailsSearchForm,
} from "@/types/approval-workflow/user-leave-status.types";

interface UseLeaveStatusHistoryDetailProps {
  isOpen: boolean;
  batchIdentity: string;
  batchId: string;
  uploadedBy: string;
  type: "success" | "error";
}

export function useLeaveStatusHistoryDetail({
  isOpen,
  batchIdentity,
  batchId,
  uploadedBy,
  type,
}: UseLeaveStatusHistoryDetailProps) {
  const [searchResults, setSearchResults] = useState<ImportDetailsData[]>([]);
  const [isSearched, setIsSearched] = useState(false);
  const [displayBatchId, setDisplayBatchId] = useState(batchId);

  const [triggerBatchDetails, { isLoading: isLoadingBatchDetails }] =
    useLazyGetSingleHistoryLeaveDetailsQuery();
  const { data: usersOptions = [] } = useGetUserListQuery();

  const modalTitle = type === "success" ? "Success Details" : "Error Details";
  const theme: "success" | "error" = type === "success" ? "success" : "error";

  const getUserName = (userIdentity: string): string => {
    const user = usersOptions.find(u => u.value === userIdentity);
    return user?.label || userIdentity;
  };

  const uploadedByName = useMemo(() => {
    return getUserName(uploadedBy);
  }, [uploadedBy, usersOptions]);

  const enrichedSearchResults = useMemo(() => {
    return searchResults.map((record, index) => ({
      ...record,
      siNo: index + 1,
    }));
  }, [searchResults]);

  const handleInitialLoad = async () => {
    try {
      const params = {
        batchId: batchIdentity,
        includeSuccess: type === "success",
        includeErrors: type === "error",
      };

      const response = await triggerBatchDetails(params).unwrap();

      if (response.batchId) {
        setDisplayBatchId(response.batchId);
      }

      const records =
        type === "success" ? response.successRecords : response.errors;

      if (records && records.length > 0) {
        setSearchResults(records as ImportDetailsData[]);
        setIsSearched(true);
        logger.info(`${modalTitle} loaded: ${records.length} results found`, {
          toast: false,
        });
      } else {
        setSearchResults([]);
        setIsSearched(true);
        logger.info(`No ${type} records found for this batch`, {
          toast: false,
        });
      }
    } catch (error) {
      if (typeof error === "object" && error !== null) {
        const apiError = error as {
          status?: number;
          data?: {
            message?: string;
            error?: string;
            errorCode?: string;
            timestamp?: string;
          };
        };

        const errorMessage =
          apiError.data?.message ||
          apiError.data?.error ||
          `Failed to load ${type} details`;

        logger.error(errorMessage, { toast: true });
      } else {
        logger.error("An unexpected error occurred", { toast: true });
      }

      setSearchResults([]);
      setIsSearched(true);
    }
  };

  const handleSearch = async (data: ImportDetailsSearchForm) => {
    try {
      const params = {
        batchId: data.batchId,
        includeSuccess: type === "success",
        includeErrors: type === "error",
      };

      const response = await triggerBatchDetails(params).unwrap();

      const records =
        type === "success" ? response.successRecords : response.errors;

      if (data.updatedBy && records) {
        logger.info("Filter by updatedBy not yet implemented");
      }

      if (records && records.length > 0) {
        setSearchResults(records as ImportDetailsData[]);
        logger.info(
          `${modalTitle} search completed: ${records.length} results found`
        );
      } else {
        setSearchResults([]);
        logger.info(`No ${type} records found`, { toast: false });
      }
    } catch (error) {
      logger.error(error, { toast: true });
      setSearchResults([]);
    }
  };

  const handleReset = () => {
    handleInitialLoad();
  };

  useEffect(() => {
    if (isOpen && batchIdentity) {
      handleInitialLoad();
    }
  }, [isOpen, batchIdentity, type]);

  useEffect(() => {
    if (!isOpen) {
      setSearchResults([]);
      setIsSearched(false);
    }
  }, [isOpen]);

  return {
    searchResults: enrichedSearchResults,
    isSearched,
    displayBatchId,
    uploadedByName,
    isLoadingBatchDetails,
    modalTitle,
    theme,
    usersOptions,
    handleSearch,
    handleReset,
  };
}
