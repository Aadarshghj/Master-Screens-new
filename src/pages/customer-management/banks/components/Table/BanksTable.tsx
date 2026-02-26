import React, { useMemo } from "react";
import { Grid, CommonTable, ConfirmationModal } from "@/components";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Trash2 } from "lucide-react";
import type { Bank, Option } from "@/types/customer-management/bank";
import { useBankTable } from "../Hooks/useBanksTable";

const columnHelper = createColumnHelper<Bank>();

interface BankTableProps {
  countryOptions: Option[];
}

export const BankTable: React.FC<BankTableProps> = ({ countryOptions }) => {
  const {
    data,
    isFetching,
    showDeleteModal,
    openDeleteModal,
    closeDeleteModal,
    confirmDeleteBank,
  } = useBankTable();

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "sno",
        header: "S.No",
        cell: ({ row }) => row.index + 1,
      }),
      columnHelper.accessor("bankCode", {
        header: "Bank Code",
      }),
      columnHelper.accessor("bankName", {
        header: "Bank Name",
      }),
      columnHelper.accessor("swiftBicCode", {
        header: "SWIFT/BIC Code",
      }),
      columnHelper.accessor("country", {
        header: "Country",
        cell: info => {
          const occId = info.getValue();
          const occ = countryOptions?.find(o => o?.value === occId);
          return occ?.label ?? occId;
        },
      }),

      columnHelper.accessor("psu", {
        header: "PSU",
        cell: info => (info.getValue() ? "Yes" : "No"),
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
    [openDeleteModal, countryOptions]
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
            noDataText={isFetching ? "Loading..." : "No bank records available"}
            className="bg-card"
          />
        </Grid.Item>
      </Grid>

      <ConfirmationModal
        isOpen={showDeleteModal}
        onConfirm={confirmDeleteBank}
        onCancel={closeDeleteModal}
        title="Delete Bank"
        message="Are you sure you want to delete this bank? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="error"
        size="compact"
      />
    </>
  );
};
