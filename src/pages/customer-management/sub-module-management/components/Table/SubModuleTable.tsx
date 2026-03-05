import React, { useMemo } from "react";
import { Grid, CommonTable, Button } from "@/components";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Pencil, Trash } from "@mynaui/icons-react";
import type { SubModule } from "@/types/customer-management/sub-module-management-type";


const columnHelper = createColumnHelper<SubModule>();

interface SubModuleTableProps {
  onEdit: (subModule: SubModule) => void;
  openDeleteModal: (id: string) => void;
  data: SubModule[];
  isLoading: boolean;
}

export const SubModuleTable: React.FC<SubModuleTableProps> = ({ 
  onEdit, 
  openDeleteModal, 
  data, 
  isLoading 
}) => {

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "sno",
        header: "S.No",
        cell: ({ row }) => row.index + 1,
      }),
      columnHelper.accessor("moduleName", {
        header: "Module",
      }),
      columnHelper.accessor("subModuleCode", {
        header: "Sub Module Code",
      }),
      columnHelper.accessor("subModuleName", {
        header: "Sub Module Name",
      }),
      columnHelper.accessor("description", {
        header: "Sub Module Description",
      }),
      columnHelper.accessor("isActive", {
        header: "Active",
        cell: info => (info.getValue() ? "Yes" : "No"),
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              className="text-primary hover:bg-primary/40 h-6 w-6 p-0"
              title="Edit Sub Module"
              onClick={() => onEdit(row.original)}
            >
              <Pencil size={13} />
            </Button>
            <Button
              variant="ghost"
              className="text-destructive hover:bg-destructive/40 h-6 w-6 p-0"
              title="Delete Sub Module"
              // ✅ This now correctly uses the prop passed from SubModulePage
              onClick={() => openDeleteModal(row.original.id)}
            >
              <Trash size={13} />
            </Button>
          </div>
        ),
      }),
    ],
    [onEdit, openDeleteModal]
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) {
    return (
      <div className="text-muted-foreground p-8 text-center">Loading...</div>
    );
  }

  return (
    <Grid>
      <Grid.Item>
        <CommonTable
          table={table}
          noDataText="No sub module records available"
          className="bg-card"
        />
      </Grid.Item>
    </Grid>
  );
};