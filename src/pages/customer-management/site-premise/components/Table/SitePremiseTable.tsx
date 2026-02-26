import React, { useMemo, useState } from "react";
import { Grid, CommonTable, ConfirmationModal } from "@/components";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Trash2 } from "lucide-react";
import type { SitePremiseType } from "@/types/customer-management/site-premise";
import {
  useGetSitePremisesQuery,
  useDeleteSitePremiseMutation,
} from "@/global/service/end-points/customer-management/site-premise.api";
import toast from "react-hot-toast";

const columnHelper = createColumnHelper<SitePremiseType>();

export const SitePremiseTable: React.FC = () => {
  const { data = [], refetch } = useGetSitePremisesQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [deleteSitePremise] = useDeleteSitePremiseMutation();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedIdentity, setSelectedIdentity] = useState<string | null>(null);

  const openDeleteModal = (identity: string) => {
    setSelectedIdentity(identity);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setSelectedIdentity(null);
    setShowDeleteModal(false);
  };

  const confirmDeleteSitePremise = async () => {
    if (!selectedIdentity) return;
    try {
      await deleteSitePremise(selectedIdentity).unwrap();
      toast.success("Site premise deleted successfully");
      try {
        await refetch();
      } catch {
        // ignore
      }
    } catch {
      toast.error("Failed to delete site premise");
    } finally {
      closeDeleteModal();
    }
  };

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "sno",
        header: "S.No",
        cell: ({ row }) => row.index + 1,
      }),
      columnHelper.accessor("premiseTypeName", {
        header: "Premise Type Name",
      }),
      columnHelper.accessor("description", {
        header: "Description",
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <button
            onClick={() => openDeleteModal(row.original.identity)}
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
          <CommonTable table={table} noDataText="No site premise available" />
        </Grid.Item>
      </Grid>

      <ConfirmationModal
        isOpen={showDeleteModal}
        onConfirm={confirmDeleteSitePremise}
        onCancel={closeDeleteModal}
        title="Delete Site Premise"
        message="Are you sure you want to delete this site premise? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="error"
        size="compact"
      />
    </>
  );
};
