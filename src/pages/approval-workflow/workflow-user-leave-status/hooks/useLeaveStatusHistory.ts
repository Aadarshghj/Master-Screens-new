import { useState, useEffect, useCallback } from "react";
import { logger } from "@/global/service";
import {
  useGetUserListQuery,
  useLazyGetHistoryLeaveStatusBatchesQuery,
} from "@/global/service/end-points/approval-workflow/user-leave-status";
import type {
  BatchItem,
  ImportHistoryDataLeaveStatus,
  UserLeaveStatusImportHistorySearchForm,
} from "@/types/approval-workflow/user-leave-status.types";
import { formatDate, formatTime, getUserName } from "./useLeaveStatus";

interface UseLeaveStatusHistoryProps {
  isOpen: boolean;
}

export const useLeaveStatusHistory = ({
  isOpen,
}: UseLeaveStatusHistoryProps) => {
  const [searchResults, setSearchResults] = useState<
    ImportHistoryDataLeaveStatus[]
  >([]);
  const [isSearched, setIsSearched] = useState(false);
  const [selectedBatchIdDisplay, setSelectedBatchIdDisplay] =
    useState<string>("");
  const [selectedUploadedBy, setSelectedUploadedBy] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [selectedBatchId, setSelectedBatchId] = useState<string>("");
  const [detailsModalType, setDetailsModalType] = useState<
    "success" | "error" | null
  >(null);

  const [triggerSearch, { isLoading: isSearching }] =
    useLazyGetHistoryLeaveStatusBatchesQuery();
  const { data: userOptions = [] } = useGetUserListQuery();

  const mapResults = useCallback(
    (content: BatchItem[]): ImportHistoryDataLeaveStatus[] => {
      return content.map(item => ({
        ...item,
        uploadedByName: getUserName(item.uploadedBy, userOptions),
        uploadedDate: formatDate(item.createdAt),
        uploadedTime: formatTime(item.createdAt),
        completedDate: formatDate(item.completedAt),
        completedTime: formatTime(item.completedAt),
      }));
    },
    [userOptions]
  );

  const handleInitialLoad = useCallback(
    async (page = 0) => {
      try {
        const params = {
          page,
          size: pageSize,
        };
        const results = await triggerSearch(params).unwrap();
        const mappedResults = mapResults(results.content);

        setSearchResults(mappedResults);
        setIsSearched(true);
        setTotalPages(results.totalPages);
        setTotalElements(results.totalElements);
        setCurrentPage(page);
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
            "Failed to load import history";

          logger.error(errorMessage, { toast: true });
        } else {
          logger.error("An unexpected error occurred", { toast: true });
        }

        setSearchResults([]);
        setIsSearched(true);
      }
    },
    [pageSize, triggerSearch, mapResults]
  );

  const handleSearch = useCallback(
    async (data: UserLeaveStatusImportHistorySearchForm, page = 0) => {
      try {
        const params = {
          uploadedBy: data.uploadedBy === "all" ? "" : data.uploadedBy,
          createdDate: data.createdDate || undefined,
          page: 0,
          size: pageSize,
        };

        const results = await triggerSearch(params).unwrap();
        const mappedResults = mapResults(results.content);

        setSearchResults(mappedResults);
        setTotalPages(results.totalPages);
        setTotalElements(results.totalElements);
        setCurrentPage(page);
        setIsSearched(true);
      } catch (error) {
        console.log(error);
        logger.error("Failed to fetch filtered import history", {
          toast: true,
        });
      }
    },
    [pageSize, triggerSearch, mapResults]
  );

  const handleReset = useCallback(() => {
    handleInitialLoad(0);
  }, [handleInitialLoad]);

  const handleOpenDetailsModal = useCallback(
    (
      batchIdentity: string,
      batchId: string,
      uploadedByName: string,
      type: "success" | "error"
    ) => {
      setSelectedBatchId(batchIdentity);
      setSelectedBatchIdDisplay(batchId);
      setSelectedUploadedBy(uploadedByName);
      setDetailsModalType(type);
    },
    []
  );

  const handleCloseDetailsModal = useCallback(() => {
    setSelectedBatchId("");
    setDetailsModalType(null);
  }, []);

  const handlePageChange = useCallback(
    (newPage: number) => {
      setCurrentPage(newPage);
      handleInitialLoad(newPage);
    },
    [handleInitialLoad]
  );

  const handlePreviousPage = useCallback(() => {
    if (currentPage > 0) {
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
      handleInitialLoad(prevPage);
    }
  }, [currentPage, handleInitialLoad]);

  const handleNextPage = useCallback(() => {
    if (currentPage < totalPages - 1) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      handleInitialLoad(nextPage);
    }
  }, [currentPage, totalPages, handleInitialLoad]);

  useEffect(() => {
    if (!isOpen) {
      setSearchResults([]);
      setIsSearched(false);
      setSelectedBatchId("");
      setDetailsModalType(null);
      setCurrentPage(0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      handleInitialLoad();
    }
  }, [isOpen, handleInitialLoad]);

  return {
    searchResults,
    isSearched,
    selectedBatchIdDisplay,
    selectedUploadedBy,
    currentPage,
    pageSize,
    totalPages,
    totalElements,
    selectedBatchId,
    detailsModalType,
    isSearching,
    userOptions,

    handleSearch,
    handleReset,
    handleOpenDetailsModal,
    handleCloseDetailsModal,
    handlePageChange,
    handlePreviousPage,
    handleNextPage,
  };
};
