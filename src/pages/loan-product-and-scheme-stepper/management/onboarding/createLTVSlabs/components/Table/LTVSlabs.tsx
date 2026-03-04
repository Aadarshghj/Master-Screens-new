import React, { useMemo } from "react";
import { Flex } from "@/components/ui/flex";
import { HeaderWrapper } from "@/components/ui/header-wrapper/HeaderWrapper";
import { TitleHeader } from "@/components/ui/title-header/TitleHeader";
import { CommonTable } from "@/components";
import {
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { Trash2, Pencil } from "lucide-react";
import type { LTVSlabTableData } from "@/types/loan-product-and schema Stepper/ltv-slabs.types";

interface LTVSlabTableProps {
  data: LTVSlabTableData[];
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

const columnHelper = createColumnHelper<LTVSlabTableData>();

export const LTVSlabTable: React.FC<LTVSlabTableProps> = ({
  data,
  onDelete,
  onEdit,
}) => {
  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "fromAmount",
        header: "From Amount",
        cell: ({ row }) => (
          <span className="text-table-cell text-xxs font-medium">
            {row.original.fromAmount}
          </span>
        ),
        enableSorting: true,
      }),
      columnHelper.display({
        id: "toAmount",
        header: "To Amount",
        cell: ({ row }) => (
          <span className="text-table-cell text-xxs font-medium">
            {row.original.toAmount}
          </span>
        ),
        enableSorting: true,
      }),
      columnHelper.display({
        id: "ltvPercentage",
        header: "LTV%",
        cell: ({ row }) => (
          <span className="text-table-cell text-xxs font-medium">
            {row.original.ltvPercentage}
          </span>
        ),
        enableSorting: true,
      }),
      columnHelper.display({
        id: "ltvOn",
        header: "LTV ON",
        cell: ({ row }) => (
          <span className="text-table-cell text-xxs font-medium">
            {row.original.ltvOn}
          </span>
        ),
        enableSorting: true,
      }),
      columnHelper.display({
        id: "action",
        header: "Action",
        cell: ({ row }) => (
          <Flex className="gap-2">
            <button
              onClick={() => onEdit(row.original.id)}
              className="rounded p-1 text-blue-600 hover:bg-blue-50"
            >
              <Pencil size={14} />
            </button>
            <button
              onClick={() => onDelete(row.original.id)}
              className="rounded p-1 text-red-600 hover:bg-red-50"
            >
              <Trash2 size={14} />
            </button>
          </Flex>
        ),
        enableSorting: false,
      }),
    ],
    [data, onDelete, onEdit]
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <div className="mt-4 w-full">
      <HeaderWrapper>
        <TitleHeader title="LTV Slab Details" />
      </HeaderWrapper>
      <div className="mt-2 w-full">
        <CommonTable table={table} size="default" />
      </div>
    </div>
  );
};
