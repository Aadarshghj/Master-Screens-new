import React, { useMemo, useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import {
  CommonTable,
  Grid,
  TitleHeader,
  Button,
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationNext,
  Flex,
  PaginationEllipsis,
} from "@/components";
import {
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type {
  ApproverRoleMappingFilters,
  ApproverRoleMappingForm,
  ApproverRoleMappingTableProps,
} from "@/types/admin/approverrolemap";
import { ApproverRoleMappingFilterBar } from "../Filter/ApproverRoleMapFilter";
import { APPROVER_ROLE_MAPPING_FILTERS_DEFAULT } from "../../constants/approverRoleMap-default";

const columnHelper = createColumnHelper<ApproverRoleMappingForm>();

export const ApproverRoleMappingTable: React.FC<
  ApproverRoleMappingTableProps
> = ({ data, onEdit, onDelete }) => {
  const [filters, setFilters] = useState<ApproverRoleMappingFilters>(
    APPROVER_ROLE_MAPPING_FILTERS_DEFAULT
  );

  const filteredData = useMemo(() => {
    return data.filter(item => {
      return (
        (filters.roleCode === "" || item.roleCode === filters.roleCode) &&
        (filters.userCode === "" || item.userCode === filters.userCode) &&
        (filters.branchCode === "" || item.branchCode === filters.branchCode) &&
        (filters.regionCode === "" || item.regionCode === filters.regionCode) &&
        (filters.clusterCode === "" ||
          item.clusterCode === filters.clusterCode) &&
        (filters.stateCode === "" || item.stateCode === filters.stateCode)
      );
    });
  }, [data, filters]);

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "serialNo",
        header: "S.No",
        cell: ({ row }) => row.index + 1,
      }),

      columnHelper.accessor("roleCode", { header: "Role Code" }),
      columnHelper.accessor("userCode", { header: "User Code" }),
      columnHelper.accessor("branchCode", { header: "Branch Code" }),
      columnHelper.accessor("regionCode", { header: "Region Code" }),
      columnHelper.accessor("clusterCode", { header: "Cluster Code" }),
      columnHelper.accessor("stateCode", { header: "State Code" }),

      columnHelper.accessor("isActive", {
        header: "Status",
        cell: info => (
          <span
            className={`text-xs font-medium ${
              info.getValue() ? "text-green-600" : "text-muted-foreground"
            }`}
          >
            {info.getValue() ? "Active" : "Inactive"}
          </span>
        ),
      }),

      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="xs"
              onClick={() => onEdit(row.original)}
            >
              <Edit className="h-4 w-4 text-blue-500" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="text-destructive"
              onClick={() => onDelete(row.original.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ),
      }),
    ],
    [onEdit, onDelete]
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageIndex: 0, pageSize: 5 },
    },
  });

  return (
    <div className="mt-11">
      <TitleHeader title="Saved Mappings" />

      <div className="mt-4">
        <ApproverRoleMappingFilterBar
          roleOptions={[]}
          userOptions={[]}
          branchOptions={[]}
          regionOptions={[]}
          clusterOptions={[]}
          stateOptions={[]}
          selectedFilters={filters}
          onFilterApply={setFilters}
        />
      </div>

      <div className="mt-8">
        <Grid>
          <Grid.Item>
            <CommonTable
              table={table}
              size="default"
              noDataText="No records found"
            />
          </Grid.Item>
        </Grid>
      </div>

      <Flex justify="end" gap={3} className="mt-4">
        {table.getRowModel().rows.length > 0 && (
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
                  const currentPage = table.getState().pagination.pageIndex + 1;

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
                  }

                  if (page === currentPage - 2 || page === currentPage + 2) {
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
      </Flex>
    </div>
  );
};
