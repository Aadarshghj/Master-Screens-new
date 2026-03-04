import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal/modal";
import { logger } from "@/global/service";
import { useLazySearchChargeDetailsQuery } from "@/global/service/end-points/loan-product-and-service-masters/charge-master";
import { DynamicSearchForm } from "@/components/filterDataView/DynamicSearchForm";
import type { FieldProps } from "@/components/filterDataView/DynamicSearchForm";
import { DynamicSearchResultsTable } from "@/components/filterDataView/DynamicSearchResultsTable";
import type { TableColumnConfig } from "@/components/filterDataView/DynamicSearchResultsTable";
import { Pagination } from "@/components/ui/paginationUp";
import type {
  ChargeSearchFormData,
  ChargeSearchData,
} from "@/types/loan-product-and-scheme-masters/charge-master.types";
import type { ConfigOption } from "@/types";
import {
  // useGetModulesQuery,
  useGetCalculationBaseQuery,
  useGetCalculationTypeQuery,
  useGetMonthAmountTypesQuery,
  useGetCalculationCriteriaQuery,
} from "@/global/service/end-points/loan-product-and-service-masters/charge-master";
import { useGetModulesAndSubModulesQuery } from "@/global/service/end-points/approval-workflow/workflow-definitions";

interface ChargeSearchModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  onSelectCharge?: (charge: ChargeSearchData) => void;
}

