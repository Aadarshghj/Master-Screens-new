import React, { useMemo } from "react";
import { Grid, CommonTable } from "@/components";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Trash2 } from "lucide-react";

import type { FirmRoleData } from "@/types/customer-management/firm-role";
import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button";

const columnHelper = createColumnHelper<FirmRoleData>();
interface TableProps {
  data: FirmRoleData[] | undefined;
  isLoading: boolean;
  handleDelete: (identity: string) => void;
}
export const FirmRoleTable: React.FC<TableProps> = ({
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

      columnHelper.accessor("roleName", {
        header: "Firm Role Name",
      }),

      columnHelper.accessor("description", {
        header: "Description",
        cell: info => info.getValue() || "- - - - - - - - -",
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
      return "Loading Firm Roles...";
    }
    return "No Firm Roles found";
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
