import React, { useMemo } from "react";
import { Grid, CommonTable,  Button } from "@/components";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Pencil } from "@mynaui/icons-react";
import { Pagination } from "@/components/ui/paginationUp";
import type { AssetType } from "@/types/asset-management-system/asset-type";
import { ASSET_TYPE_SAMPLE_DATA } from "@/mocks/asset-management-system/asset-type";

const columnHelper = createColumnHelper<AssetType>();

export const AssetTypeTable: React.FC = () => {

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "sno",
        header: "S.No",
        cell: ({ row }) => row.index + 1,
      }),

      columnHelper.accessor("assetTypeCode", {
        header: "Asset Type Code ",
      }),

      columnHelper.accessor("assetTypeName", {
        header: "Asset Type Name ",
      }),

      columnHelper.accessor("description", {
        header: "Asset Type Description",
      })
      ,
      columnHelper.accessor("status", {
        header: "Status",
      })
      ,
      columnHelper.accessor("depreciable", {
        header: "Depreciable",
      })
      ,
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: () => (
          <div className="flex gap-2">

            <Button
              variant="ghost"
              className="text-primary hover:bg-primary/40 h-6 w-6 p-0"
              title="Edit Property"
            >
              <Pencil size={13} />
            </Button>

         
          </div>
        ),
      }),
    ],
    []
  );

  const table = useReactTable({
    data: ASSET_TYPE_SAMPLE_DATA,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <Grid>
        <Grid.Item>
          <CommonTable
            table={table}
            noDataText="No user records available"
            className="bg-card"
          />
        </Grid.Item>
      </Grid>


{table.getRowModel().rows.length > 0 && table.getPageCount() > 0 && (
  <div className="mt-4 flex items-center justify-between text-sm">

    <div className="text-muted-foreground whitespace-nowrap">
      Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{" "}
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
        onPageChange={(page) => table.setPageIndex(page)}

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