import React, { useMemo } from "react";
import { Grid, CommonTable, Button } from "@/components";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Pencil } from "lucide-react";
import type { ChargesMasterType } from "@/types/customer-management/asset-master/charges-master";
import { useChargesMasterTable } from "../Hooks/useChargesMasterTable";
import { CHARGES_MASTER_MOCK_DATA } from "@/mocks/customer-management-master/asset-master/charges-master";

const columnHelper = createColumnHelper<ChargesMasterType>();

interface ChargesMasterTableProps {}
export const ChargesMasterTable: React.FC<ChargesMasterTableProps> = ({
}) => {
  const { } = useChargesMasterTable();
  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "sno",
        header: "S.No",
        cell: ({ row }) => row.index + 1,
      }),

      columnHelper.accessor("chargeName", {
        header: "Charge Name",
      }),

      columnHelper.accessor("gl", {
        header: "GL",
        cell: (info) => info.getValue() || "- - - - - - - - -",
      }),

      columnHelper.accessor("isActive", {
        header: "Status",
        cell: (info) => (info.getValue() ? "Active" : "Inactive"),
      }),

      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: ({row}) => {
          return (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="xs"
                // onClick={() => onEdit(row.original)}
                disabled={!row.original.isActive}
                className="text-primary hover:bg-primary/50 h-6 w-6 p-0"
                title="Edit"
              >
                <Pencil className="h-3 w-3" />
              </Button>
            </div> 
          );   
        },
      }),
    ],
    []
  );

  const table = useReactTable({
    data: CHARGES_MASTER_MOCK_DATA,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <Grid>
        <Grid.Item>
          <CommonTable
            table={table}
            // noDataText={ ? "Loading..." : "No Charge Master Records"}
            className="bg-card"
        />
        <div className="flex items-center justify-end gap-2 mt-4 text-sm">
        <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-2 py-1 rounded disabled:opacity-50"
        >‹ Previous
        </button>

        {Array.from({ length: table.getPageCount() }, (_, i) => (
        <button
            key={i}
            onClick={() => table.setPageIndex(i)}
            className={`px-3 py-1 rounded ${
            table.getState().pagination.pageIndex === i
          ? "bg-gray-200 font-semibold" : "hover:bg-gray-100"
            }`}
        >
        {i + 1}
        </button>
        ))}

        <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-2 py-1 rounded disabled:opacity-50"
        >
        Next ›
        </button>
        </div>
        </Grid.Item>
    </Grid>
    </>
  );
};