import React, { useMemo } from "react";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { CommonTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import type { CalculationLogicData } from "@/types/loan-product-and-scheme-masters/charge-master.types";

interface CalculationLogicTableProps {
  calculationLogics: CalculationLogicData[];
  onDelete: (index: number) => void;
}

const columnHelper = createColumnHelper<CalculationLogicData>();

export const CalculationLogicTable: React.FC<CalculationLogicTableProps> = ({
  calculationLogics,
  onDelete,
}) => {
  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "slNo",
        header: "SI NO",
        cell: ({ row }) => <span className="text-xs">{row.index + 1}</span>,
      }),
      columnHelper.accessor("upToAmount", {
        header: "Up To Amount",
        cell: info => (
          <span className="text-xs font-medium">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("chargeAmountPercentage", {
        header: "Charge Amount/Percentage",
        cell: info => <span className="text-xs">{info.getValue()}</span>,
      }),
      columnHelper.display({
        id: "action",
        header: "Action",
        cell: ({ row }) => (
          <Button
            variant="ghost"
            size="xs"
            onClick={() => onDelete(row.index)}
            className="text-status-error hover:bg-status-error-background h-6 w-6 p-0"
            title="Delete calculation logic"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        ),
      }),
    ],
    [onDelete]
  );

  const table = useReactTable({
    data: calculationLogics,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <CommonTable
      table={table}
      size="default"
      noDataText="No calculation logic found"
      className="bg-card"
    />
  );
};
