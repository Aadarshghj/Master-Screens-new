import React, { useMemo } from "react";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  CommonTable,
  ConfirmationModal,
  Grid,
} from "../../../../../components/ui";
import { Pencil, Trash2 } from "lucide-react";
import { BranchType } from "../../../../../types/customer-management/branch-type";
import NeumorphicButton from "../../../../../components/ui/neumorphic-button/neumorphic-button";

const columnHelper = createColumnHelper<BranchType>();

interface Props {
  data: BranchType[];
  onEdit: (row: BranchType) => void;
  onDelete: (id: string) => void;
  showDeleteModal: boolean;
  confirmDelete: () => void;
  closeDeleteModal: () => void;
}

export const BranchTypeMasterTable: React.FC<Props> = ({
  data,
  onEdit,
  onDelete,
  showDeleteModal,
  confirmDelete,
  closeDeleteModal,
}) => {
  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "sno",
        header: "S.No",
        cell: ({ row }) => row.index + 1,
      }),

      columnHelper.accessor("branchTypeCode",{
        header: "Branch Type Code",
      }),

      columnHelper.accessor("branchTypeName", {
        header: "Branch Type Name",
      }),

      columnHelper.accessor("branchTypeDesc", {
        header: "Branch Type Description",
        cell: (info) => info.getValue() || "—",
      }),

      columnHelper.accessor("isActive", {
        header: "Status",
        cell: (info) => (
          <span
            className={
              info.getValue()
                ? "text-green-600 font-medium"
                : "text-red-600 font-medium"
            }
          >
            {info.getValue() ? "ACTIVE" : "INACTIVE"}
          </span>
        ),
      }),

      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <NeumorphicButton
              variant="none"
              className="h-6 w-6 p-0"
              onClick={() => onEdit(row.original)}
            >
              <Pencil size={13} />
            </NeumorphicButton>

            <NeumorphicButton
              variant="none"
              className="text-status-error h-6 w-6 p-0"
              onClick={() => onDelete(row.original.branchTypeIdentity)}
            >
              <Trash2 size={13} />
            </NeumorphicButton>
          </div>
        ),
      }),
    ],
    [onEdit, onDelete]
  );

  const table = useReactTable({
    data: data ?? [],
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
            noDataText="No branch types found"
            className="bg-card"
          />
        </Grid.Item>
      </Grid>

      <ConfirmationModal
        isOpen={showDeleteModal}
        onConfirm={confirmDelete}
        onCancel={closeDeleteModal}
        title="Delete Branch Type"
        message="Are you sure you want to delete this?"
        confirmText="Delete"
        cancelText="Cancel"
        type="error"
        size="compact"
      />
    </>
  );
};
