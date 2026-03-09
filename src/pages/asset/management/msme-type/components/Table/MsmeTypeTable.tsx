import React, { useMemo } from "react";
import { Grid, CommonTable } from "../../../../../../components";
import {
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { SquarePen } from "lucide-react";
import type { MsmeType } from '../../../../../../types/asset-mgmt/msme-type';
import { useMsmeTypeTable } from '../Hooks/useMsmeTypeTable';

const columnHelper = createColumnHelper<MsmeType>();

export const MsmeTypeTable: React.FC = () => {
  const { data, isFetching, onEdit } = useMsmeTypeTable();

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "sno",
        header: "S.No",
        cell: ({ row }) => row.index + 1,
      }),

      columnHelper.accessor("msmeType", {
        header: "MSME Type",
      }),

      columnHelper.accessor("msmeTypeDesc", {
        header: "Description",
      }),

      columnHelper.accessor("status", {
        header: "Status",
        cell: (info) => (
          <span
            className={
              info.getValue()
                ? "text-green-600 font-medium"
                : "text-red-600 font-medium"
            }
          >
            {info.getValue() ? "ACTIVE" : "INACTIVE"}
          </span>
        ),
      }),

      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <button
            title="Edit"
            onClick={() => onEdit(row.original)}
            className="text-primary ml-3 hover:opacity-80"
          >
            <SquarePen size={12} />
          </button>
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
        className={`
          min-w-[25px] h-[25px] flex items-center justify-center
          rounded-lg font-medium transition-all duration-200
          ${isActive
            ? "bg-white text-gray-700 shadow-[0_2px_6px_rgba(0,0,0,0.15)]"
            : "text-gray-500 hover:bg-white hover:text-gray-700 hover:shadow-[0_2px_6px_rgba(0,0,0,0.12)] hover:-translate-y-[1px]"
          }
        `}
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
    </>
  );
};
