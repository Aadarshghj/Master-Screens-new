import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Search, RefreshCw, Eye, CirclePlus } from "lucide-react";
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
  HeaderWrapper,
  TitleHeader,
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
  TooltipContent,
  Tooltip,
  TooltipTrigger,
  TooltipProvider,
} from "@/components";
import type { CustomerData, CustomerSearchProps } from "@/types";
import { logger } from "@/global/service";
import { useSearchCustomerMutation } from "@/global/service";
import { customerSearchFormSchema } from "@/global/validation/customer/customer-search-schema";
import type { CustomerSearchFormType } from "@/global/validation/customer/customer-search-schema";
import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button";
import { useAppDispatch } from "@/hooks/store";
import {
  resetCustomerData,
  setCustomerData,
} from "@/global/reducers/customer/customer-details.reducer";
import { clearViewCustomerIdentity } from "@/global/reducers/customer/customer-identity-view.reducer";

const columnHelper = createColumnHelper<CustomerData>();

export function CustomerSearch({
  onSelectCustomer,
  onSearchResults,
  toggleViewCustomerDetails,
  handleSetCustomerId,
}: CustomerSearchProps) {
  const [searchResults, setSearchResults] = useState<CustomerData[]>([]);
  const [isSearched, setIsSearched] = useState(false);
  const [searchCustomer, { isLoading: isSearching }] =
    useSearchCustomerMutation();
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(customerSearchFormSchema),
    mode: "onChange",
    defaultValues: {
      customerId: "",
      customerName: "",
      mobile: "",
      email: "",
      branchCode: "",
      branchId: undefined,
      panCard: "",
      aadharNumber: "",
      voterId: "",
      passport: "",
    },
  });
  const handleClickCustomer = (id: string) => {
    toggleViewCustomerDetails();
    handleSetCustomerId(id);
  };
  const columns = useMemo(
    () => [
      columnHelper.accessor("customerCode", {
        header: () => <div>Cust ID</div>,
        cell: info => (
          <div>
            <span className="text-xss">{info.getValue()}</span>
          </div>
        ),
      }),
      columnHelper.accessor("branchCode", {
        header: () => <div className="text-center">Branch Code</div>,
        cell: info => (
          <div className="text-center">
            <span className="text-xss">{info.getValue() || "-"}</span>
          </div>
        ),
      }),
      columnHelper.accessor("firstName", {
        header: () => <div className="text-center">Customer Name</div>,
        cell: info => (
          <div className="text-center">
            <span className="text-xss font-medium capitalize">
              {info.getValue() || "-"}
            </span>
          </div>
        ),
      }),
      columnHelper.accessor("fatherName", {
        header: () => <div className="text-center">Father's Name</div>,
        cell: info => (
          <div className="text-center">
            <span className="text-xss capitalize">
              {info.getValue() || "-"}
            </span>
          </div>
        ),
      }),
      columnHelper.accessor("houseName", {
        header: () => <div className="text-center">House Name</div>,
        cell: info => (
          <div className="text-center">
            <span className="text-xss">{info.getValue() || "-"}</span>
          </div>
        ),
      }),
      columnHelper.accessor("mobile", {
        header: () => <div className="text-center">Mobile</div>,
        cell: info => {
          const mobile = info.getValue();
          // Mask mobile number for privacy

          return (
            <div className="text-center">
              <span className="text-xss">{mobile}</span>
            </div>
          );
        },
      }),
      columnHelper.accessor("city", {
        header: () => <div className="text-center">City</div>,
        cell: info => (
          <div className="text-center">
            <span className="text-xss">{info.getValue() || "-"}</span>
          </div>
        ),
      }),
      columnHelper.display({
        id: "action",
        header: () => <div className="text-right">Action</div>,
        cell: ({ row }) => {
          const isLeadExist = row.original.isLeadExist;
          const handleClick = () => {
            if (isLeadExist) {
              dispatch(
                setCustomerData({
                  customerFirstName: row.original.firstName,
                  mobileNumber: row.original.mobile,
                  customerMiddleName: row.original.middleName,
                  customerLastName: row.original.lastName,
                })
              );
            }
            handleClickCustomer(row.original.customerIdentity);
          };
          return (
            <div className="text-right">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="xs"
                      className="h-6 w-6 p-0 text-cyan-400 hover:bg-cyan-400/70"
                      onClick={handleClick}
                    >
                      <TooltipContent side="left" className="px-1 py-0.5">
                        <p className="text-[10px]">
                          {isLeadExist ? "Add as customer" : "View customer"}
                        </p>
                      </TooltipContent>
                      {isLeadExist ? (
                        <CirclePlus className="w-3" />
                      ) : (
                        <Eye className="w-3" />
                      )}
                    </Button>
                  </TooltipTrigger>
                </Tooltip>
              </TooltipProvider>
            </div>
          );
        },
      }),
    ],
    [onSelectCustomer]
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

  const onSubmit = async (data: CustomerSearchFormType) => {
    dispatch(clearViewCustomerIdentity());
    dispatch(resetCustomerData());
    // Only proceed if form is valid
    if (!isValid) {
      return;
    }

    try {
      // Filter out empty/undefined values to avoid sending unnecessary parameters
      const searchData = Object.fromEntries(
        Object.entries(data).filter(
          ([, value]) => value !== undefined && value !== null && value !== ""
        )
      ) as CustomerSearchFormType;

      const results = await searchCustomer(searchData).unwrap();
      setSearchResults(results.content);
      setIsSearched(true);

      // Reset pagination to first page when new search is performed
      table.setPageIndex(0);

      // Check if no customers were found
      if (!results || results.content.length === 0) {
        toast.error("No customers found with the given search criteria", {
          duration: 4000,
          position: "bottom-right",
        });
      } else {
        toast.success(`Found ${results.content.length} customer(s)`, {
          duration: 3000,
          position: "bottom-right",
        });
      }

      if (onSearchResults) {
        onSearchResults(results.content);
      }
    } catch (error) {
      logger.error(error);
      setSearchResults([]);
      setIsSearched(true);

      // Show error toast
      toast.error("Failed to search customers. Please try again.", {
        duration: 4000,
        position: "bottom-right",
      });
    }
  };

  return (
    <div className="">
      <div>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Row className="mb-3 gap-3">
            <Form.Col lg={3} md={6} span={12}>
              <Form.Field label="Branch Code">
                <Input
                  type="text"
                  {...register("branchCode")}
                  placeholder="Enter Home Branch"
                  size="form"
                  variant="form"
                  disabled={isSearching}
                  textTransform="uppercase"
                />
                <Form.Error error={errors.branchCode} />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={3} md={6} span={12}>
              <Form.Field label="Mobile Number">
                <Input
                  type="text"
                  {...register("mobile")}
                  placeholder="Enter mobile number"
                  size="form"
                  variant="form"
                  disabled={isSearching}
                  maxLength={10}
                  inputType="number"
                />
                <Form.Error error={errors.mobile} />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={3} md={6} span={12}>
              <Form.Field label="Email ID">
                <Input
                  type="email"
                  {...register("email")}
                  placeholder="Enter email id"
                  size="form"
                  variant="form"
                  disabled={isSearching}
                />
                <Form.Error error={errors.email} />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={3} md={6} span={12}>
              <Form.Field label="PAN Card">
                <Input
                  type="text"
                  {...register("panCard")}
                  placeholder="ABCDE1234A"
                  size="form"
                  variant="form"
                  disabled={isSearching}
                  maxLength={10}
                  textTransform="uppercase"
                />
                <Form.Error error={errors.panCard} />
              </Form.Field>
            </Form.Col>
          </Form.Row>

          <Form.Row className="gap-3">
            <Form.Col lg={3} md={6} span={12}>
              <Form.Field label="Aadhaar Number">
                <Input
                  type="text"
                  {...register("aadharNumber")}
                  placeholder="XXXX XXXX XXXX"
                  size="form"
                  variant="form"
                  disabled={isSearching}
                  maxLength={12}
                  inputType="number"
                  textTransform="uppercase"
                />

                <Form.Error error={errors.aadharNumber} />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={3} md={6} span={12}>
              <Form.Field label="Voter ID">
                <Input
                  type="text"
                  {...register("voterId")}
                  placeholder="Enter voter ID"
                  size="form"
                  variant="form"
                  disabled={isSearching}
                  textTransform="uppercase"
                />
                <Form.Error error={errors.voterId} />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={3} md={6} span={12}>
              <Form.Field label="Passport">
                <Input
                  type="text"
                  {...register("passport")}
                  placeholder="Enter passport number"
                  size="form"
                  variant="form"
                  disabled={isSearching}
                  textTransform="uppercase"
                />
                <Form.Error error={errors.passport} />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={3} md={6} span={12}>
              <Form.Field label="Customer Name">
                <Input
                  type="text"
                  {...register("customerName")}
                  placeholder="Enter customer name"
                  size="form"
                  variant="form"
                  className="text-xs uppercase"
                  disabled={isSearching}
                  textTransform="uppercase"
                />
                <Form.Error error={errors.customerName} />
              </Form.Field>
            </Form.Col>
          </Form.Row>

          <Form.Row className="flex justify-end">
            <Form.Col lg={3} md={6} span={12}>
              <div className="">
                <Flex gap={2}>
                  <NeumorphicButton
                    type="button"
                    variant="secondary"
                    size="secondary"
                    onClick={() => {
                      reset();
                      setSearchResults([]);
                      setIsSearched(false);
                      table.setPageIndex(0);
                    }}
                    disabled={isSearching}
                  >
                    <RefreshCw width={12} />
                    Reset
                  </NeumorphicButton>
                  <NeumorphicButton
                    type="submit"
                    variant="default"
                    size="default"
                    disabled={isSearching || !isValid}
                  >
                    <Search width={12} />
                    {isSearching ? "Searching..." : "Search"}
                  </NeumorphicButton>
                </Flex>
              </div>
            </Form.Col>
          </Form.Row>
        </Form>
      </div>

      <div>
        <Flex justify="between" align="center" className="mb-1">
          <HeaderWrapper>
            <TitleHeader title="Customer Search" className="text-xs" />
          </HeaderWrapper>
        </Flex>

        <div className="overflow-hidden rounded-md border">
          <div
            className="scrollbar-hide overflow-auto"
            style={{
              scrollbarWidth: "none" /* Firefox */,
              msOverflowStyle: "none" /* Internet Explorer 10+ */,
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

        {searchResults.length > 0 && (
          <div className="mt-2 flex justify-end">
            <div className="flex flex-col items-end space-y-1">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => table.previousPage()}
                      className={`text-muted-foreground hover:text-foreground text-[11px] ${
                        !table.getCanPreviousPage()
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }`}
                    />
                  </PaginationItem>

                  {/* Page numbers */}
                  {Array.from(
                    { length: table.getPageCount() },
                    (_, i) => i + 1
                  ).map(page => {
                    // Show first 3 pages, last 3 pages, and current page with ellipsis
                    const totalPages = table.getPageCount();
                    const currentPage =
                      table.getState().pagination.pageIndex + 1;

                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1) ||
                      (currentPage <= 3 && page <= 3) ||
                      (currentPage >= totalPages - 2 && page >= totalPages - 2)
                    ) {
                      return (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => table.setPageIndex(page - 1)}
                            isActive={currentPage === page}
                            className={`text-foreground hover:text-primary cursor-pointer text-[11px] ${
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
                          <PaginationEllipsis className="text-muted-foreground text-[11px]" />
                        </PaginationItem>
                      );
                    }
                    return null;
                  })}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => table.nextPage()}
                      className={`text-muted-foreground hover:text-primary text-[11px] ${
                        !table.getCanNextPage()
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }`}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
