import React, { useMemo } from "react";
import { Grid, CommonTable, ConfirmationModal, Button } from "@/components";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";
import type { AdminUnitType } from "@/types/customer-management/admin-unit-type";
import { useAdminUnitTypeTable } from "../hooks/useAdminUnitTypeTable";

const columnHelper = createColumnHelper<AdminUnitType>();

interface AdminUnitTypeTableProps {
  onEdit: (adminUnitTypeIdentity: string) => void;
}

export const AdminUnitTypeTable: React.FC<AdminUnitTypeTableProps> = ({
  onEdit
}) => {
  const {
    data,
    isFetching, 
    showDeleteModal,
    openDeleteModal,
    closeDeleteModal,
    confirmDeleteAdminUnit,
  } = useAdminUnitTypeTable();

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "sno",
        header: "S.No",
        cell: ({ row }) => row.index + 1,
      }),

      columnHelper.accessor("adminUnitCode", {
        header: "Admin Unit Type Code",
      }),

      columnHelper.accessor("adminUnitType", {
        header: "Admin Unit Type Name",
      }),

      columnHelper.accessor("description", {
        header: "Description",
        cell: (info) => info.getValue() || "---------------",
      }),

      columnHelper.accessor("hierarchyLevel", {
        header: "Hierarchy",
      }),

      columnHelper.accessor("isActive", {
        header: "Status",
        cell: (info) => (info.getValue() ? "Active" : "Inactive"),
      }),

        columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: ({row}) => {
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
          },
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
            noDataText={isFetching ? "Loading..." : "No Admin Unit Type Records"}
            className="bg-card"
          />
        </Grid.Item>
      </Grid>

      <ConfirmationModal
              isOpen={showDeleteModal}
              onConfirm={confirmDeleteAdminUnit}
              onCancel={closeDeleteModal}
              title="Delete Admin Unit"
              message="Are you sure you want to delete this admin unit? This action cannot be undone."
              confirmText="Delete"
              cancelText="Cancel"
              type="error"
              size="compact"
            />

    </>
  );
};