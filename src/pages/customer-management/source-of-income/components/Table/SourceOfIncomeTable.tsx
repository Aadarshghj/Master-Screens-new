import React, { useMemo } from "react";
import { Grid, CommonTable, Button } from "@/components";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";
import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button";
import type { SourceOfIncomeData } from "@/types/customer-management/source-income";

const columnHelper = createColumnHelper<SourceOfIncomeData>();

interface TableProps {
  data: SourceOfIncomeData[] | undefined;
  isLoading: boolean;
  handleDelete: (identity: string) => void;
  onEdit: (identity: SourceOfIncomeData) => void;
}

export const SourceOfIncomeTable: React.FC<TableProps> = ({
  data,
  isLoading,
  handleDelete,
  onEdit,
}) => {
  const tableData = data || [];
  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "sno",
        header: "S.No",
        cell: ({ row }) => row.index + 1,
      }),
      columnHelper.accessor("name", {
        header: "Source of Income Name",
      }),
      columnHelper.accessor("code", {
        header: "Source of Income Code",
      }),

      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const item = row.original.identity;

          return (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                className="text-primary hover:bg-primary/40 h-6 w-6 p-0"
                onClick={() => onEdit(row.original)}
                title="Edit Source of Income"
              >
                <Pencil size={13} />
              </Button>

              <NeumorphicButton
                variant="none"
                onClick={() => handleDelete(item)}
                className="text-status-error hover:bg-status-error-background h-6 w-6 p-0"
              >
                <Trash2 size={13} />
              </NeumorphicButton>
            </div>
          );
        },
      }),
    ],
    [handleDelete, onEdit]
  );

  const getNoDataText = () => {
    if (isLoading) {
      return "Loading Source of Income...";
    }
    return "No source of Income found";
  };

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Grid>
      <Grid.Item>
        <CommonTable
          table={table}
          noDataText={getNoDataText()}
          className="bg-card"
        />
      </Grid.Item>
    </Grid>
  );
};