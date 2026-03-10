import React, { useMemo } from "react";
import { Grid, CommonTable, Button } from "@/components";
import { Pagination } from "@/components/ui/paginationUp";

import {
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";
import { useLoanSchemeTypeTable } from "../Hooks/useLoanSchemeTypeTable";
import type { LoanSchemeTypeType } from "@/types/customer-management/loan-scheme-type";

const columnHelper = createColumnHelper<LoanSchemeTypeType>();

export const LoanSchemeTypeTable: React.FC=()  => {
  const {
    data,
    isFetching,
    openDeleteModal,
   onEdit,
  } = useLoanSchemeTypeTable();

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "sno",
        header: "S.No",
        size:20,
        cell: ({ row }) => row.index + 1,
      }),
      columnHelper.accessor("schemeTypeName", {
        header: "Scheme Type Name",
        size:80
      }),
      columnHelper.accessor("schemeTypeDescription", {
        header: "Scheme Type Description",
        size:300
      }),
       columnHelper.accessor("isActive", {
        header: "Status",
        cell: info => (info.getValue() ? "Yes" : "No"),
      }),

      columnHelper.display({
       
  id: "actions",
  header: "Actions",
  cell: ({ row }) => (
    <div className="flex gap-2">
      <Button
        variant="ghost"
        className="text-primary hover:bg-primary/40 h-6 w-6 p-0"
        title="Edit"
        onClick={()=>onEdit(row.original)}
      >
        <Pencil size={13} />
      </Button>

      <button
        title="Delete"
        onClick={() => openDeleteModal(row.original)}
        className="text-destructive hover:opacity-80"
      >
        <Trash2 size={12} />
      </button>
    </div>
  ),
}),
    ],
    
    [openDeleteModal ,onEdit]
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
            noDataText={
              isFetching ? "Loading..." : "No records available"
            }
            className="bg-card"
          />
        </Grid.Item>
      </Grid>
    </>
  );
};
