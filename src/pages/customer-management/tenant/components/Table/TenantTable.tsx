import React, { useMemo } from "react";
import { Grid, CommonTable, ConfirmationModal } from "@/components";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components";
import { Trash2, Pencil } from "lucide-react";
import type { TenantType } from "@/types/customer-management/tenant";
import { useTenantTable } from "../Hooks/useTenantTable";

const columnHelper = createColumnHelper<TenantType>();
interface TenantTableProps {
  data: TenantType[];
  isLoading: boolean;
  onEdit: (identity: TenantType) => void;
  refetchTenants: () => void;
  onDeleted?: (id: string) => void;
}
export const TenantTable: React.FC<TenantTableProps> = ({
  data,
  isLoading = false,
  onEdit,
  refetchTenants,
  onDeleted,
}) => {
  const {
    showDeleteModal,
    openDeleteModal,
    closeDeleteModal,
    confirmDeleteTenant,
  } = useTenantTable(refetchTenants, onDeleted);
  const columns = useMemo(
    () => [
      columnHelper.accessor("tenantCode", {
        header: "Tenant Code",
      }),
      columnHelper.accessor("tenantName", {
        header: "Tenant Name",
      }),

      columnHelper.accessor("isActive", {
        header: "Status",
        cell: info => {
          const isActive = Boolean(info.getValue());
          return (
            <span
              className={`text-xs font-medium ${
                isActive ? "text-green-600" : "text-red-600"
              }`}
            >
              {isActive ? "ACTIVE" : "INACTIVE"}
            </span>
          );
        },
      }),

      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {

          return (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="xs"
                onClick={() => onEdit(row.original)}
                className="text-primary hover:bg-primary/50 h-6 w-6 p-0"
                title="Edit"
              >
                <Pencil className="h-3 w-3" />
              </Button>

              <Button
                variant="ghost"
                size="xs"
                onClick={() => openDeleteModal(row.original.id)}
                className="text-status-error hover:bg-status-error-background h-6 w-6 p-0"
                title="Delete"
              >
                {<Trash2 className="h-3 w-3" />}
              </Button>
            </div>
          );
        },
      }),
    ],
    [openDeleteModal, onEdit]
  );
  const getNoDataText = () => {
    if (isLoading) {
      return "Loading tenant data...";
    }
    return "No tenant data found";
  };

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
            size="default"
            noDataText={getNoDataText()}
            className="bg-card"
          />
        </Grid.Item>
      </Grid>

      <ConfirmationModal
        isOpen={showDeleteModal}
        onConfirm={confirmDeleteTenant}
        onCancel={closeDeleteModal}
        title="Delete Tenant"
        message="Are you sure you want to delete this tenant? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="error"
        size="compact"
      />
    </>
  );
};
