import React, { useMemo } from "react";
import { Grid, CommonTable, Button } from "@/components";
import {
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Pencil } from "lucide-react";


import { Pagination } from "@/components/ui/paginationUp";
import type { TdsSectionTypes } from "@/types/customer-management/asset-master/tds-section";
import { useTdsSectionTable } from "../Hook/useTdsSectionTable";

const columnHelper = createColumnHelper<TdsSectionTypes>();
interface TdsSectionTableProps {
  onEdit: (data: TdsSectionTypes) => void;
}
export const TdsSectionTable: React.FC<TdsSectionTableProps> = ({onEdit}) => {
  const {
    data,
    isFetching,
  } = useTdsSectionTable();

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "s.no",
        header: "S.No",
        cell: ({ row }) => row.index + 1,
      }),

      columnHelper.accessor("tdsSectionType", {
        header: "TDS Section Type",
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
        cell: ({ row }) => (
          < Button
          variant="ghost"
            title="Edit"
            onClick={() => onEdit(row.original)}
            className="text-primary hover:bg-primary/40 h-6 w-6 ml-2"
          >
            <Pencil size={13} />
          </Button>
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
      pageIndex:0,
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
