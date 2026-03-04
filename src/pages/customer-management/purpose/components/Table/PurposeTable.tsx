import React, { useMemo } from "react";
import { Grid, CommonTable, ConfirmationModal } from "@/components";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Trash2 } from "lucide-react";
import type { Purpose } from "@/types/customer-management/purpose";
import { usePurposeTable } from "../Hooks/usePurposeTable";

const columnHelper = createColumnHelper<Purpose>();

export const PurposeTable: React.FC = () => {
  const {
    data,
    isFetching,
    showDeleteModal,
    openDeleteModal,
    closeDeleteModal,
    confirmDeletePurpose,
  } = usePurposeTable();

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "sno",
        header: "S.No",
        cell: ({ row }) => row.index + 1,
      }),

      columnHelper.accessor("purposeType", {
        header: "Purpose Type",
      }),

      columnHelper.accessor("purposeCode", {
        header: "Purpose Code",
      }),

      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <button
            title="Delete"
            onClick={() => openDeleteModal(row.original.id)}
            className="text-destructive hover:opacity-80"
          >
            <Trash2 size={12} />
          </button>
        ),
      }),
    ],
    [openDeleteModal]
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
            noDataText={isFetching ? "Loading..." : "No Purposes available"}
            className="bg-card"
          />
        </Grid.Item>
      </Grid>

      <ConfirmationModal
        isOpen={showDeleteModal}
        onConfirm={confirmDeletePurpose}
        onCancel={closeDeleteModal}
        title="Delete Purpose"
        message="Are you sure you want to delete this purpose? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="error"
        size="compact"
      />
    </>
  );
};
