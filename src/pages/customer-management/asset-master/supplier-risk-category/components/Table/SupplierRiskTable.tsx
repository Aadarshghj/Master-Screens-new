import React, { useMemo } from "react";
import { Grid, CommonTable,  Button } from "@/components";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Pencil } from "@mynaui/icons-react";
// import { Trash2 } from "lucide-react";
import { Pagination } from "@/components/ui/paginationUp";
import type { SupplierRiskType } from "@/types/customer-management/asset-master/supplier-risk";
import { SUPPLIER_RISK_SAMPLE_DATA } from "@/mocks/customer-management-master/asset-master/supplier-risk";


const columnHelper = createColumnHelper<SupplierRiskType>();

export const SupplierRiskTable: React.FC = () => {


  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "sno",
        header: "S.No",
        cell: ({ row }) => row.index + 1,
      }),

      columnHelper.accessor("riskcategorytype", {
        header: "Risk Category Type  ",
      }),


      columnHelper.accessor("description", {
        header: " Description",
      })
      ,
      columnHelper.accessor("status", {
        header: "Status",
        cell:info=>{
          const status=Boolean(info.getValue())
        return(
          <span className={`text-xs font-medium ${
            status?"text-green-600":"text-red-600"
           
          }`}>
            {status?"ACTIVE":"INACTIVE"}
          </span>
        )
        },
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
    data: SUPPLIER_RISK_SAMPLE_DATA,
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