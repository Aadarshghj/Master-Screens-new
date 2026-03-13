import React, { useMemo } from "react";
import { Grid, CommonTable, ConfirmationModal, Button} from "@/components";
import {
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Pencil, Trash2 } from "lucide-react";
import type { AssetClassificationType } from "@/types/customer-management/loan-asset-classification";
import { useLoanAssetClassificationTable } from "../Hooks/useLoanAssetTable";
import { Pagination } from "@/components/ui/paginationUp";


const columnHelper = createColumnHelper<AssetClassificationType>();

interface LoanAssetClassiTableProps{
  onEdit:(identity:AssetClassificationType) =>void;
}
export const LoanAssetClassiTable: React.FC<LoanAssetClassiTableProps> = ({
  onEdit,
})=>{
   const {
      data,
      showDeleteModal,
      openDeleteModal,
      closeDeleteModal,
      handleConfirmDelete,
    } = useLoanAssetClassificationTable();

    

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "s.no",
        header: "S.No",
        cell: ({ row }) => row.index + 1,
      }),

      columnHelper.accessor("assetClassificationName", {
        header: "Asset Classification Name ",
      }),

      columnHelper.accessor("description", {
        header: "Description",
      }),

      columnHelper.accessor("isActive", {
        header: "Status",
        cell:info=>{
          const isActive = Boolean(info.getValue());
          return(
            <span className={`text-xs font-medium ${isActive?"text-green-600":"text-red-600"}`}>
              {isActive ? "ACTIVE":"INACTIVE"}

            </span>
          )
        }
      }),

      columnHelper.display({
        id: "actions",
        header: "Actions",
         cell: ({row}) => (
          
          <div className="flex gap-2">
          
       <Button
        variant="ghost"
        className="text-primary hover:bg-primary/40 h-6 w-6 p-0"
        onClick={()=>onEdit(row.original)}
        title="Edit Property" >
            <Pencil size={13} />
      </Button>
      <Button
        variant="ghost"
        className="text-status-error hover:bg-status-error-background h-6 w-6 p-0"
        onClick={()=>openDeleteModal(row.original.identity)}
        title="Delete Property" >
             <Trash2 size={13} />
      </Button>

          </div>
        ),
      }),
    ],
    [openDeleteModal,onEdit]
  );

 const table = useReactTable({
  data,
  columns,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  initialState: {
    pagination: {
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
            noDataText="No Asset Classification  Records"
            className="bg-card"
          />
        </Grid.Item>
      </Grid>
{table.getRowModel().rows.length > 0 && table.getPageCount() > 0 && (
  <div className="mt-4 flex items-center justify-end text-sm">

    {/* <div className="text-muted-foreground whitespace-nowrap">
      Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{" "}
      {Math.min(
        (table.getState().pagination.pageIndex + 1) *
          table.getState().pagination.pageSize,
        table.getFilteredRowModel().rows.length
      )}{" "}
      of {table.getFilteredRowModel().rows.length} entries
    </div> */}

    <div className="flex items-center  gap-3">
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
    <ConfirmationModal
            isOpen={showDeleteModal}
            onConfirm={handleConfirmDelete}
            onCancel={closeDeleteModal}
            title="Delete Asset Classification Name"
            message="Are you sure you want to delete this Asset Classification Name ? This action cannot be undone."
            confirmText="Delete"
            cancelText="Cancel"
            type="error"
            size="compact"
          />
    </>
  );
};