import React, { useMemo, useState } from "react";
import { Grid, CommonTable, ConfirmationModal } from "@/components";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";

import type { DocumentMasterResponseDto } from "@/types/customer-management/document-master";
import {
  useGetDocumentMastersQuery,
  useDeleteDocumentMasterMutation,
} from "@/global/service/end-points/customer-management/document-master.api";

const columnHelper = createColumnHelper<DocumentMasterResponseDto>();

export const DocumentMasterDetailsTable: React.FC = () => {
  const { data = [] } = useGetDocumentMastersQuery();
  const [deleteDocumentMaster] = useDeleteDocumentMasterMutation();

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

  const confirmDeleteDocument = async () => {
    if (!selectedIdentity) return;
    try {
      await deleteDocumentMaster(selectedIdentity).unwrap();
      toast.success("Document Master deleted");
    } catch {
      toast.error("Failed to delete Document Master");
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
      columnHelper.accessor("docCode", { header: "Document Code" }),
      columnHelper.accessor(
        (
          row: DocumentMasterResponseDto & {
            docName?: string;
            docname?: string;
          }
        ) => row.docname ?? row.docName ?? "",
        {
          id: "docname",
          header: "Document Name",
        }
      ),
      columnHelper.accessor("docCategory", { header: "Category" }),
      columnHelper.accessor("isIdentityProof", {
        header: "Identity Proof",
        cell: info => (info.getValue() ? "Yes" : "No"),
      }),
      columnHelper.accessor("isAddressProof", {
        header: "Address Proof",
        cell: info => (info.getValue() ? "Yes" : "No"),
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <button
            title="Delete"
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
            noDataText="No document masters available"
          />
        </Grid.Item>
      </Grid>

      <ConfirmationModal
        isOpen={showDeleteModal}
        onConfirm={confirmDeleteDocument}
        onCancel={closeDeleteModal}
        title="Delete Document Master"
        message="Are you sure you want to delete this document master? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="error"
        size="compact"
      />
    </>
  );
};
