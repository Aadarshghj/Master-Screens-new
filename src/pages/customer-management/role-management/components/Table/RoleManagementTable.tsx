import React, { useMemo } from "react";
import { Grid, CommonTable, ConfirmationModal } from "@/components";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type { RoleManagementType } from "@/types/customer-management/role-management";



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
