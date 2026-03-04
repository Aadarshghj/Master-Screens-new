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
import type {
  InterestSlabTableData,
  InterestSlabTableProps,
} from "@/types/loan-product-and schema Stepper/interest-slabs.types";

const columnHelper = createColumnHelper<InterestSlabTableData>();

export const InterestSlabTable: React.FC<InterestSlabTableProps> = ({
  data,
  onDelete,
  onEdit,
}) => {
  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "startPeriod",
        header: "Start Period",
        cell: ({ row }) => (
          <span className="text-table-cell text-xxs font-medium">
            {row.original.startPeriod}
          </span>
        ),
        enableSorting: true,
      }),
      columnHelper.display({
        id: "endPeriod",
        header: "End Period",
        cell: ({ row }) => (
          <span className="text-table-cell text-xxs font-medium">
            {row.original.endPeriod}
          </span>
        ),
        enableSorting: true,
      }),
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
        id: "slabInterestRate",
        header: "Slab Interest rate (%)",
        cell: ({ row }) => (
          <span className="text-table-cell text-xxs font-medium">
            {row.original.slabInterestRate}
          </span>
        ),
        enableSorting: true,
      }),
      columnHelper.display({
        id: "annualROI",
        header: "Annual ROI(%)",
        cell: ({ row }) => (
          <span className="text-table-cell text-xxs font-medium">
            {row.original.annualROI}
          </span>
        ),
        enableSorting: true,
      }),
      columnHelper.display({
        id: "rebateAnnualROI",
        header: "Rebate on Annual ROI",
        cell: ({ row }) => (
          <span className="text-table-cell text-xxs font-medium">
            {row.original.rebateAnnualROI}
          </span>
        ),
        enableSorting: true,
      }),
      columnHelper.display({
        id: "recomputationRequired",
        header: "Recalculation Required",
        cell: ({ row }) => (
          <span className="text-table-cell text-xxs font-medium">
            {row.original.recomputationRequired}
          </span>
        ),
        enableSorting: true,
      }),
      columnHelper.display({
        id: "pastDue",
        header: "Past-Due",
        cell: ({ row }) => (
          <span className="text-table-cell text-xxs font-medium">
            {row.original.pastDue}
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
              onClick={() => onEdit?.(row.original.id)}
              className="rounded p-1 text-blue-600 hover:bg-blue-50"
            >
              <Pencil size={14} />
            </button>
            <button
              onClick={() => onDelete?.(row.original.id)}
              className="rounded p-1 text-red-600 hover:bg-red-50"
            >
              <Trash2 size={14} />
            </button>
          </Flex>
        ),
        enableSorting: false,
      }),
    ],
    [onDelete, onEdit]
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
        <TitleHeader title="Interest Slab Details" />
      </HeaderWrapper>
      <div className="mt-2 w-full">
        <CommonTable table={table} size="default" />
      </div>
    </div>
  );
};
