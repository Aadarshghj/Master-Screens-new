import React, { useMemo } from "react";
import { Grid, CommonTable, ConfirmationModal } from "@/components";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Trash2 } from "lucide-react";
import type {
  DesignationType,
  Option,
} from "@/types/customer-management/designation";
import { useDesignationTable } from "../Hooks/useDesignationTable";

const columnHelper = createColumnHelper<DesignationType>();

interface DesignationTableProps {
  occupationOptions: Option[];
}

export const DesignationDetailsTable: React.FC<DesignationTableProps> = ({
  occupationOptions,
}) => {
  const {
    data,
    isFetching,
    showDeleteModal,
    openDeleteModal,
    closeDeleteModal,
    confirmDeleteDesignation,
  } = useDesignationTable();

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "sno",
        header: "S.No",
        cell: ({ row }) => row.index + 1,
      }),

      columnHelper.accessor("designationName", {
        header: "Designation Name",
      }),

      columnHelper.accessor("designationCode", {
        header: "Designation Code",
      }),

      columnHelper.accessor("level", {
        header: "Field Level",
      }),

      columnHelper.accessor("occupation", {
        header: "Field Occupation",
        cell: info => {
          const occId = info.getValue();
          const occ = occupationOptions?.find(o => o?.value === occId);
          return occ?.label ?? occId;
        },
      }),

      columnHelper.accessor("managerial", {
        header: "Managerial",
        cell: info => (info.getValue() ? "Yes" : "No"),
      }),

      columnHelper.accessor("description", {
        header: "Description",
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
    [openDeleteModal, occupationOptions]
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
              isFetching ? "Loading..." : "No designation records available"
            }
            className="bg-card"
          />
        </Grid.Item>
      </Grid>

      <ConfirmationModal
        isOpen={showDeleteModal}
        onConfirm={confirmDeleteDesignation}
        onCancel={closeDeleteModal}
        title="Delete Designation"
        message="Are you sure you want to delete this designation? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="error"
        size="compact"
      />
    </>
  );
};
