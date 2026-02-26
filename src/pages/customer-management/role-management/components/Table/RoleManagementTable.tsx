import React, { useMemo } from "react";
import { Grid, CommonTable, ConfirmationModal, Button } from "@/components";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type { RoleManagementType } from "@/types/customer-management/role-management";

import { Pencil, Trash2 } from "lucide-react";

import { useRoleManagementTable } from "../Hooks/useRoleManagementTable";

const columnHelper = createColumnHelper<RoleManagementType>();

interface RoleManagementProps {
  onEdit: (identity: RoleManagementType) => void;
}

export const RoleManagementTable: React.FC<RoleManagementProps> = ({
  onEdit,
}) => {
  const {
    data,
    showDeleteModal,
    openDeleteModal,
    closeDeleteModal,
    confirmDeleteRoleManagement,
  } = useRoleManagementTable();

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "sno",
        header: "S.No",
        cell: ({ row }) => row.index + 1,
      }),

      columnHelper.accessor("roleName", {
        header: "Role Name",
      }),

      columnHelper.accessor("roleShortDesc", {
        header: "Description",
      }),
      columnHelper.accessor("isActive", {
        header: "Status",
        cell: info => {
          const isActive = Boolean(info.getValue());
          return (
            <span
              className={`text-xs font-medium ${
                isActive ? "text-green-600" : "text-red-600"
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
        cell: ({ row }) => (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              className="text-primary hover:bg-primary/40 h-6 w-6 p-0"
              onClick={() => onEdit(row.original)}
              title="Edit Property"
            >
              <Pencil size={13} />
            </Button>

            <Button
              onClick={() => openDeleteModal(row.original.identity)}
              variant="ghost"
              className="text-status-error hover:bg-status-error-background h-6 w-6 p-0"
              title="Delete Property"
            >
              <Trash2 size={13} />
            </Button>
          </div>
        ),
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
            noDataText="No user records available"
            className="bg-card"
          />
        </Grid.Item>
      </Grid>

      <ConfirmationModal
        isOpen={showDeleteModal}
        onConfirm={confirmDeleteRoleManagement}
        onCancel={closeDeleteModal}
        title="Delete Role"
        message="Are you sure you want to delete this role? This action cannot be undone"
        confirmText="Delete"
        cancelText="Cancel"
        type="error"
        size="compact"
      />
    </>
  );
};
