import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal/modal";
import { logger } from "@/global/service";
import { DynamicSearchForm } from "@/components/filterDataView/DynamicSearchForm";
import type { FieldProps } from "@/components/filterDataView/DynamicSearchForm";
import { DynamicSearchResultsTable } from "@/components/filterDataView/DynamicSearchResultsTable";
import type { TableColumnConfig } from "@/components/filterDataView/DynamicSearchResultsTable";
import { useLazyGetImportBatchesQuery } from "@/global/service/end-points/lead/lead-details";
import { useGetUsersQuery } from "@/global/service/end-points/master/lead-master";
import type { ImportHistoryData } from "@/types/lead/lead-details.types";
import { ImportDetailsModal } from "./ImportDetails";
import { Pagination } from "@/components/ui/paginationUp";

interface ImportHistorySearchForm {
  updatedBy: string;
  createdAt: string;
}

interface ImportHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ImportHistoryModal({
  isOpen,
  onClose,
}: ImportHistoryModalProps) {
  const [searchResults, setSearchResults] = useState<ImportHistoryData[]>([]);
  const [isSearched, setIsSearched] = useState(false);
  const [selectedBatchIdDisplay, setSelectedBatchIdDisplay] =
    useState<string>("");
  const [selectedUploadedBy, setSelectedUploadedBy] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [currentFilters, setCurrentFilters] = useState<ImportHistorySearchForm>(
    {
      updatedBy: "",
      createdAt: "",
    }
  );

  const [selectedBatchId, setSelectedBatchId] = useState<string>("");
  const [detailsModalType, setDetailsModalType] = useState<
    "success" | "error" | null
  >(null);
  const [triggerSearch, { isLoading: isSearching }] =
    useLazyGetImportBatchesQuery();
  const { data: userOptions = [] } = useGetUsersQuery();

  const formatDate = (dateString: string): string => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string): string => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const getUserName = (userIdentity: string): string => {
    const user = userOptions.find(u => u.value === userIdentity);
    return user?.label || userIdentity;
  };

  const formatDateForAPI = (dateString: string): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleCloseDetailsModal = () => {
    setSelectedBatchId("");
    setDetailsModalType(null);
  };
  const handleOpenDetailsModal = (
    batchIdentity: string,
    batchId: string,
    uploadedBy: string,
    type: "success" | "error"
  ) => {
    setSelectedBatchId(batchIdentity);
    setSelectedBatchIdDisplay(batchId);
    setSelectedUploadedBy(uploadedBy);
    setDetailsModalType(type);
  };

  const searchFields: FieldProps<ImportHistorySearchForm>[] = [
    {
      name: "updatedBy",
      label: "Uploaded By",
      placeholder: "Select User",
      fieldType: "select",
      options: userOptions,
      colSpan: { lg: 2, md: 6, span: 12 },
    },
    {
      name: "createdAt",
      label: "Uploaded Date",
      placeholder: "Select Date",
      fieldType: "date",
      colSpan: { lg: 2, md: 6, span: 12 },
    },
  ];

  const tableColumns: TableColumnConfig<ImportHistoryData>[] = [
    {
      accessorKey: "batchName",
      header: "Batch ID",
      cell: value => (
        <span className="text-xs font-medium">{String(value)}</span>
      ),
    },
    {
      accessorKey: "uploadedByName",
      header: "Uploaded By",
      cell: value => <span className="text-xs">{String(value)}</span>,
    },
    {
      accessorKey: "uploadedDate",
      header: "Uploaded Date",
      cell: value => <span className="text-xs">{String(value)}</span>,
    },
    {
      accessorKey: "uploadedTime",
      header: "Uploaded Time",
      cell: value => <span className="text-xs">{String(value)}</span>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: value => <span className="text-xs">{String(value)}</span>,
    },
    {
      accessorKey: "totalRecords",
      header: "Total Row Count",
      cell: value => <span className="text-xs">{String(value)}</span>,
    },
    {
      accessorKey: "processedRecords",
      header: "Uploaded",
      cell: (value, row) => (
        <button
          onClick={() =>
            handleOpenDetailsModal(
              String(row.batchIdentity),
              String(row.batchId),
              String(row.uploadedBy),
              "success"
            )
          }
          className="cursor-pointer text-xs font-medium text-green-600 hover:text-green-800 hover:underline"
        >
          {String(value)}
        </button>
      ),
    },
    {
      accessorKey: "erroredRecords",
      header: "Rejected",
      cell: (value, row) => (
        <button
          onClick={() =>
            handleOpenDetailsModal(
              String(row.batchIdentity),
              String(row.batchId),
              String(row.uploadedBy),
              "error"
            )
          }
          className="cursor-pointer text-xs font-medium text-red-600 hover:text-red-800 hover:underline"
        >
          {String(value)}
        </button>
      ),
    },
  ];

  const fetchData = async (
    filters: ImportHistorySearchForm,
    page: number = 0
  ) => {
    try {
      const params: {
        page: number;
        size: number;
        uploadedBy?: string;
        uploadedDate?: string;
      } = {
        page,
        size: pageSize,
      };

      if (filters.updatedBy) {
        params.uploadedBy = filters.updatedBy;
      }
      if (filters.createdAt) {
        params.uploadedDate = formatDateForAPI(filters.createdAt);
      }

      const results = await triggerSearch(params).unwrap();

      const mappedResults: ImportHistoryData[] = results.content.map(item => ({
        ...item,
        uploadedByName: getUserName(item.uploadedBy),
        uploadedDate: formatDate(item.createdAt),
        uploadedTime: formatTime(item.createdAt),
        completedDate: formatDate(item.completedAt),
        completedTime: formatTime(item.completedAt),
        batchId: item.batchId,
      }));

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
  };

  useEffect(() => {
    if (isOpen) {
      setCurrentFilters({ updatedBy: "", createdAt: "" });
      fetchData({ updatedBy: "", createdAt: "" }, 0);
    }
  }, [isOpen]);

  const handleSearch = async (data: ImportHistorySearchForm) => {
    setCurrentFilters(data);
    setCurrentPage(0);
    await fetchData(data, 0);
  };

  const handleFilterReset = () => {
    const emptyFilters = { updatedBy: "", createdAt: "" };
    setCurrentFilters(emptyFilters);
    setCurrentPage(0);
    fetchData(emptyFilters, 0);
  };

  const handlePageChange = (newPage: number) => {
    fetchData(currentFilters, newPage);
  };

  useEffect(() => {
    if (!isOpen) {
      setSearchResults([]);
      setIsSearched(false);
      setCurrentFilters({ updatedBy: "", createdAt: "" });
      setCurrentPage(0);
    }
  }, [isOpen]);

  return (
    <>
      <Modal
        isOpen={isOpen}
        close={onClose}
        width="3xl"
        isClosable={true}
        compact={true}
        maxHeight="90vh"
        className="mx-4 w-full"
        title="Leads Import History"
        titleVariant="default"
        closeIconClassName="h-4 w-4"
      >
        <div className="space-y-4">
          <DynamicSearchForm<ImportHistorySearchForm>
            fields={searchFields}
            onSubmit={handleSearch}
            onReset={handleFilterReset}
            isLoading={isSearching}
            theme="primary"
            defaultValues={currentFilters}
            actionButtons={{
              type: "both",
              submitIcon: "filter",
              submitText: "Filter",
              showResetIcon: true,
              resetText: "Reset",
            }}
          />

          <DynamicSearchResultsTable<ImportHistoryData>
            data={searchResults}
            columns={tableColumns}
            title=""
            isSearched={isSearched}
            noDataText="No import history found"
            searchPromptText="Loading import history..."
          />
          {searchResults.length > 0 && totalPages > 0 && (
            <div className="mt-4 flex items-center justify-between text-sm">
              <div className="text-muted-foreground whitespace-nowrap">
                Showing {currentPage * pageSize + 1} to{" "}
                {Math.min((currentPage + 1) * pageSize, totalElements)} of{" "}
                {totalElements} entries
              </div>
              <div className="flex items-center gap-3">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  onPreviousPage={() => {
                    if (currentPage > 0) {
                      handlePageChange(currentPage - 1);
                    }
                  }}
                  onNextPage={() => {
                    if (currentPage < totalPages - 1) {
                      handlePageChange(currentPage + 1);
                    }
                  }}
                  canPreviousPage={currentPage > 0}
                  canNextPage={currentPage < totalPages - 1}
                  maxVisiblePages={5}
                />
              </div>
            </div>
          )}
        </div>
      </Modal>

      {detailsModalType && (
        <ImportDetailsModal
          isOpen={!!detailsModalType}
          onClose={handleCloseDetailsModal}
          batchIdentity={selectedBatchId}
          batchId={selectedBatchIdDisplay}
          uploadedBy={selectedUploadedBy}
          type={detailsModalType}
          userOptions={userOptions}
        />
      )}
    </>
  );
}
