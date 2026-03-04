import React, { useMemo, useState } from "react";
import { Grid, CommonTable, ConfirmationModal } from "@/components";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";

import type { DocumentTypeResponseDto } from "@/types/customer-management/document-type";
import {
  useGetDocumentTypesQuery,
  useDeleteDocumentTypeMutation,
} from "@/global/service/end-points/customer-management/document-type.api";

const columnHelper = createColumnHelper<DocumentTypeResponseDto>();

export const DocumentTypeTable: React.FC = () => {
  const {
    data = [],
    isLoading,
    refetch,
  } = useGetDocumentTypesQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [deleteDocumentType] = useDeleteDocumentTypeMutation();

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

  const confirmDeleteDocumentType = async () => {
    if (!selectedIdentity) return;
    try {
      await deleteDocumentType(selectedIdentity).unwrap();
      toast.success("Document Type deleted");
      try {
        await refetch();
      } catch {
        // ignore
      }
    } catch {
      toast.error("Failed to delete Document Type");
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
      columnHelper.accessor("code", {
        header: "Code",
      }),
      columnHelper.accessor("displayName", {
        header: "Display Name",
      }),
      columnHelper.accessor("description", {
        header: "Description",
      }),
      columnHelper.accessor("isActive", {
        header: "Status",
        cell: info => (info.getValue() ? "Active" : "Inactive"),
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
          <CommonTable
            table={table}
            loading={isLoading}
            noDataText="No document types available"
          />
        </Grid.Item>
      </Grid>

      <ConfirmationModal
        isOpen={showDeleteModal}
        onConfirm={confirmDeleteDocumentType}
        onCancel={closeDeleteModal}
        title="Delete Document Type"
        message="Are you sure you want to delete this document type? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="error"
        size="compact"
      />
    </>
  );
};
