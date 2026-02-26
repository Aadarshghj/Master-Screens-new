import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { RefreshCw, Search } from "lucide-react";
import {
  Select,
  Button,
  Form,
  Flex,
  Input,
  CommonTable,
  HeaderWrapper,
  TitleHeader,
  Modal,
} from "@/components";
import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button";
import { Pagination } from "@/components/ui/paginationUp";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type {
  LoanSchemeData,
  LoanSchemeSearchForm,
  LoanSchemeSearchResult,
} from "@/types/loan-product-and schema Stepper/index";
import { logger } from "@/global/service";
import {
  useGetLoanProductsQuery,
  useGetSchemeTypesQuery,
} from "@/global/service/end-points/master/loan-master";

import { useSearchLoanSchemesMutation } from "@/global/service/end-points/loan-product-and-scheme/loan-product-scheme";

interface LoanSchemeSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectScheme?: (schemeData: LoanSchemeData) => void;
  onSearchResults?: (results: LoanSchemeData[]) => void;
}

export function SchemeSearch({
  isOpen,
  onClose,
  onSelectScheme,
  onSearchResults,
}: LoanSchemeSearchProps) {
  const [searchResults, setSearchResults] = useState<LoanSchemeSearchResult[]>(
    []
  );
  const [isSearched, setIsSearched] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [lastSearchPayload, setLastSearchPayload] =
    useState<LoanSchemeSearchForm | null>(null);

  const [searchLoanSchemes, { isLoading: isSearching }] =
    useSearchLoanSchemesMutation();

  const { data: loanProductOptions = [] } = useGetLoanProductsQuery();
  const { data: schemeTypeOptions = [] } = useGetSchemeTypesQuery();

  const {
    handleSubmit,
    reset,
    control,
    register,
    formState: { errors },
  } = useForm<LoanSchemeSearchForm>({});

  const columnHelper = createColumnHelper<LoanSchemeSearchResult>();
  const columns = [
    columnHelper.accessor("productIdentity", {
      header: "Loan Product",
      cell: ({ row }) => {
        const productIdentity = row.original.productIdentity;
        const productName =
          loanProductOptions.find(option => option.value === productIdentity)
            ?.label || productIdentity;
        return (
          <span className="text-foreground text-xs font-medium">
            {productName}
          </span>
        );
      },
    }),
    columnHelper.accessor("schemeName", {
      header: "Scheme Name",
      cell: info => (
        <span className="text-foreground text-xs">
          {info.getValue() as string}
        </span>
      ),
    }),
    columnHelper.accessor("schemeTypeIdentity", {
      header: "Scheme Type",
      cell: ({ row }) => {
        const schemeTypeIdentity = row.original.schemeTypeIdentity;
        const schemeTypeName =
          schemeTypeOptions.find(option => option.value === schemeTypeIdentity)
            ?.label || schemeTypeIdentity;
        return (
          <span className="text-muted-foreground text-xs">
            {schemeTypeName}
          </span>
        );
      },
    }),
    columnHelper.accessor("effectiveFrom", {
      header: "Effective From",
      cell: info => (
        <span className="text-muted-foreground text-xs">
          {info.getValue() as string}
        </span>
      ),
    }),
    columnHelper.accessor("effectiveTo", {
      header: "Effective To",
      cell: info => (
        <span className="text-muted-foreground text-xs">
          {(info.getValue() as string) || "-"}
        </span>
      ),
    }),
    columnHelper.accessor("fromAmount", {
      header: "From Amount",
      cell: info => (
        <span className="text-muted-foreground text-xs">
          {info.getValue() as number}
        </span>
      ),
    }),
    columnHelper.accessor("toAmount", {
      header: "To Amount",
      cell: info => (
        <span className="text-muted-foreground text-xs">
          {info.getValue() as number}
        </span>
      ),
    }),
    columnHelper.display({
      id: "action",
      header: "Action",
      cell: ({ row }) => (
        <Button
          variant="default"
          size="sm"
          onClick={() => {
            const scheme = row.original;
            if (onSelectScheme) {
              onSelectScheme(scheme as unknown as LoanSchemeData);
            }

            window.dispatchEvent(
              new CustomEvent("editLoanScheme", {
                detail: {
                  ...scheme,
                  schemeId: scheme.identity,
                },
              })
            );

            onClose();
            window.scrollTo({ top: 0, behavior: "smooth" });
            logger.info("Loan scheme selected", { pushLog: false });
          }}
        >
          Select →
        </Button>
      ),
    }),
  ];

  const table = useReactTable({
    data: searchResults,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  });

  const fetchResults = async (
    searchData: LoanSchemeSearchForm,
    page: number = 0
  ) => {
    try {
      const searchPayload = {
        loanProduct: searchData.loanProduct,
        schemeName: searchData.schemeName,
        schemeCode: searchData.schemeCode,
        schemeTypeName: searchData.schemeTypeName,
        page,
        size: 10,
      };

      const response = await searchLoanSchemes(searchPayload).unwrap();

      // Check if response is paginated or just an array
      if (Array.isArray(response)) {
        // Backend returns array without pagination - use client-side pagination
        const allResults = response;
        const start = page * 10;
        const end = start + 10;
        const paginatedResults = allResults.slice(start, end);

        setSearchResults(paginatedResults);
        setTotalPages(Math.ceil(allResults.length / 10));
        setTotalElements(allResults.length);
        setCurrentPage(page);
        setIsSearched(true);

        // Store all results for pagination
        if (page === 0) {
          sessionStorage.setItem(
            "loanSchemeSearchResults",
            JSON.stringify(allResults)
          );
          if (onSearchResults) {
            onSearchResults(allResults as unknown as LoanSchemeData[]);
          }
        }

        logger.info(
          `Loan scheme search completed: ${allResults.length} results found`
        );
      } else {
        // Backend returns paginated response
        const paginatedResponse = response as unknown as {
          content?: LoanSchemeSearchResult[];
          totalPages?: number;
          totalElements?: number;
          number?: number;
        };

        const results = paginatedResponse.content || [];
        setSearchResults(Array.isArray(results) ? results : []);
        setTotalPages(paginatedResponse.totalPages || 0);
        setTotalElements(paginatedResponse.totalElements || 0);
        setCurrentPage(
          paginatedResponse.number !== undefined
            ? paginatedResponse.number
            : page
        );
        setIsSearched(true);

        if (page === 0 && onSearchResults) {
          onSearchResults(results as unknown as LoanSchemeData[]);
        }

        logger.info(
          `Loan scheme search completed: ${paginatedResponse.totalElements || 0} results found`
        );
      }
    } catch (error) {
      logger.error(error);
      setSearchResults([]);
      setIsSearched(true);
      setTotalPages(0);
      setTotalElements(0);
    }
  };

  const onSubmit = async (data: LoanSchemeSearchForm) => {
    setLastSearchPayload(data);
    await fetchResults(data, 0);
  };

  const handlePageChange = async (page: number) => {
    // Check if we have cached results for client-side pagination
    const cachedResults = sessionStorage.getItem("loanSchemeSearchResults");
    if (cachedResults && lastSearchPayload) {
      const allResults = JSON.parse(cachedResults);
      const start = page * 10;
      const end = start + 10;
      const paginatedResults = allResults.slice(start, end);

      setSearchResults(paginatedResults);
      setCurrentPage(page);
    } else if (lastSearchPayload) {
      await fetchResults(lastSearchPayload, page);
    }
  };

  const handleReset = () => {
    reset();
    setSearchResults([]);
    setIsSearched(false);
    setCurrentPage(0);
    setTotalPages(0);
    setTotalElements(0);
    setLastSearchPayload(null);
    sessionStorage.removeItem("loanSchemeSearchResults");
  };

  return (
    <Modal
      isOpen={isOpen}
      close={onClose}
      width="5xl"
      maxHeight="95vh"
      className="!h-[80vh] !w-[95vw] !max-w-[95vw]"
      isClosable={true}
      title="Search Loan Scheme"
      titleVariant="small"
    >
      <div className="space-y-4">
        {/* Search Section */}

        <div>
          <Form.Row className="mb-3 gap-3">
            <Form.Col lg={3} md={6} span={12}>
              <Form.Field label="Loan Products">
                <Controller
                  name="loanProduct"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isSearching}
                      placeholder="Select loan product"
                      size="form"
                      variant="form"
                      fullWidth={true}
                      itemVariant="form"
                      options={loanProductOptions}
                    />
                  )}
                />
                <Form.Error error={errors.loanProduct} />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={3} md={6} span={12}>
              <Form.Field label="Scheme Name">
                <Input
                  {...register("schemeName")}
                  placeholder="Enter scheme name"
                  size="form"
                  disabled={isSearching}
                  textTransform="uppercase"
                />
                <Form.Error error={errors.schemeName} />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={3} md={6} span={12}>
              <Form.Field label="Scheme Code">
                <Input
                  {...register("schemeCode")}
                  placeholder="Enter scheme Code"
                  size="form"
                  disabled={isSearching}
                  textTransform="uppercase"
                />
                <Form.Error error={errors.schemeCode} />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={3} md={6} span={12}>
              <Form.Field label="Scheme Type">
                <Controller
                  name="schemeTypeName"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isSearching}
                      placeholder="Select scheme type"
                      size="form"
                      variant="form"
                      fullWidth={true}
                      itemVariant="form"
                      options={schemeTypeOptions}
                    />
                  )}
                />
                <Form.Error error={errors.schemeTypeName} />
              </Form.Field>
            </Form.Col>
          </Form.Row>

          <Flex gap={2} justify="end">
            <NeumorphicButton
              type="button"
              variant="secondary"
              size="secondary"
              onClick={handleReset}
              disabled={isSearching}
            >
              <RefreshCw width={12} />
              Reset
            </NeumorphicButton>
            <NeumorphicButton
              type="submit"
              variant="default"
              size="default"
              onClick={handleSubmit(onSubmit)}
              disabled={isSearching}
            >
              <Search width={12} />
              {isSearching ? "Searching..." : "Search"}
            </NeumorphicButton>
          </Flex>
        </div>
      </div>

      {/* Results Table */}
      <div>
        <Flex justify="between" align="center" className="mb-3">
          <HeaderWrapper>
            <TitleHeader
              title={`Scheme List${
                isSearched ? ` (${searchResults.length} results found)` : ""
              }`}
            />
          </HeaderWrapper>
        </Flex>

        <div className="rounded-md border">
          <CommonTable
            table={table}
            size="compact"
            noDataText={
              isSearched
                ? "No loan schemes found"
                : "Please search to view loan schemes"
            }
            className="text-xs"
          />
        </div>

        {searchResults.length > 0 && totalPages > 0 && (
          <div className="mt-4 flex items-center justify-between text-sm">
            <div className="text-muted-foreground whitespace-nowrap">
              Showing {currentPage * 10 + 1} to{" "}
              {Math.min((currentPage + 1) * 10, totalElements)} of{" "}
              {totalElements} entries
            </div>
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
        )}
      </div>
    </Modal>
  );
}
