import React, { useMemo } from "react";
import { Grid, CommonTable, ConfirmationModal } from "@/components";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Trash2 } from "lucide-react";

import type { ReferralSource } from "@/types/customer-management/referral-sources";
import { useReferralSourceTable } from "../Hooks/useReferralSourcesTable";

const columnHelper = createColumnHelper<ReferralSource>();

export const ReferralSourceTable: React.FC = () => {
  const {
    data,
    isFetching,
    showDeleteModal,
    openDeleteModal,
    closeDeleteModal,
    confirmDeleteReferralSource,
  } = useReferralSourceTable();

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "sno",
        header: "S.No",
        cell: ({ row }) => row.index + 1,
      }),

      columnHelper.accessor("referralName", {
        header: "Referral Name",
      }),

      columnHelper.accessor("referralCode", {
        header: "Referral Code",
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
            noDataText={
              isFetching ? "Loading..." : "No Referral Sources available"
            }
            className="bg-card"
          />
        </Grid.Item>
      </Grid>

      <ConfirmationModal
        isOpen={showDeleteModal}
        onConfirm={confirmDeleteReferralSource}
        onCancel={closeDeleteModal}
        title="Delete Referral Source"
        message="Are you sure you want to delete this referral source? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="error"
        size="compact"
      />
    </>
  );
};
