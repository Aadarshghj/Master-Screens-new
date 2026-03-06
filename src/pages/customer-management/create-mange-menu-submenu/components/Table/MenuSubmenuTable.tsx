import React, { useMemo } from "react";
import { Grid, Button, CommonTable, ConfirmationModal } from "@/components";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Pencil } from "@mynaui/icons-react";
import type { menuSubmenu } from "@/types/customer-management/create-manage-menus-submenu.type";
import { Trash2 } from "lucide-react";
import { useMenuSubmenuTable } from "../Hooks/useMenuSubmenuTable";

const columnHelper = createColumnHelper<menuSubmenu>();
interface MenuSubmenuProps {
  onEdit: (menuIdentity: menuSubmenu) => void
}

export const MenuSubmenuTable: React.FC<MenuSubmenuProps> = ({
  onEdit,
}) => {
  const {
    data,
    showDeleteModal,
    openDeleteModal,
    closeDeleteModal,
    confirmDeleteMenuSubmenu,
  } = useMenuSubmenuTable();

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "sno",
        header: "S.No",
        cell: ({ row }) => row.index + 1,
      }),

      columnHelper.accessor("menuName", {
        header: "Menu Name ",
      }),

      columnHelper.accessor("menucode", {
        header: "Menu Code ",
      }),
      columnHelper.accessor("description", {
        header: "Description ",
      }),
      columnHelper.accessor("menuOrder", {
        header: "Menu Order",
      }),
      columnHelper.accessor("parentMenu", {
        header: "Parent Menu",
      }),

      columnHelper.accessor("url", {
        header: "URL",
      }),

      columnHelper.accessor("pageurl", {
        header: "Page URL",
      }),
      columnHelper.accessor("isActive", {
        header: "Status",
        cell: info => {
          const status = Boolean(info.getValue());
          return (
            <span
              className={`text-xs font-medium ${status ? "text-green-600" : "text-red-600"
                }`}
            >
              {status ? "ACTIVE" : "INACTIVE"}
            </span>
          );
        },
      })
      ,
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
              onClick={() => openDeleteModal(row.original.menuIdentity)}
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
        onConfirm={confirmDeleteMenuSubmenu}
        onCancel={closeDeleteModal}
        title="Delete Menu"
        message="Are you sure you want to delete this Menu? This action cannot be undone"
        confirmText="Delete"
        cancelText="Cancel"
        type="error"
        size="compact"
      />
    </>
  );
};