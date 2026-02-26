import React, { useState, useMemo, useCallback } from "react";
import { useForm } from "react-hook-form";
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

import { logger } from "@/global/service";
import { useSearchCustomersQuery } from "@/global/service/end-points/master/firm-master";

interface CustomerSearchFormType {
  branchCode?: string;
  mobileNumber?: string;
  emailId?: string;
  panCard?: string;
  aadharNumber?: string;
  voterId?: string;
  passport?: string;
  customerName?: string;
}

interface CustomerSearchData {
  custId?: string;
  customerIdentity?: string;
  branchCode?: string;
  customerName?: string;
  fatherName?: string;
  houseName?: string;
  dob?: string;
  mobile?: string;
  city?: string;
}

interface CustomerSearchAssociateProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCustomer: (customer: CustomerSearchData) => void;
}

const columnHelper = createColumnHelper<CustomerSearchData>();

export function CustomerSearchAssociate({
  isOpen,
  onClose,
  onSelectCustomer,
}: CustomerSearchAssociateProps) {
  const [searchResults, setSearchResults] = useState<CustomerSearchData[]>([]);
  const [isSearched, setIsSearched] = useState(false);
  const [searchParams, setSearchParams] = useState<Record<
    string,
    string
  > | null>(null);

  // Use RTK Query for customer search
  const {
    data: searchData,
    isLoading,
    error,
  } = useSearchCustomersQuery(searchParams || {}, {
    skip: !searchParams || Object.keys(searchParams).length === 0,
  });

  const {
    register,
    handleSubmit,
    reset,

    formState: { errors, isValid },
  } = useForm<CustomerSearchFormType>({
    mode: "onBlur",
    defaultValues: {
      branchCode: undefined,
      mobileNumber: undefined,
      emailId: undefined,
      panCard: undefined,
      aadharNumber: undefined,
      voterId: undefined,
      passport: undefined,
      customerName: undefined,
    },
  });

  const handleClose = useCallback(() => {
    reset();
    setSearchResults([]);
    setIsSearched(false);
    setSearchParams(null);
    onClose();
  }, [reset, onClose]);

  const columns = useMemo(
    () => [
      columnHelper.accessor("custId", {
        header: () => <div className="text-xs font-medium">Cust ID</div>,
        cell: info => (
          <div>
            <span className="text-xs">{info.getValue()}</span>
          </div>
        ),
      }),
      columnHelper.accessor("branchCode", {
        header: () => <div className="text-xs font-medium">Branch Code</div>,
        cell: info => (
          <div>
            <span className="text-xs">{info.getValue()}</span>
          </div>
        ),
      }),
      columnHelper.accessor("customerName", {
        header: () => <div className="text-xs font-medium">Customer Name</div>,
        cell: info => (
          <div>
            <span className="text-xs">{info.getValue()}</span>
          </div>
        ),
      }),
      columnHelper.accessor("fatherName", {
        header: () => <div className="text-xs font-medium">Father's Name</div>,
        cell: info => (
          <div>
            <span className="text-xs">{info.getValue() || "-"}</span>
          </div>
        ),
      }),
      columnHelper.accessor("houseName", {
        header: () => <div className="text-xs font-medium">House Name</div>,
        cell: info => (
          <div>
            <span className="text-xs">{info.getValue() || "-"}</span>
          </div>
        ),
      }),
      columnHelper.accessor("dob", {
        header: () => <div className="text-xs font-medium">DOB</div>,
        cell: info => (
          <div>
            <span className="text-xs">{info.getValue() || "-"}</span>
          </div>
        ),
      }),
      columnHelper.accessor("mobile", {
        header: () => <div className="text-xs font-medium">Mobile</div>,
        cell: info => {
          const mobile = info.getValue();
          const maskedMobile = mobile ? `xxxxx${mobile.slice(-4)}` : "-";

          return (
            <div>
              <span className="text-xs">{maskedMobile}</span>
            </div>
          );
        },
      }),
      columnHelper.accessor("city", {
        header: () => <div className="text-xs font-medium">City</div>,
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
                const customer = row.original;
                onSelectCustomer(customer);
                handleClose();
              }}
            >
              Select →
            </Button>
          </div>
        ),
      }),
    ],
    [onSelectCustomer, handleClose]
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

  // Update search results when data changes
  React.useEffect(() => {
    if (searchData) {
      // Filter to show only customers (not leads) and transform data
      const filteredData = (searchData ?? [])
        .filter(customer => customer?.isCustomerExist === true)
        .map(customer => ({
          custId: customer.customerCode,
          customerIdentity: customer.customerIdentity,
          branchCode: customer.branchCode,
          customerName:
            customer.displayName ||
            `${customer.firstName ?? ""} ${customer.lastName ?? ""}`.trim(),
          fatherName: customer.fatherName,
          houseName: customer.houseName,
          dob: customer.dob,
          mobile: customer.mobile,
          city: customer.city,
        }));

      setSearchResults(filteredData);
      setIsSearched(true);

      if (filteredData.length === 0) {
        toast.error("No customers found with the given search criteria", {
          duration: 4000,
          position: "bottom-right",
        });
      } else {
        toast.success(`Found ${filteredData.length} customer(s)`, {
          duration: 3000,
          position: "bottom-right",
        });
      }
    }
  }, [searchData]);

  // Handle search errors
  React.useEffect(() => {
    if (error) {
      logger.error(error);
      setSearchResults([]);
      setIsSearched(true);
      toast.error("Failed to search customers. Please try again.", {
        duration: 4000,
        position: "bottom-right",
      });
    }
  }, [error]);

  const onSubmit = async (data: CustomerSearchFormType) => {
    // Prevent multiple simultaneous searches
    if (isLoading) {
      return;
    }

    if (!isValid) {
      return;
    }

    // Filter out empty values and map field names
    const filteredData = Object.fromEntries(
      Object.entries(data).filter(
        ([, value]) =>
          value !== undefined &&
          value !== null &&
          value !== "" &&
          String(value).trim() !== ""
      )
    );

    // Check if at least one search parameter is provided
    if (Object.keys(filteredData).length === 0) {
      toast.error("Please provide at least one search criteria", {
        duration: 3000,
        position: "bottom-right",
      });
      return;
    }

    // Map form fields to API parameters
    const apiParams: Record<string, string> = {};
    if (filteredData.branchCode)
      apiParams.branchCode = String(filteredData.branchCode).trim();
    if (filteredData.mobileNumber)
      apiParams.mobileNumber = String(filteredData.mobileNumber).trim();
    if (filteredData.emailId)
      apiParams.emailId = String(filteredData.emailId).trim();
    if (filteredData.panCard)
      apiParams.panCard = String(filteredData.panCard).trim();
    if (filteredData.aadharNumber)
      apiParams.aadhaarNumber = String(filteredData.aadharNumber).trim(); // Note: API expects 'aadhaarNumber'
    if (filteredData.voterId)
      apiParams.voterId = String(filteredData.voterId).trim();
    if (filteredData.passport)
      apiParams.passportNumber = String(filteredData.passport).trim(); // Note: API expects 'passportNumber'
    if (filteredData.customerName)
      apiParams.customerName = String(filteredData.customerName).trim();

    // Clear previous results before new search
    setSearchResults([]);
    setIsSearched(false);

    // Add timestamp to force new API call and prevent caching issues
    const paramsWithTimestamp = {
      ...apiParams,
      _t: Date.now().toString(),
    };

    setSearchParams(paramsWithTimestamp);
  };
  if (!isOpen) return null;

  const toUpper = (value: unknown) =>
    typeof value === "string" ? value.toUpperCase() : value;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-lg bg-white shadow-xl">
        {/* Modal Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-6 py-4">
          <h2 className="text-lg font-semibold">Customer Search</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            disabled={isLoading}
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
            <Form
              onSubmit={e => {
                e.preventDefault();
                e.stopPropagation();
                handleSubmit(onSubmit)(e);
              }}
            >
              {/* First Row: Branch Code, Mobile Number, Email ID, PAN Card */}
              <Form.Row className="mb-4 gap-4">
                <Form.Col lg={3} md={6} span={12}>
                  <Form.Field label="Branch Code" className="text-sm">
                    <Input
                      type="text"
                      {...register("branchCode", {
                        setValueAs: toUpper,
                      })}
                      placeholder="Branch code"
                      size="form"
                      variant="form"
                      disabled={isLoading}
                      className="uppercase"
                    />
                    <Form.Error error={errors.branchCode} />
                  </Form.Field>
                </Form.Col>

                <Form.Col lg={3} md={6} span={12}>
                  <Form.Field label="Mobile Number" className="text-sm">
                    <Input
                      type="text"
                      {...register("mobileNumber", {
                        setValueAs: toUpper,
                      })}
                      placeholder="Enter mobile number"
                      size="form"
                      variant="form"
                      disabled={isLoading}
                      maxLength={10}
                    />
                    <Form.Error error={errors.mobileNumber} />
                  </Form.Field>
                </Form.Col>

                <Form.Col lg={3} md={6} span={12}>
                  <Form.Field label="Email ID" className="text-sm">
                    <Input
                      type="email"
                      {...register("emailId", {
                        setValueAs: toUpper,
                      })}
                      placeholder="Enter email id"
                      size="form"
                      variant="form"
                      disabled={isLoading}
                    />
                    <Form.Error error={errors.emailId} />
                  </Form.Field>
                </Form.Col>

                <Form.Col lg={3} md={6} span={12}>
                  <Form.Field label="PAN Card" className="text-sm">
                    <Input
                      type="text"
                      {...register("panCard", {
                        setValueAs: toUpper,
                      })}
                      placeholder="ABCDE1234A"
                      size="form"
                      variant="form"
                      disabled={isLoading}
                      className="uppercase"
                    />
                    <Form.Error error={errors.panCard} />
                  </Form.Field>
                </Form.Col>
              </Form.Row>

              {/* Second Row: Aadhar Number, Voter ID, Passport, Customer name */}
              <Form.Row className="gap-4">
                <Form.Col lg={3} md={6} span={12}>
                  <Form.Field label="Aadhar Number" className="text-sm">
                    <Input
                      type="text"
                      {...register("aadharNumber", {
                        setValueAs: toUpper,
                      })}
                      placeholder="XXXX XXXX XXXX"
                      size="form"
                      variant="form"
                      disabled={isLoading}
                      maxLength={12}
                    />
                    <Form.Error error={errors.aadharNumber} />
                  </Form.Field>
                </Form.Col>

                <Form.Col lg={3} md={6} span={12}>
                  <Form.Field label="Voter ID" className="text-sm">
                    <Input
                      type="text"
                      {...register("voterId", {
                        setValueAs: toUpper,
                      })}
                      placeholder="Enter voter ID"
                      size="form"
                      variant="form"
                      disabled={isLoading}
                    />
                    <Form.Error error={errors.voterId} />
                  </Form.Field>
                </Form.Col>

                <Form.Col lg={3} md={6} span={12}>
                  <Form.Field label="Passport" className="text-sm">
                    <Input
                      type="text"
                      {...register("passport", {
                        setValueAs: toUpper,
                      })}
                      placeholder="Enter passport number"
                      size="form"
                      variant="form"
                      disabled={isLoading}
                      className="uppercase"
                    />
                    <Form.Error error={errors.passport} />
                  </Form.Field>
                </Form.Col>

                <Form.Col lg={3} md={6} span={12}>
                  <Form.Field label="Customer name" className="text-sm">
                    <Input
                      type="text"
                      {...register("customerName", {
                        setValueAs: toUpper,
                      })}
                      placeholder="Enter customer name"
                      size="form"
                      variant="form"
                      disabled={isLoading}
                      className="uppercase"
                    />
                    <Form.Error error={errors.customerName} />
                  </Form.Field>
                </Form.Col>
              </Form.Row>

              {/* Action Buttons Row */}
              <Form.Row className="mt-4 gap-4">
                <Form.Col span={12}>
                  <div className="flex items-center justify-end">
                    <Flex gap={2}>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          reset();
                          setSearchResults([]);
                          setIsSearched(false);
                          setSearchParams(null);
                          table.setPageIndex(0);
                        }}
                        disabled={isLoading}
                        className="border-blue-600 text-sm  text-blue-600 hover:border-blue-700"
                      >
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Reset
                      </Button>
                      <Button
                        type="button"
                        variant="default"
                        disabled={isLoading}
                        onClick={e => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleSubmit(onSubmit)(e);
                        }}
                        className="bg-primary text-sm hover:bg-blue-700"
                      >
                        <Search className="mr-2 h-4 w-4" />
                        {isLoading ? "Searching..." : "Search"}
                      </Button>
                    </Flex>
                  </div>
                </Form.Col>
              </Form.Row>
            </Form>
          </div>

          {/* Customer Search Results Section */}
          <div className="border-t pt-6">
            <div className="mb-4">
              <h3 className="text-base font-semibold">Customer Search</h3>
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
                  size="default"
                  noDataText={
                    isSearched
                      ? "No customers found"
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
