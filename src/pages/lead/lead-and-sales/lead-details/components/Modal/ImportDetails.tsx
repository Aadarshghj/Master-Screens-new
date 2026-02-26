import { useState, useEffect, useMemo } from "react";
import { Modal } from "@/components/ui/modal/modal";
import { logger } from "@/global/service";
import { DynamicSearchForm } from "@/components/filterDataView/DynamicSearchForm";
import type { FieldProps } from "@/components/filterDataView/DynamicSearchForm";
import { DynamicSearchResultsTable } from "@/components/filterDataView/DynamicSearchResultsTable";
import type { TableColumnConfig } from "@/components/filterDataView/DynamicSearchResultsTable";
import { useLazyGetBatchDetailsQuery } from "@/global/service/end-points/lead/lead-details";
import type { ImportDetailsData } from "@/types/lead/lead-details.types";
import {
  useGetLeadSourceQuery,
  useGetUsersQuery,
} from "@/global/service/end-points/master/lead-master";

interface ImportDetailsSearchForm {
  batchId: string;
  updatedBy: string;
}

interface ImportDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  batchIdentity: string;
  batchId: string;
  uploadedBy: string;
  type: "success" | "error";
  userOptions: Array<{ value: string; label: string }>;
}

export function ImportDetailsModal({
  isOpen,
  onClose,
  batchIdentity,
  batchId,
  uploadedBy,
  type,
  userOptions,
}: ImportDetailsModalProps) {
  const [searchResults, setSearchResults] = useState<ImportDetailsData[]>([]);
  const [isSearched, setIsSearched] = useState(false);
  const [displayBatchId, setDisplayBatchId] = useState(batchId);

  const [triggerBatchDetails, { isLoading: isLoadingBatchDetails }] =
    useLazyGetBatchDetailsQuery();

  const { data: leadSourceOptions = [], isLoading: isLoadingLeadSource } =
    useGetLeadSourceQuery();
  const { data: usersOptions = [] } = useGetUsersQuery();

  const modalTitle = type === "success" ? "Success Details" : "Error Details";
  const theme = type === "success" ? "success" : "error";

  const getUserName = (userIdentity: string): string => {
    const user = usersOptions.find(u => u.value === userIdentity);
    return user?.label || userIdentity;
  };

  const getLeadSourceName = (leadSourceIdentity: string): string => {
    const leadSource = leadSourceOptions.find(
      source => source.value === leadSourceIdentity
    );
    return leadSource?.label || leadSourceIdentity;
  };

  const uploadedByName = useMemo(() => {
    return getUserName(uploadedBy);
  }, [uploadedBy, usersOptions]);

  const enrichedSearchResults = useMemo(() => {
    return searchResults.map((record, index) => ({
      ...record,
      siNo: index + 1,
      leadSourceName: getLeadSourceName(record.leadSource),
    }));
  }, [searchResults, leadSourceOptions]);

  const inputFields: FieldProps<ImportDetailsSearchForm>[] = [
    {
      name: "batchId",
      label: "Batch ID",
      placeholder: "Enter Batch ID",
      type: "text",
      fieldType: "input",
      colSpan: { lg: 2, md: 6, span: 12 },
    },
    {
      name: "updatedBy",
      label: "Uploaded By",
      placeholder: "Select User",
      fieldType: "select",
      options: userOptions,
      colSpan: { lg: 2, md: 6, span: 12 },
    },
  ];

  const successColumns: TableColumnConfig<ImportDetailsData>[] = [
    {
      accessorKey: "siNo",
      header: "SI No",
      cell: value => (
        <span className="text-xs font-medium">{String(value)}</span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: value => <span className="text-xs">{String(value)}</span>,
    },
    {
      accessorKey: "fullName",
      header: "Name",
      cell: value => <span className="text-xs">{String(value)}</span>,
    },
    {
      accessorKey: "mobileNumber",
      header: "Mobile Number",
      cell: value => <span className="text-xs">{String(value)}</span>,
    },
    {
      accessorKey: "email",
      header: "Mail ID",
      cell: value => <span className="text-xs">{String(value)}</span>,
    },
    {
      accessorKey: "leadSourceName",
      header: "Lead Source",
      cell: value => <span className="text-xs">{String(value)}</span>,
    },
    // {
    //   accessorKey: "errorDetails",
    //   header: "Error Details",
    //   cell: value => <span className="text-xs">{String(value)}</span>,
    // },
  ];

  const errorColumns: TableColumnConfig<ImportDetailsData>[] = [
    {
      accessorKey: "rowNumber",
      header: "Row No",
      cell: value => (
        <span className="text-xs font-medium">{String(value)}</span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: value => <span className="text-xs">{String(value)}</span>,
    },
    {
      accessorKey: "fullName",
      header: "Name",
      cell: value => <span className="text-xs">{String(value)}</span>,
    },
    {
      accessorKey: "mobileNumber",
      header: "Mobile Number",
      cell: value => <span className="text-xs">{String(value)}</span>,
    },
    {
      accessorKey: "email",
      header: "Mail ID",
      cell: value => <span className="text-xs">{String(value)}</span>,
    },
    {
      accessorKey: "leadSource",
      header: "Lead Source",
      cell: value => <span className="text-xs">{String(value)}</span>,
    },
    {
      accessorKey: "errorMessage",
      header: "Error Details",
      cell: value => <span className="text-xs">{String(value)}</span>,
    },
  ];

  const tableColumns = type === "success" ? successColumns : errorColumns;

  useEffect(() => {
    if (isOpen && batchIdentity) {
      handleInitialLoad();
    }
  }, [isOpen, batchIdentity, type]);

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
    if (!isOpen) {
      setSearchResults([]);
      setIsSearched(false);
    }
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      close={onClose}
      width="3xl"
      isClosable={true}
      compact={true}
      maxHeight="90vh"
      className="mx-4 w-full"
      title={modalTitle}
      titleVariant="default"
    >
      <div className="space-y-4">
        <DynamicSearchForm<ImportDetailsSearchForm>
          fields={inputFields}
          onSubmit={handleSearch}
          onReset={handleReset}
          isLoading={isLoadingBatchDetails || isLoadingLeadSource}
          readonly
          theme={theme}
          defaultValues={{
            batchId: displayBatchId,
            updatedBy: uploadedByName,
          }}
          submitButtonText="Filter"
        />

        <DynamicSearchResultsTable<ImportDetailsData>
          data={enrichedSearchResults}
          columns={tableColumns}
          title={""}
          isSearched={isSearched}
          noDataText={`No ${type === "success" ? "successful" : "failed"} records found`}
          searchPromptText="Loading details..."
        />
      </div>
    </Modal>
  );
}