export function ChargeSearchModal({
  isOpen = true,
  onClose,
  onSelectCharge,
}: ChargeSearchModalProps) {
  const [searchResults, setSearchResults] = useState<ChargeSearchData[]>([]);
  const [isSearched, setIsSearched] = useState(false);

  const [triggerSearch, { isLoading: isSearching }] =
    useLazySearchChargeDetailsQuery();

  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [lastSearchParams, setLastSearchParams] =
    useState<ChargeSearchFormData | null>(null);

  const { data: moduleOptions = [] } = useGetModulesAndSubModulesQuery();
  const { data: calculationBaseOptions = [] } = useGetCalculationBaseQuery();
  const { data: calculationTypeOptions = [] } = useGetCalculationTypeQuery();
  const { data: monthAmountOptions = [] } = useGetMonthAmountTypesQuery();
  const { data: calculationCriteriaOptions = [] } =
    useGetCalculationCriteriaQuery();

  // Create a helper function to map identity to label
  const mapIdentityToLabel = (
    identity: string | null | undefined,
    options: ConfigOption[]
  ): string => {
    if (!identity) return "-";
    const option = options.find(opt => opt.value === identity);
    return option?.label ?? identity;
  };

  // Helper to get submodule label
  const getSubModuleLabel = (
    moduleIdentity: string,
    subModuleIdentity: string
  ): string => {
    if (!moduleIdentity || !subModuleIdentity) return "-";
    const module = moduleOptions.find(mod => mod.value === moduleIdentity);
    if (!module?.subModules) return subModuleIdentity;
    const subModule = module.subModules.find(
      sub => sub.identity === subModuleIdentity
    );
    return subModule?.subModuleName ?? subModuleIdentity;
  };

  const searchFields: FieldProps<ChargeSearchFormData>[] = [
    {
      name: "chargeCode",
      label: "Charge Code",
      placeholder: "Enter Charge Code",
      type: "text",
      fieldType: "input",
      colSpan: { lg: 3, md: 6, span: 12 },
    },
    {
      name: "chargeName",
      label: "Charge Name",
      placeholder: "Enter Charge Name",
      type: "text",
      fieldType: "input",
      colSpan: { lg: 3, md: 6, span: 12 },
    },
  ];

  const tableColumns: TableColumnConfig<ChargeSearchData>[] = [
    {
      accessorKey: "chargeCode",
      header: "Charge Code",
      cell: value => (
        <span className="text-xs font-medium">{String(value)}</span>
      ),
    },
    {
      accessorKey: "chargeName",
      header: "Charge Name",
      cell: value => <span className="text-xs">{String(value)}</span>,
    },
    {
      accessorKey: "module",
      header: "Module",
      cell: value => <span className="text-xs">{String(value)}</span>,
    },
    {
      accessorKey: "subModule",
      header: "Sub Module",
      cell: value => <span className="text-xs">{String(value)}</span>,
    },
    {
      accessorKey: "calculationOn",
      header: "Calculation On",
      cell: value => <span className="text-xs">{String(value)}</span>,
    },
    {
      accessorKey: "chargeCalculation",
      header: "Charge Calculation",
      cell: value => <span className="text-xs">{String(value)}</span>,
    },
    {
      accessorKey: "chargeIncomeGLAccount",
      header: "Charge Income GL Account",
      cell: value => <span className="text-xs">{String(value)}</span>,
    },
    {
      accessorKey: "monthAmount",
      header: "Month/Amount",
      cell: value => <span className="text-xs">{String(value)}</span>,
    },
    {
      accessorKey: "calculationCriteria",
      header: "Calculation Criteria",
      cell: value => <span className="text-xs">{String(value)}</span>,
    },
    {
      accessorKey: "chargesPostingRequired",
      header: "Charges Posting Required",
      cell: value => <span className="text-xs">{String(value)}</span>,
    },
  ];

  const executeSearch = async (data: ChargeSearchFormData, page = 0) => {
    try {
      const searchParams = {
        chargeCode: data.chargeCode?.trim() || "",
        chargeName: data.chargeName?.trim() || "",
        module: data.module?.trim() || "",
        page,
        size: pageSize,
      };

      if (
        !searchParams.chargeCode &&
        !searchParams.chargeName &&
        !searchParams.module
      ) {
        logger.error("Please enter at least one search criteria", {
          toast: true,
        });
        return;
      }

      const response = await triggerSearch(searchParams).unwrap();
      const mappedResults: ChargeSearchData[] = response.content.map(
        result => ({
          chargeId: result.chargeId,
          chargeCode: result.chargeCode,
          chargeName: result.chargeName,
          module: mapIdentityToLabel(result.module, moduleOptions),
          subModule: getSubModuleLabel(result.module, result.subModule),
          calculationOn: mapIdentityToLabel(
            result.calculationOn,
            calculationBaseOptions
          ),
          chargeCalculation: mapIdentityToLabel(
            result.chargeCalculation,
            calculationTypeOptions
          ),
          chargeIncomeGLAccount: result.chargeIncomeGLAccount || "-",
          monthAmount: mapIdentityToLabel(
            result.monthAmount,
            monthAmountOptions
          ),
          calculationCriteria: mapIdentityToLabel(
            result.calculationCriteria,
            calculationCriteriaOptions
          ),
          chargesPostingRequired: result.chargesPostingRequired,
          isActive: result.isActive,
          originalData: result.originalData,
        })
      );
      //

      setLastSearchParams({
        chargeCode: data.chargeCode || "",
        chargeName: data.chargeName || "",
        module: data.module || "",
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
          "Failed to search charges";

        logger.error(errorMessage, { toast: true });
      } else {
        logger.error("An unexpected error occurred", { toast: true });
      }
      setSearchResults([]);
      setIsSearched(true);
    }
  };

  const handleSearch = (data: ChargeSearchFormData) => {
    executeSearch(data, 0);
  };

  const handleReset = () => {
    setSearchResults([]);
    setIsSearched(false);
    setCurrentPage(0);
    setTotalPages(0);
    setTotalElements(0);
    setLastSearchParams(null);
  };

  const handleSelectCharge = (charge: ChargeSearchData) => {
    try {
      if (onSelectCharge) {
        onSelectCharge(charge);
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
      setCurrentPage(0);
      setTotalPages(0);
      setTotalElements(0);
      setLastSearchParams(null);
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
      title="Charge Search"
      titleVariant="default"
    >
      <div className="space-y-2">
        <DynamicSearchForm<ChargeSearchFormData>
          fields={searchFields}
          onSubmit={handleSearch}
          onReset={handleReset}
          isLoading={isSearching}
          defaultValues={{
            chargeCode: "",
            chargeName: "",
            module: "",
          }}
        />

        <DynamicSearchResultsTable<ChargeSearchData>
          data={searchResults}
          columns={tableColumns}
          actionButton={{
            label: "Select →",
            onClick: handleSelectCharge,
            variant: "link",
            size: "xs",
            className:
              "text-theme-primary hover:text-theme-primary/80 h-auto p-0 text-xs font-normal",
          }}
          title="Charge List"
          isSearched={isSearched}
          noDataText="No charges found"
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
                      chargeCode: "",
                      chargeName: "",
                      module: "",
                    },
                    page
                  )
                }
                onPreviousPage={() => {
                  if (currentPage > 0)
                    executeSearch(
                      lastSearchParams || {
                        chargeCode: "",
                        chargeName: "",
                        module: "",
                      },
                      currentPage - 1
                    );
                }}
                onNextPage={() => {
                  if (currentPage < totalPages - 1)
                    executeSearch(
                      lastSearchParams || {
                        chargeCode: "",
                        chargeName: "",
                        module: "",
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
