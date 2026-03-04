import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal/modal";
import type {
  LeadSearchData,
  LeadSearchForm,
} from "@/types/lead/lead-details.types";
import { logger } from "@/global/service";
import { useLazySearchLeadQuery } from "@/global/service/end-points/lead/lead-details";
import {
  useGetAllGendersQuery,
  useGetLeadSourceQuery,
  useGetLeadStageQuery,
  useGetLeadStatusQuery,
  useGetProductsQuery,
  type ConfigOption,
} from "@/global/service/end-points/master/lead-master";
import { DynamicSearchForm } from "@/components/filterDataView/DynamicSearchForm";
import type { FieldProps } from "@/components/filterDataView/DynamicSearchForm";

import { DynamicSearchResultsTable } from "@/components/filterDataView/DynamicSearchResultsTable";
import type { TableColumnConfig } from "@/components/filterDataView/DynamicSearchResultsTable";
import { Pagination } from "@/components/ui/paginationUp";

interface LeadSearchModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  onSelectLead?: (lead: LeadSearchData) => void;
}

export function LeadSearch({
  isOpen = true,
  onClose,
  onSelectLead,
}: LeadSearchModalProps) {
  const [searchResults, setSearchResults] = useState<LeadSearchData[]>([]);
  const [isSearched, setIsSearched] = useState(false);

  const [triggerSearch, { isLoading: isSearching }] = useLazySearchLeadQuery();

  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [lastSearchParams, setLastSearchParams] =
    useState<LeadSearchForm | null>(null);

  const { data: genderOptions = [] } = useGetAllGendersQuery();
  const { data: leadSourceOptions = [] } = useGetLeadSourceQuery();
  const { data: leadStageOptions = [] } = useGetLeadStageQuery();
  const { data: leadStatusOptions = [] } = useGetLeadStatusQuery();
  const { data: productsOptions = [] } = useGetProductsQuery();

  const searchFields: FieldProps<LeadSearchForm>[] = [
    {
      name: "fullName",
      label: "Lead Name",
      placeholder: "Enter name",
      type: "text",
      fieldType: "input",
      colSpan: { lg: 3, md: 6, span: 12 },
    },
    {
      name: "contactNumber",
      label: "Mobile Number",
      placeholder: "Enter mobile number",
      type: "text",
      restriction: "numeric",
      fieldType: "input",
      maxLength: 10,
      colSpan: { lg: 3, md: 6, span: 12 },
    },
    {
      name: "email",
      label: "Email",
      placeholder: "Enter email",
      type: "email",
      fieldType: "input",
      colSpan: { lg: 3, md: 6, span: 12 },
    },
  ];

  const tableColumns: TableColumnConfig<LeadSearchData>[] = [
    {
      accessorKey: "leadCode",
      header: "Lead Code",
      cell: value => (
        <span className="text-xs font-medium">{String(value)}</span>
      ),
    },
    {
      accessorKey: "fullName",
      header: "Full Name",
      cell: value => (
        <span className="text-xs font-medium">{String(value)}</span>
      ),
    },
    {
      accessorKey: "gender",
      header: "Gender",
      cell: value => <span className="text-xs">{String(value)}</span>,
    },
    {
      accessorKey: "contactNumber",
      header: "Contact Number",
      cell: value => <span className="text-xs">{String(value)}</span>,
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: value => (
        <span className="text-xs">{value ? String(value) : "N/A"}</span>
      ),
    },
    {
      accessorKey: "interestedProducts",
      header: "Interested Product/Service",
      cell: value => <span className="text-xs">{String(value)}</span>,
    },
    {
      accessorKey: "leadSource",
      header: "Lead Source",
      cell: value => <span className="text-xs">{String(value)}</span>,
    },
    {
      accessorKey: "leadStage",
      header: "Lead Stage",
      cell: value => <span className="text-xs">{String(value)}</span>,
    },
    {
      accessorKey: "leadStatus",
      header: "Lead Status",
      cell: value => <span className="text-xs">{String(value)}</span>,
    },
  ];

  const mapIdentityToName = (
    identity: string | null | undefined,
    options: ConfigOption[]
  ): string => {
    if (!identity) return "-";
    const option = options.find(opt => opt.value === identity);
    return option?.label ?? "-";
  };

  const executeSearch = async (data: LeadSearchForm, page = 0) => {
    try {
      const searchParams = {
        fullName: data.fullName?.trim() || "",
        contactNumber: data.contactNumber?.trim() || "",
        email: data.email?.trim() || "",
        page,
        size: pageSize,
      };

      if (
        !searchParams.fullName &&
        !searchParams.contactNumber &&
        !searchParams.email
      ) {
        logger.error("Please enter at least one search criteria", {
          toast: true,
        });
        return;
      }
      const response = await triggerSearch(searchParams).unwrap();

      const mappedResults: LeadSearchData[] = response.content.map(result => ({
        leadId: result.leadIdentity,
        leadCode: result.leadCode,
        fullName: result.fullName,
        contactNumber: result.contactNumber,
        email: result.email || "",
        remarks: result.remarks || "",
        canvassedTypeIdentity: result.canvassedTypeIdentity,
        canvasserIdentity:
          result.canvasserResponseDtos?.[0]?.canvasserIdentity || "",
        canvasserName: result.canvasserResponseDtos?.[0]?.canvasserName || "",
        canvasserCode: result.canvasserResponseDtos?.[0]?.canvasserCode || "",
        nextFollowUpDate: result.nextFollowUpDate,
        preferredTime: result.preferredTime,
        leadProbability: result.leadProbability,
        highPriority: result.highPriority,
        assignTo: "",
        createdAt: "",
        updatedAt: "",
        addresses: result.addresses,
        dynamicReferences: result.dynamicReferences,
        originalData: {
          gender: result.gender,
          leadSource: result.leadSource,
          leadStage: result.leadStage,
          leadStatus: result.leadStatus,
          interestedProducts: result.interestedProduct,
        },
        gender: mapIdentityToName(result.gender, genderOptions),
        leadSource: mapIdentityToName(result.leadSource, leadSourceOptions),
        leadStage: mapIdentityToName(result.leadStage, leadStageOptions),
        leadStatus: mapIdentityToName(result.leadStatus, leadStatusOptions),
        interestedProducts: mapIdentityToName(
          result.interestedProduct,
          productsOptions
        ),
      }));

      setLastSearchParams({
        fullName: data.fullName || "",
        contactNumber: data.contactNumber || "",
        email: data.email || "",
      });

      setSearchResults(mappedResults);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
      setCurrentPage(page);
      setIsSearched(true);
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
          "Failed to search leads";

        logger.error(errorMessage, { toast: true });
      } else {
        logger.error("An unexpected error occurred", { toast: true });
      }
      setSearchResults([]);
      setIsSearched(true);
    }
  };
  const handleSearch = (data: LeadSearchForm) => {
    executeSearch(data, 0);
  };

  const handleReset = () => {
    setSearchResults([]);
    setIsSearched(false);
  };

  const handleSelectLead = (lead: LeadSearchData) => {
    try {
      if (onSelectLead) {
        onSelectLead(lead);
      }
    } catch (error) {
      logger.error(error, { toast: false });
    } finally {
      if (onClose) {
        onClose();
      }
    }
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
      title="Lead Search"
      titleVariant="default"
    >
      <div className="space-y-4">
        <DynamicSearchForm<LeadSearchForm>
          fields={searchFields}
          onSubmit={handleSearch}
          onReset={handleReset}
          isLoading={isSearching}
          defaultValues={{
            fullName: "",
            contactNumber: "",
            email: "",
          }}
        />

        <DynamicSearchResultsTable<LeadSearchData>
          data={searchResults}
          columns={tableColumns}
          actionButton={{
            label: "Edit →",
            onClick: handleSelectLead,
            variant: "link",
            size: "xs",
            className:
              "text-theme-primary hover:text-theme-primary/80 h-auto p-0 text-xs font-normal",
          }}
          title="Lead Search Results"
          isSearched={isSearched}
          noDataText="No leads found"
          searchPromptText="Please search to view results"
        />
        {isSearched && searchResults.length > 0 && totalPages > 0 && (
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
                onPageChange={page =>
                  executeSearch(
                    lastSearchParams || {
                      fullName: "",
                      contactNumber: "",
                      email: "",
                    },
                    page
                  )
                }
                onPreviousPage={() => {
                  if (currentPage > 0)
                    executeSearch(
                      lastSearchParams || {
                        fullName: "",
                        contactNumber: "",
                        email: "",
                      },
                      currentPage - 1
                    );
                }}
                onNextPage={() => {
                  if (currentPage < totalPages - 1)
                    executeSearch(
                      lastSearchParams || {
                        fullName: "",
                        contactNumber: "",
                        email: "",
                      },
                      currentPage + 1
                    );
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
  );
}
