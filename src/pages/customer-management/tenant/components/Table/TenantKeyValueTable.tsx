import React, { useMemo } from "react";
import { Grid, CommonTable, Button } from "@/components";
import { Input } from "@/components/ui";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Plus, Minus } from "lucide-react";
import type {
  useKeyValueTable,
  KeyValueTableRow,
} from "../Hooks/useKeyValueTable";

const columnHelper = createColumnHelper<KeyValueTableRow>();

interface TenantKeyValueTableProps {
  keyValueTable: ReturnType<typeof useKeyValueTable>;
}

export const TenantKeyValueTable: React.FC<TenantKeyValueTableProps> = ({
  keyValueTable,
}) => {
  const { tableData, addRow, removeLastRow, updateCell } = keyValueTable;

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "attributeKey",
        header: "Attribute Key",
        cell: ({ row }) => (
          <Input
            value={row.original.key}
            onChange={e => updateCell(row.index, "key", e.target.value)}
            size="form"
            variant="form"
            className="w-56"
          />
        ),
      }),
      columnHelper.display({
        id: "attributeValue",
        header: "Attribute Values",
        cell: ({ row }) => (
          <Input
            value={row.original.value}
            onChange={e => updateCell(row.index, "value", e.target.value)}
            size="form"
            variant="form"
            className="w-56"
          />
        ),
      }),
    ],
    [updateCell]
  );

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Grid>
      <Grid.Item>
        <div className="flex items-start gap-3">
          <div className="border-border w-[500px] rounded-md border">
            <CommonTable
              table={table}
              size="default"
              noDataText="Click + to add row"
            />
          </div>

          <div className="mt-2 flex flex-row gap-2">
            <Button
              type="button"
              variant="solid"
              size="xs"
              onClick={addRow}
              className="h-7 w-7 rounded-full p-0"
              title="Add Row"
            >
              <Plus className="h-4 w-4" />
            </Button>

            <Button
              type="button"
              variant="bordered"
              size="xs"
              onClick={removeLastRow}
              disabled={tableData.length === 0}
              className="h-7 w-7 rounded-full p-0"
              title="Remove Last Row"
            >
              <Minus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Grid.Item>
    </Grid>
  );
};
