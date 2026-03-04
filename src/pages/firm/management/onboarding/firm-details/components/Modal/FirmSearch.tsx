import React, { useState, useMemo, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { RotateCcw, Search, X } from "lucide-react";
import toast from "react-hot-toast";
import {
  useReactTable,
  getCoreRowModel,
  createColumnHelper,
  getPaginationRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import {
  Button,
  Input,
  Select,
  Form,
  Flex,
  CommonTable,
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components";
import type { FirmProfile } from "@/types/firm/firm-details.types";
import { logger, useGetDocumentTypesUsageForFirmQuery } from "@/global/service";
import { useSearchFirmQuery } from "@/global/service/";
import { useGetFirmTypesQuery } from "@/global/service/end-points/master/firm-master";
import CapsuleButton from "@/components/ui/capsule-button/capsule-button";
import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button";

interface FirmSearchFormType {
  typeOfFirm?: string;
  firmName?: string;
  registrationNo?: string;
  contactNumber?: string;
  documentType?: string;
  idNumber?: string;
}

interface FirmSearchData extends FirmProfile {
  firmTypeIdentity?: string;
  contactNumber?: string;
  documentType?: string;
  idNumber?: string;
}

interface FirmSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectFirm: (firm: FirmProfile) => void;
}

const columnHelper = createColumnHelper<FirmSearchData>();

export function FirmSearchModal({
  isOpen,
  onClose,
  onSelectFirm,
}: FirmSearchModalProps) {
  const [searchResults, setSearchResults] = useState<FirmSearchData[]>([]);
  const [isSearched, setIsSearched] = useState(false);
  const [searchParams, setSearchParams] = useState<Record<
    string,
    string
  > | null>(null);

  const {
    data: searchData,
    isLoading: isSearching,
    error,
  } = useSearchFirmQuery(searchParams || {}, {
    skip: searchParams === null,
  });
  const { data: firmTypes = [], isLoading: isLoadingFirmTypes } =
    useGetFirmTypesQuery();
  const { data: documentTypes = [], isLoading: isLoadingDocumentTypes } =
    useGetDocumentTypesUsageForFirmQuery();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<FirmSearchFormType>({
    mode: "onChange",
    defaultValues: {
      typeOfFirm: "",
      firmName: "",
      registrationNo: "",
      contactNumber: "",
      documentType: "",
      idNumber: "",
    },
  });

  const handleClose = useCallback(() => {
    reset();
    setSearchResults([]);
    setIsSearched(false);
    onClose();
  }, [reset, onClose]);

  const columns = useMemo(
    () => [
      columnHelper.accessor("firmTypeIdentity", {
        header: () => <div className="text-xs font-medium">Firm Type</div>,
        cell: info => {
          const firmTypeId = info.getValue();
          const rowData = info.row.original as unknown as Record<
            string,
            unknown
          >;

          // Try different possible field names
          const actualFirmTypeId =
            firmTypeId ||
            String(rowData.firmType || "") ||
            String(rowData.typeOfFirm || "") ||
            String(rowData.firmTypeId || "");
          const firmType = Array.isArray(firmTypes)
            ? firmTypes.find(type => type.identity === actualFirmTypeId)
            : undefined;

          return (
            <div>
              <span className="text-xs">
                {firmType?.firmType || String(actualFirmTypeId) || "-"}
              </span>
            </div>
          );
        },
      }),
      columnHelper.accessor("firmName", {
        header: () => <div className="text-xs font-medium">Firm Name</div>,
        cell: info => {
          const rowData = info.row.original as unknown as Record<
            string,
            unknown
          >;
          const firmName =
            info.getValue() ||
            String(rowData.name || "") ||
            String(rowData.companyName || "");
          return (
            <div>
              <span className="text-xs">{String(firmName) || "-"}</span>
            </div>
          );
        },
      }),
      columnHelper.accessor("registrationNo", {
        header: () => (
          <div className="text-xs font-medium">Registration No</div>
        ),
        cell: info => (
          <div>
            <span className="text-xs">{info.getValue()}</span>
          </div>
        ),
      }),
      columnHelper.accessor("documentType", {
        header: () => <div className="text-xs font-medium">Document Type</div>,
        cell: info => {
          const documentTypeId = info.getValue();
          const rowData = info.row.original as unknown as Record<
            string,
            unknown
          >;

          // Try to get document type ID from different possible fields
          const actualDocumentTypeId =
            documentTypeId ||
            String(rowData.documentTypeIdentity || "") ||
            String(rowData.documentTypeId || "");

          const documentType = Array.isArray(documentTypes)
            ? documentTypes.find(type => type.identity === actualDocumentTypeId)
            : undefined;

          return (
            <div>
              <span className="text-xs">
                {(documentType as { displayName?: string })?.displayName ||
                  documentType?.name ||
                  String(actualDocumentTypeId) ||
                  "-"}
              </span>
            </div>
          );
        },
      }),
      columnHelper.accessor("idNumber", {
        header: () => <div className="text-xs font-medium">ID Number</div>,
        cell: info => (
          <div>
            <span className="text-xs">{info.getValue() || "-"}</span>
          </div>
        ),
      }),
      columnHelper.accessor("contactNumber", {
        header: () => <div className="text-xs font-medium">Contact No</div>,
        cell: info => (
          <div>
            <span className="text-xs">{info.getValue() || "-"}</span>
          </div>
        ),
      }),
      columnHelper.display({
        id: "action",
        header: () => <div className="text-xs font-medium">Action</div>,
        cell: ({ row }) => (
          <div>
            <Button
              variant="link"
              size="sm"
              className="text-theme-primary hover:text-theme-primary/80 h-auto p-0 text-xs font-normal"
              onClick={() => {
                const firm = row.original;
                onSelectFirm(firm);
                handleClose();
              }}
            >
              Edit
            </Button>
          </div>
        ),
      }),
    ],
    [onSelectFirm, firmTypes, documentTypes, handleClose]
  );

  const table = useReactTable({
    data: searchResults,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  const onSubmit = (data: FirmSearchFormType) => {
    // Prevent multiple simultaneous searches
    if (isSearching) {
      return;
    }

    // Filter out empty values and map to API format
    const searchData: Record<string, string> = {};

    if (data.typeOfFirm?.trim()) {
      searchData.typeOfFirm = data.typeOfFirm.trim();
    }
    if (data.firmName?.trim()) searchData.firmName = data.firmName.trim();
    if (data.registrationNo?.trim())
      searchData.registrationNo = data.registrationNo.trim();
    if (data.contactNumber?.trim())
      searchData.contactNumber = data.contactNumber.trim();
    if (data.documentType?.trim())
      searchData.documentType = data.documentType.trim();
    if (data.idNumber?.trim()) searchData.idNumber = data.idNumber.trim();

    // Clear previous results before new search
    setSearchResults([]);
    setIsSearched(false);

    setSearchParams(searchData);
  };

  // Handle search results
  React.useEffect(() => {
    if (searchData) {
      try {
        // Handle different response structures
        let results: unknown[] = [];
        let foundArray = false;

        if (Array.isArray(searchData)) {
          results = searchData;
          foundArray = true;
        } else if (searchData && typeof searchData === "object") {
          // Try all possible nested array locations
          const responseObj = searchData as Record<string, unknown>;
          const possibleArrays = [
            responseObj.data,
            responseObj.firms,
            responseObj.results,
            responseObj.content,
            responseObj.items,
            responseObj.list,
            responseObj.searchResults,
            responseObj.firmList,
          ];

          for (const arr of possibleArrays) {
            if (Array.isArray(arr)) {
              results = arr;
              foundArray = true;
              break;
            }
          }

          if (!foundArray && responseObj) {
            results = [responseObj as unknown as FirmSearchData];
          }
        }

        // Set results and show success/error messages
        setSearchResults(results as FirmSearchData[]);
        setIsSearched(true);
        table.setPageIndex(0);

        if (!results || results.length === 0) {
          toast.error("No firms found with the given search criteria", {
            duration: 4000,
            position: "bottom-right",
          });
        } else {
          toast.success(`Found ${results.length} firm(s)`, {
            duration: 3000,
            position: "bottom-right",
          });
        }
      } catch (error) {
        logger.error(error);
        setSearchResults([]);
        setIsSearched(true);
        toast.error("Failed to search firms. Please try again.", {
          duration: 4000,
          position: "bottom-right",
        });
      }
    }
  }, [searchData, table]);

  // Handle search errors
  React.useEffect(() => {
    if (error) {
      logger.error(error);
      setSearchResults([]);
      setIsSearched(true);
      toast.error("Failed to search firms. Please try again.", {
        duration: 4000,
        position: "bottom-right",
      });
    }
  }, [error]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-lg bg-white shadow-xl">
        {/* Modal Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-6 py-4">
          <h2 className="text-lg font-semibold">Search Firms</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            disabled={isSearching}
            className="h-8 w-8 rounded-full border border-black text-black hover:bg-gray-100 hover:text-black"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Modal Body - Scrollable */}
        <div
          className="overflow-y-auto px-6 py-4"
          style={{ maxHeight: "calc(90vh - 140px)" }}
        >
          {/* Search Form Section */}
          <div className="mb-6">
            <Form onSubmit={handleSubmit(onSubmit)}>
              {/* First Row: Firm Type, Firm Name, Registration No, Contact No */}
              <Form.Row className="mb-4 gap-4">
                <Form.Col lg={3} md={6} span={12}>
                  <Form.Field label="Firm Type" className="text-sm">
                    <Controller
                      name="typeOfFirm"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={isSearching || isLoadingFirmTypes}
                          placeholder="Select Firm Type"
                          size="form"
                          variant="form"
                          fullWidth={true}
                          itemVariant="form"
                          options={(Array.isArray(firmTypes) ? firmTypes : [])
                            .filter(type => type.identity)
                            .map(type => ({
                              value: type.identity!,
                              label: type.firmType,
                            }))}
                        />
                      )}
                    />
                    <Form.Error error={errors.typeOfFirm} />
                  </Form.Field>
                </Form.Col>

                <Form.Col lg={3} md={6} span={12}>
                  <Form.Field label="Firm Name" className="text-sm">
                    <Input
                      type="text"
                      {...register("firmName")}
                      placeholder="Enter Firm Name"
                      size="form"
                      variant="form"
                      disabled={isSearching}
                    />
                    <Form.Error error={errors.firmName} />
                  </Form.Field>
                </Form.Col>

                <Form.Col lg={3} md={6} span={12}>
                  <Form.Field label="Registration No" className="text-sm">
                    <Input
                      type="text"
                      {...register("registrationNo")}
                      placeholder="Enter registration number"
                      size="form"
                      variant="form"
                      disabled={isSearching}
                    />
                    <Form.Error error={errors.registrationNo} />
                  </Form.Field>
                </Form.Col>

                <Form.Col lg={3} md={6} span={12}>
                  <Form.Field label="Contact No" className="text-sm">
                    <Input
                      type="text"
                      {...register("contactNumber")}
                      placeholder="Enter Contact No"
                      size="form"
                      variant="form"
                      disabled={isSearching}
                      maxLength={10}
                    />
                    <Form.Error error={errors.contactNumber} />
                  </Form.Field>
                </Form.Col>
              </Form.Row>

              {/* Second Row: Document Type, ID Number, Buttons */}
              <Form.Row className="gap-4">
                <Form.Col lg={3} md={6} span={12}>
                  <Form.Field label="Document Type" className="text-sm">
                    <Controller
                      name="documentType"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={isSearching || isLoadingDocumentTypes}
                          placeholder="Select Document Type"
                          size="form"
                          variant="form"
                          fullWidth={true}
                          itemVariant="form"
                          options={(Array.isArray(documentTypes)
                            ? documentTypes
                            : []
                          )
                            .filter(type => type.identity)
                            .map(type => ({
                              value: type.identity!,
                              label:
                                (type as { displayName?: string })
                                  .displayName ??
                                type.name ??
                                "",
                            }))}
                        />
                      )}
                    />
                    <Form.Error error={errors.documentType} />
                  </Form.Field>
                </Form.Col>

                <Form.Col lg={3} md={6} span={12}>
                  <Form.Field label="ID Number" className="text-sm">
                    <Input
                      type="text"
                      {...register("idNumber")}
                      placeholder="Enter ID Number"
                      size="form"
                      variant="form"
                      disabled={isSearching}
                    />
                    <Form.Error error={errors.idNumber} />
                  </Form.Field>
                </Form.Col>

                <Form.Col lg={6} md={12} span={12}>
                  <div className="flex h-full items-end justify-end pb-1">
                    <Flex gap={2}>
                      <NeumorphicButton
                        type="button"
                        variant="outline"
                        onClick={() => {
                          reset();
                          setSearchResults([]);
                          setIsSearched(false);
                          table.setPageIndex(0);
                        }}
                        disabled={isSearching}
                        className="border-blue-600 text-sm text-blue-600 hover:border-blue-700 hover:text-blue-700"
                      >
                        <RotateCcw className="mr-2 h-4 w-4 " />
                        Reset
                      </NeumorphicButton>
                      {/* <Button
                        type="button"
                        variant="default"

                        className="bg-primary hover:bg-primary text-sm"
                        onClick={handleSubmit(onSubmit)}
                      >
                        <Search className="mr-2 h-4 w-4 " />
                        {isSearching ? "Searching..." : "Search"}
                      </Button> */}
                      <CapsuleButton
                        onClick={handleSubmit(onSubmit)}
                        label="Search"
                        icon={Search}
                        disabled={isSearching}
                      />
                    </Flex>
                  </div>
                </Form.Col>
              </Form.Row>
            </Form>
          </div>

          {/* Firm Details Section */}
          <div className="border-t pt-6">
            <div className="mb-4">
              <h3 className="text-base font-semibold">Firm Details</h3>
            </div>

            <div className="overflow-hidden rounded-lg border">
              <div
                className="scrollbar-hide overflow-auto"
                style={{
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                }}
              >
                <CommonTable
                  table={table}
                  size="compact"
                  noDataText={
                    isSearched
                      ? "No firms found"
                      : "Please search to view results"
                  }
                  className="text-xs"
                />
              </div>
            </div>

            {/* Pagination */}
            {searchResults.length > 0 && (
              <div className="mt-4 flex justify-end">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => table.previousPage()}
                        className={`text-muted-foreground hover:text-foreground text-xs ${
                          !table.getCanPreviousPage()
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }`}
                      />
                    </PaginationItem>

                    {Array.from(
                      { length: table.getPageCount() },
                      (_, i) => i + 1
                    ).map(page => {
                      const totalPages = table.getPageCount();
                      const currentPage =
                        table.getState().pagination.pageIndex + 1;

                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1) ||
                        (currentPage <= 3 && page <= 3) ||
                        (currentPage >= totalPages - 2 &&
                          page >= totalPages - 2)
                      ) {
                        return (
                          <PaginationItem key={page}>
                            <PaginationLink
                              onClick={() => table.setPageIndex(page - 1)}
                              isActive={currentPage === page}
                              className={`text-foreground hover:text-primary cursor-pointer text-xs ${
                                currentPage === page
                                  ? "border-border bg-muted rounded-md border shadow-sm"
                                  : ""
                              }`}
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      } else if (
                        page === currentPage - 2 ||
                        page === currentPage + 2
                      ) {
                        return (
                          <PaginationItem key={page}>
                            <PaginationEllipsis className="text-muted-foreground text-xs" />
                          </PaginationItem>
                        );
                      }
                      return null;
                    })}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() => table.nextPage()}
                        className={`text-muted-foreground hover:text-primary text-xs ${
                          !table.getCanNextPage()
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }`}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
