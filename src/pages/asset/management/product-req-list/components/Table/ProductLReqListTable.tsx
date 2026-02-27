import React, { useMemo } from "react";
import { Grid, CommonTable } from "../../../../../../components";
import {
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Eye, SquarePen, Trash } from "lucide-react";
import { useMsmeTypeTable } from '../Hooks/useProductReqListTable';
import type { ProductReqList } from "@/types/asset-mgmt/product-req-list";
import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button";
import type { MsmeType } from "@/types/asset-mgmt/msme-type";

const columnHelper = createColumnHelper<MsmeType>();

export const ProductReqListTable: React.FC = () => {
  const { data, isFetching, onEdit } = useProductReqListTable();

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "sno",
        header: "S.No",
        cell: ({ row }) => row.index + 1,
      }),

      columnHelper.accessor("msmeType", {
        header: "Request",
      }),

         columnHelper.accessor("msmeType", {
        header: "Product",
      }),

      columnHelper.accessor("msmeTypeDesc", {
        header: "Remarks/Specification",
      }),

         columnHelper.accessor("msmeType", {
        header: "Quantity",
      }),

        columnHelper.accessor("msmeType", {
        header: "Quantity",
      }),

        columnHelper.accessor("msmeType", {
        header: "Quantity",
      }),

        columnHelper.accessor("msmeType", {
        header: "Quantity",
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
          <div className="flex items-center gap-3">
          <NeumorphicButton
             variant="none"
              className="h-6 w-6 p-0"
              // onClick={() => onEdit(row.original)}
          >
            <Eye size={12} />
          </NeumorphicButton>

          <NeumorphicButton
             variant="none"
              className="h-6 w-6 p-0"
              // onClick={() => onEdit(row.original)}
          >
            <SquarePen size={12} />
          </NeumorphicButton>

          <NeumorphicButton
             variant="none"
              className="h-6 w-6 p-0"
              // onClick={() => onEdit(row.original)}
          >
            <Trash size={12} />
          </NeumorphicButton>
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
