import React, { useMemo, useState } from "react";
import { Grid, CommonTable, ConfirmationModal } from "@/components";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Trash2 } from "lucide-react";
import type { AgentMasterType } from "@/types/customer-management/agent-master";
import {
  useDeleteAgentMasterMutation,
  useGetAgentMastersQuery,
} from "@/global/service/end-points/customer-management/agent-master.api";
import toast from "react-hot-toast";

const columnHelper = createColumnHelper<AgentMasterType>();

export const AgentMasterTable: React.FC = () => {
  const { data = [] } = useGetAgentMastersQuery();
  const [deleteAgentMaster] = useDeleteAgentMasterMutation();

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

  const confirmDeleteAgent = async () => {
    if (!selectedIdentity) return;
    try {
      await deleteAgentMaster(selectedIdentity).unwrap();
      toast.success("Agent deleted successfully");
    } catch {
      toast.error("Failed to delete agent");
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
      columnHelper.accessor("agentName", {
        header: "Agent Name",
      }),
      columnHelper.accessor("agentCode", {
        header: "Agent Code",
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
            noDataText="No agent master data available"
            className="bg-card"
          />
        </Grid.Item>
      </Grid>

      <ConfirmationModal
        isOpen={showDeleteModal}
        onConfirm={confirmDeleteAgent}
        onCancel={closeDeleteModal}
        title="Delete Agent"
        message="Are you sure you want to delete this agent? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="error"
        size="compact"
      />
    </>
  );
};
