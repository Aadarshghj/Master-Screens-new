import React, { useMemo } from "react";
import { Grid, CommonTable, ConfirmationModal, Button } from "@/components";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Trash2, Pencil } from "lucide-react";
import type { ModuleType } from "@/types/customer-management/module-management";
import { useModuleMgmtTable } from "../Hooks/useModuleMgmtTable";

const columnHelper = createColumnHelper<ModuleType>();

interface ModuleTableProps {
  onEdit: (moduleIdentity: string) => void;
}

export const ModuleMgmtTable: React.FC<ModuleTableProps> = ({
 onEdit
}) => {
  const {
    data, 
    isFetching, 
    showDeleteModal, 
    openDeleteModal, 
    closeDeleteModal, 
    confirmDeleteModule
  } = useModuleMgmtTable();

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "sno",
        header: "S.No",
        cell: ({ row }) => row.index + 1,
      }),

      columnHelper.accessor("moduleCode", {
        header: "Module Code",
        cell: info => info.getValue() || "- - - - - - - - -",
      }),

      columnHelper.accessor("moduleName", {
        header: "Module Name",
        cell: info => info.getValue() || "- - - - - - - - -",
      }),

      columnHelper.accessor("description", {
        header: "Module Description",
        cell: info => info.getValue() || "- - - - - - - - -",
      }),

      columnHelper.accessor("isActive", {
        header: "Status",
        cell: info => {
          const isActive = Boolean(info.getValue());
          return (
            <span
              className={`text-xs font-medium ${
                isActive ? "text-green-600" : "text-gray-600"
              }`}
            >
              {isActive ? "ACTIVE" : "INACTIVE"}
            </span>
          );
        },
      }),

      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          return (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="xs"
                onClick={() => onEdit(row.original.identity)}
                disabled={!row.original.isActive}
                className="text-primary hover:bg-primary/50 h-6 w-6 p-0"
                title="Edit"
              >
                <Pencil className="h-3 w-3" />
              </Button>

              <Button
                variant="ghost"
                title="Delete"
                className="text-status-error hover:bg-status-error-background h-6 w-6 p-0"
                size="xs"
                onClick={() => openDeleteModal(row.original.identity)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div> 
          );
        }
      }),
    ],
    [openDeleteModal, onEdit]
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
    <Grid>
      <Grid.Item>
        <CommonTable
          table={table}
          size="default"
          noDataText={isFetching ? "Loading..." : "No Module Records"}
          className="bg-card"
        />
      </Grid.Item>
    </Grid>

    <ConfirmationModal
              isOpen={showDeleteModal}
              onConfirm={confirmDeleteModule}
              onCancel={closeDeleteModal}
              title="Delete Module"
              message="Are you sure you want to delete this module? This action cannot be undone."
              confirmText="Delete"
              cancelText="Cancel"
              type="error"
              size="compact"
            />
    </>
  );
};
