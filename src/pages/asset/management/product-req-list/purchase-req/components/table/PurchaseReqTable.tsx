import React, { useMemo } from "react";
import { useReactTable, getCoreRowModel, getPaginationRowModel } from "@tanstack/react-table";
import { createColumnHelper } from "@tanstack/react-table";
import { Eye, SquarePen, Trash2 } from "lucide-react";

import { usePurchaseReqTable } from "../hooks/usePurchaseReqTable";
import { Grid, CommonTable, Flex } from "../../../../../../../components";
import NeumorphicButton from '@/components/ui/neumorphic-button/neumorphic-button';

const columnHelper = createColumnHelper<any>();

export const PurchaseItemTable = () => {
  const { data = [], isFetching } = usePurchaseReqTable();

  const columns = useMemo(
  () => [
    columnHelper.display({
      id: "sno",
      header: "Sl.No",
      cell: ({ row }) => row.index + 1,
    }),

    columnHelper.accessor("itemName", {
      header: "Request Item",
    }),

    columnHelper.accessor("requestedOffice", {
      header: "Requested Office",
    }),

    columnHelper.accessor("desc", {
      header: "Request Description",
    }),

    columnHelper.accessor("priority", {
      header: "Priority",
    }),

    columnHelper.accessor("modelManufacturer", {
      header: "Model/Manufacturer",
      cell: (info) => info.getValue() || "-----",
    }),

    columnHelper.accessor("quantity", {
      header: "Quantity",
    }),

    columnHelper.accessor("unit", {
      header: "Unit",
    }),

    columnHelper.accessor("estimatedAmount", {
      header: "Estimated Amount",
    }),

    columnHelper.accessor("requestDate", {
      header: "Request Date",
    }),

    columnHelper.accessor("requestedBy", {
      header: "Requested By",
    }),

    columnHelper.display({
      id: "actions",
      header: "Action",
      cell: ({row}) => (
          <div className="flex items-center">
            <Flex.ActionGroup>
                <NeumorphicButton variant="none" className="h-6 w-6 p-0">
                  <SquarePen size={13} />
                </NeumorphicButton>

                <NeumorphicButton
                  variant="none"
                  className="text-status-error h-6 w-6 p-0"
                >
                  <Trash2 size={12} />
                </NeumorphicButton>
                </Flex.ActionGroup>
          </div>
      ),
    }),
  ],
  []
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
    <Grid>
      <Grid.Item>
        <CommonTable
          table={table}
          size="default"
          noDataText={isFetching ? "Loading..." : "No records available"}
          className="bg-card"
        />

        <div className="flex items-center justify-end gap-2 mt-4 text-sm">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-2 py-1 rounded text-gray-500 hover:text-gray-700 disabled:opacity-40"
          >
            ‹ Previous
          </button>

          {Array.from({ length: table.getPageCount() }, (_, i) => {
            const isActive = table.getState().pagination.pageIndex === i;

            return (
              <button
                key={i}
                onClick={() => table.setPageIndex(i)}
                className={`min-w-[20px] h-[20px] flex items-center justify-center rounded-lg font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-white text-gray-700 shadow-[0_2px_6px_rgba(0,0,0,0.15)]"
                    : "text-gray-500 hover:bg-white hover:text-gray-700 hover:shadow-[0_2px_6px_rgba(0,0,0,0.12)] hover:-translate-y-[1px]"
                }`}
              >
                {i + 1}
              </button>
            );
          })}

          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-2 py-1 rounded text-gray-500 hover:text-gray-700 disabled:opacity-40"
          >
            Next ›
          </button>
        </div>
      </Grid.Item>
    </Grid>
  );
};