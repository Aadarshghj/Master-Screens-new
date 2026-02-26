import React, { useMemo, useState } from "react";
import { Grid, CommonTable, ConfirmationModal } from "@/components";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Trash2 } from "lucide-react";
import type { ProductServiceResponseDto } from "@/types/customer-management/product-service";
import {
  useGetProductServicesQuery,
  useDeleteProductServiceMutation,
} from "@/global/service/end-points/customer-management/product-service.api";
import toast from "react-hot-toast";

const columnHelper = createColumnHelper<ProductServiceResponseDto>();

export const ProductServiceTable: React.FC = () => {
  const { data = [], refetch } = useGetProductServicesQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [deleteProductService] = useDeleteProductServiceMutation();

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

  const confirmDeleteProductService = async () => {
    if (!selectedIdentity) return;
    try {
      await deleteProductService(selectedIdentity).unwrap();
      toast.success("Product service deleted successfully");
      try {
        await refetch();
      } catch {
        // ignore
      }
    } catch {
      toast.error("Failed to delete product service");
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
      columnHelper.accessor("name", {
        header: "Product Service Name",
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
          <CommonTable
            table={table}
            noDataText="No product services available"
          />
        </Grid.Item>
      </Grid>

      <ConfirmationModal
        isOpen={showDeleteModal}
        onConfirm={confirmDeleteProductService}
        onCancel={closeDeleteModal}
        title="Delete Product Service"
        message="Are you sure you want to delete this product service? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="error"
        size="compact"
      />
    </>
  );
};
