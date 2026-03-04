import React, { useMemo } from "react";
import { Grid, CommonTable } from "@/components";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Trash2 } from "lucide-react";
import type { BranchContactData } from "@/types/customer-management/branch-contact";
import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button";

const columnHelper = createColumnHelper<BranchContactData>();
interface TableProps {
  data: BranchContactData[] | undefined;
  isLoading: boolean;
  handleDelete: (identity: string) => void;
}
export const BranchContactTable: React.FC<TableProps> = ({
  data,
  isLoading,
  handleDelete,
}) => {
  const tableData = data || [];
  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "sno",
        header: "S.No",
        cell: ({ row }) => row.index + 1,
      }),

      columnHelper.accessor("channel", {
        header: "Branch Contact Type",
      }),
      columnHelper.accessor("value", {
        header: "Value",
      }),
      columnHelper.accessor("remarks", {
        header: "Remarks",
      }),

      columnHelper.accessor("isPrimary", {
        header: "Primary",
        cell: ({ getValue }) => (getValue() ? "Yes" : "No"),
      }),

      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const item = row.original.identity;
          return (
            <div className="flex gap-2">
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
    []
  );
  const getNoDataText = () => {
    if (isLoading) {
      return "Loading branch contacts...";
    }
    return "No branch contacts found";
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
