import React, { useMemo } from "react";
import { Button, CommonTable } from "@/components";
import {
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";
import type {
  ChargeSlab,
  LoanSchemeChargeSlabTableProps,
} from "@/types/loan-product-and schema Stepper/charge-slab.types";

const columnHelper = createColumnHelper<ChargeSlab>();

export const LoanSchemeChargeSlabTable: React.FC<
  LoanSchemeChargeSlabTableProps
> = ({ tableData, onEdit }) => {
  const handleEdit = (item: ChargeSlab) => {
    onEdit?.(item);
  };

  const handleDelete = (id: string) => {
    // Delete functionality will be implemented with API
    console.log("Delete charge slab:", id);
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor("charge", {
        header: "Charge",
        cell: info => (
          <span className="text-xxs font-medium">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("fromAmount", {
        header: "From Amount",
        cell: info => (
          <span className="text-xxs font-medium">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("toAmount", {
        header: "To Amount",
        cell: info => (
          <span className="text-xxs font-medium">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("rateType", {
        header: "Rate Type",
        cell: info => (
          <span className="text-xxs font-medium">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("slabRate", {
        header: "Slab Rate",
        cell: info => (
          <span className="text-xxs font-medium">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("chargeOn", {
        header: "Charge On",
        cell: info => (
          <span className="text-xxs font-medium">{info.getValue()}</span>
        ),
      }),
      columnHelper.display({
        id: "action",
        header: "Action",
        cell: ({ row }) => (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEdit(row.original)}
            >
              <Pencil className="h-4 w-4 text-blue-600" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(row.original.id)}
            >
              <Trash2 className="h-4 w-4 text-red-600" />
            </Button>
          </div>
        ),
      }),
    ],
    []
  );

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  return (
    <div className="w-full rounded-lg border">
      <CommonTable table={table} size="default" />
    </div>
  );
};
