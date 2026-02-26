import React, { useMemo, useState } from "react";
import { Grid, CommonTable, ConfirmationModal } from "@/components";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Trash2 } from "lucide-react";
import type {
  CustomerGroupFormType,
  CustomerGroupResponseDto,
} from "@/types/customer-management/customer-group-master";
import {
  useDeleteCustomerGroupMutation,
  useGetCustomerMasterGroupsQuery,
} from "@/global/service/end-points/customer-management/customer-group.api";
import toast from "react-hot-toast";

const columnHelper = createColumnHelper<CustomerGroupFormType>();

export const CustomerGroupMasterTable: React.FC = () => {
  const { data } = useGetCustomerMasterGroupsQuery();
  const tableData: CustomerGroupResponseDto[] = useMemo(() => {
    if (!data) return [];

    return data.map(item => ({
      customerGroupName: item.customerGroup,
      customerGroupCode: item.code,
      identity: item.identity,
    }));
  }, [data]);

  const [deleteCustomerGroup] = useDeleteCustomerGroupMutation();

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

  const confirmDeleteCustomerGroup = async () => {
    if (!selectedIdentity) return;
    try {
      await deleteCustomerGroup(selectedIdentity).unwrap();
      toast.success("Customer group deleted successfully");
    } catch {
      toast.error("Failed to delete customer group");
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
      columnHelper.accessor("customerGroupName", {
        header: "Customer Group Name",
      }),
      columnHelper.accessor("customerGroupCode", {
        header: "Customer Group Code",
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
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <Grid>
        <Grid.Item>
          <CommonTable
            table={table}
            noDataText="No Customer Group Master available"
            className="bg-card"
          />
        </Grid.Item>
      </Grid>

      <ConfirmationModal
        isOpen={showDeleteModal}
        onConfirm={confirmDeleteCustomerGroup}
        onCancel={closeDeleteModal}
        title="Delete Customer Group"
        message="Are you sure you want to delete this customer group? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="error"
        size="compact"
      />
    </>
  );
};
