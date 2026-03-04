import React, { useMemo } from "react";
import { Grid, CommonTable, ConfirmationModal } from "@/components";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Trash2 } from "lucide-react";
import type { RiskCategoryType } from "@/types/customer-management/risk-category";
import { useRiskCategoryTable } from "../Hooks/useRiskCategoryTable";

const columnHelper = createColumnHelper<RiskCategoryType>();

export const RiskCategoryTable: React.FC = () => {
  const {
    data,
    isFetching,
    showDeleteModal,
    openDeleteModal,
    closeDeleteModal,
    confirmDeleteRiskCategory,
  } = useRiskCategoryTable();

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "sno",
        header: "S.No",
        cell: ({ row }) => row.index + 1,
      }),

      columnHelper.accessor("riskCategoryName", {
        header: "Risk Category Name",
      }),

      columnHelper.accessor("riskCategoryCode", {
        header: "Risk Category Code",
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
              isFetching ? "Loading..." : "No Risk Categories available"
            }
            className="bg-card"
          />
        </Grid.Item>
      </Grid>

      <ConfirmationModal
        isOpen={showDeleteModal}
        onConfirm={confirmDeleteRiskCategory}
        onCancel={closeDeleteModal}
        title="Delete Risk Category"
        message="Are you sure you want to delete this risk category? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="error"
        size="compact"
      />
    </>
  );
};
