import React, { useMemo } from "react";
import { Input, Switch } from "@/components";
import {
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { CommonTable } from "@/components";

interface RecoveryComponent {
  id: string;
  component: string;
  priority: number;
  description: string;
  isActive: boolean;
}

interface RecoveryPriorityTableProps {
  tableData: RecoveryComponent[];
  onPriorityChange: (index: number, priority: number) => void;
  onActiveChange: (index: number, isActive: boolean) => void;
}

const columnHelper = createColumnHelper<RecoveryComponent>();

export const RecoveryPriorityTable: React.FC<RecoveryPriorityTableProps> = ({
  tableData,
  onPriorityChange,
  onActiveChange,
}) => {
  const handlePriorityChange = (index: number, value: string) => {
    if (value === "") {
      onPriorityChange(index, 0);
      return;
    }

    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue >= 1 && numValue <= 7) {
      const isDuplicate = tableData.some(
        (comp, idx) => idx !== index && comp.priority === numValue
      );

      if (isDuplicate) {
        return;
      }

      onPriorityChange(index, numValue);
    }
  };

  const handleToggle = (index: number) => {
    onActiveChange(index, !tableData[index].isActive);
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor("component", {
        header: "Recovery Component",
        cell: info => (
          <span className="text-xxs font-medium">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("priority", {
        header: "Priority (1-7)",
        cell: ({ row }) => (
          <Input
            type="text"
            value={
              row.original.priority === 0
                ? ""
                : row.original.priority.toString()
            }
            onChange={e => handlePriorityChange(row.index, e.target.value)}
            className="w-20"
            size="form"
            placeholder="1-7"
            maxLength={1}
          />
        ),
      }),
      columnHelper.accessor("description", {
        header: "Description",
        cell: info => (
          <span className="text-xxs font-medium">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("isActive", {
        header: "Active/Inactive",
        cell: ({ row }) => (
          <Switch
            checked={row.original.isActive}
            onCheckedChange={() => handleToggle(row.index)}
          />
        ),
      }),
    ],
    [tableData, onPriorityChange, onActiveChange]
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
    <div className="w-full">
      <CommonTable table={table} size="default" />
    </div>
  );
};
