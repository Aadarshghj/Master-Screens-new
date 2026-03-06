import React, { useMemo } from "react";
import { Grid, CommonTable, Button } from "@/components";
import { Pagination } from "@/components/ui/paginationUp";

import {
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Eye, SquarePen } from "lucide-react";
import { useSupplierTable } from "../../components/Hooks/UseSupplierTable";
import type { SupplierMasterType } from "@/types/asset-management-system/supplier-management/supplier-list";

const columnHelper = createColumnHelper<SupplierMasterType>();

export const SupplierTable: React.FC = () => {
  const { data, isFetching, onEdit } = useSupplierTable();

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "sno",
        header: "S.No",
        size: 20,
        cell: ({ row }) => row.index + 1,
      }),

      columnHelper.accessor("supplierName", {
        header: "Supplier Name",
        size: 200,
      }),

      columnHelper.accessor("tradeName", {
           header: () => <span className="text-[10px]">Trade Name</span>,
        size: 120,
      }),

      columnHelper.accessor("panNumber", {
        header: "PAN Number",
        size: 120,
      }),

      columnHelper.accessor("gstin", {
        header: "GSTIN",
        size: 180,
      }),

      columnHelper.accessor("msmeNo", {
        header: "MSME Registration No",
        size: 150,
      }),
        columnHelper.accessor("address", {
        header: "Address",
        size: 200,
      }),

      columnHelper.accessor("city", {
       header: () => <span className="text-xs">City</span>,
        size: 120,
      }),

      columnHelper.accessor("state", {
        header: "State",
        size: 120,
      }),
      columnHelper.accessor("country", {
        header: "Country",
        size: 120,
      }),
      columnHelper.accessor("pincode", {
        header: "Pin Code",
        size: 120,
      }),

      columnHelper.accessor("status", {
        header: "Status",
        size: 100,
        cell: ({ getValue }) => (
          <span className={"rounded px-2 py-1 text-xs "}>{getValue()}</span>
        ),
      }),
      columnHelper.accessor("blacklisted", {
        header: "Blacklisted",
        size: 120,
      }),

      columnHelper.display({
        id: "actions",
        header: "Actions",
        size: 40,
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              className="text-primary hover:bg-primary/40 h-6 w-6 p-0"
              title="Edit"
              onClick={() => onEdit(row.original)}
            >
              <Eye size={13} />
            </Button>
            <Button
              variant="ghost"
              className="text-primary hover:bg-primary/40 h-6 w-6 p-0"
              title="Edit"
              onClick={() => onEdit(row.original)}
            >
              <SquarePen size={13} />
            </Button>
          </div>
        ),
      }),
    ],
    [onEdit]
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 5,
      },
    },
  });

  return (
    <>
      <Grid>
        <Grid.Item>
          <CommonTable
            table={table}
            noDataText={isFetching ? "Loading..." : "No records available"}
            className="w-full rounded-xl text-[9px] [&_td]:px-1 [&_td]:whitespace-nowrap [&_th]:px-1"
          />
        </Grid.Item>
      </Grid>

      {table.getRowModel().rows.length > 0 && table.getPageCount() > 0 && (
        <div className="mt-4 flex items-center justify-between text-sm">
          <div className="text-muted-foreground whitespace-nowrap">
            Showing{" "}
            {table.getState().pagination.pageIndex *
              table.getState().pagination.pageSize +
              1}{" "}
            to{" "}
            {Math.min(
              (table.getState().pagination.pageIndex + 1) *
                table.getState().pagination.pageSize,
              table.getFilteredRowModel().rows.length
            )}{" "}
            of {table.getFilteredRowModel().rows.length} entries
          </div>

          <div className="flex items-center gap-3">
            <Pagination
              currentPage={table.getState().pagination.pageIndex}
              totalPages={table.getPageCount()}
              onPageChange={page => table.setPageIndex(page)}
              onPreviousPage={() => table.previousPage()}
              onNextPage={() => table.nextPage()}
              canPreviousPage={table.getCanPreviousPage()}
              canNextPage={table.getCanNextPage()}
              maxVisiblePages={5}
            />
          </div>
        </div>
      )}
    </>
  );
};
