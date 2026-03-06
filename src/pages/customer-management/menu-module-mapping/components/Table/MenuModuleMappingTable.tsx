import React, { useMemo } from "react";
import { Grid, CommonTable, ConfirmationModal, Button } from "@/components";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";
import type {
  MenuModuleMappingResponseDto,
  
  Option,
} from "@/types/customer-management/menu-module-mapping";
import { useMenuModuleMappingTable } from "../Hooks/useMenuModuleMappingTable";

const columnHelper = createColumnHelper<MenuModuleMappingResponseDto>();

interface MenuModuleMappingTableProps {
  menuNameOptions: Option[];
  moduleNameOptions: Option[];
  onEdit: (row: MenuModuleMappingResponseDto) => void;

}

export const MenuModuleMappingTable: React.FC<MenuModuleMappingTableProps> = ({
  menuNameOptions,
  moduleNameOptions,
  onEdit,
}) => {
  const {
    data,
    isFetching,
    showDeleteModal,
    openDeleteModal,
    closeDeleteModal,
    confirmDeleteMenuModuleMapping,
  } = useMenuModuleMappingTable();

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "sno",
        header: "S.No",
        cell: ({ row }) => row.index + 1,
      }),


      columnHelper.accessor("menuName", {
        header: "Menu Name",
        cell: info => {
          const mnId = info.getValue();
          const mn = menuNameOptions?.find(o => o?.value === mnId);
          return mn?.label ?? mnId;
        },
      }),
      columnHelper.accessor("moduleName", {
        header: "Module",
        cell: info => {
          const moId = info.getValue();
          const mo = moduleNameOptions?.find(m => m?.value === moId);
          return mo?.label ?? moId;
        },
      }),

      columnHelper.accessor("isActive", {
        header: "Status",
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
        title="Edit"
        onClick={()=>onEdit(row.original)}
      >
        <Pencil size={13} />
      </Button>

      <button
        title="Delete"
        onClick={() => openDeleteModal(row.original.identity)}
        className="text-destructive hover:opacity-80"
      >
        <Trash2 size={12} />
      </button>
    </div>
  ),
}),
  
    ],
    [openDeleteModal,menuNameOptions, moduleNameOptions,onEdit]
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
            noDataText={
              isFetching ? "Loading..." : "No records available"
            }
            className="bg-card"
          />
        </Grid.Item>
      </Grid>

      <ConfirmationModal
        isOpen={showDeleteModal}
        onConfirm={confirmDeleteMenuModuleMapping}
        onCancel={closeDeleteModal}
        title="Delete Menu Module"
        message="Are you sure you want to delete this? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="error"
        size="compact"
      />
    </>
  );
};
