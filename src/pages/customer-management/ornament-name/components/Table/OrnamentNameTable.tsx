import React, { useMemo } from "react";
import { Grid, CommonTable, ConfirmationModal, Button } from "@/components";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";
import type { OrnamentNameTable } from "@/types/customer-management/ornament-name";
import { useOrnamentNameTable } from "../Hooks/useOrnamentNameTable";

const columnHelper = createColumnHelper<OrnamentNameTable>();

interface OrnamentNameTableProps {
  onEdit: (identity: string) => void;
}

export const OrnamentNameTables: React.FC<OrnamentNameTableProps> = ({
  onEdit
}) => {
  const {
    data,
    isFetching,
    showDeleteModal,
    openDeleteModal,
    closeDeleteModal,
    confirmDeleteOrnamentName
   } = useOrnamentNameTable();

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "sno",
        header: "S.No",
        cell: ({ row }) => row.index + 1,
      }),

      columnHelper.accessor("ornamentType", {
        header: "Ornament Type",
      }),

      columnHelper.accessor("ornamentCode", {
        header: "Ornament Code",
        cell: (info) => info.getValue(),
      }),

      columnHelper.accessor("ornamentName", {
        header: "Ornament Name",
        cell: (info) => info.getValue(),
      }),

      columnHelper.accessor("description", {
        header: "Description",
        cell: (info) => info.getValue(),
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
                size="xs"
                onClick={() => openDeleteModal(row.original.identity)}
                className="text-status-error hover:bg-status-error-background h-6 w-6 p-0"
              >
                <Trash2 size={13} />
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
            noDataText={ isFetching ? "Loading..." : "No Ornament Name"}
            className="bg-card"
        />
        </Grid.Item>
      </Grid>

      <ConfirmationModal
          isOpen={showDeleteModal}
          onConfirm={confirmDeleteOrnamentName}
          onCancel={closeDeleteModal}
          title="Delete Ornament Name"
          message="Are you sure you want to delete this ornament name? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          type="error"
          size="compact"
        />
    </>
  );
};