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
import type { UserType } from "@/types/customer-management/user-type";
import NeumorphicButton from "../../../../../components/ui/neumorphic-button/neumorphic-button";

const columnHelper = createColumnHelper<UserType>();

interface Props {
  data: UserType[];
  onEdit: (row: UserType) => void;
  onDelete: (id: string) => void;
  showDeleteModal: boolean;
  confirmDelete: () => void;
  closeDeleteModal: () => void;
}

export const UserTypeMasterTable: React.FC<Props> = ({
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

      columnHelper.accessor("userTypeCode", {
        header: "User Code",
        cell: info => info.getValue() || "—",
      }),

      columnHelper.accessor("userTypeName", {
        header: "User Type Name",
      }),

      columnHelper.accessor("userTypeDesc", {
        header: "Description",
        cell: info => info.getValue() || "—",
      }),



      columnHelper.accessor("isActive", {
        header: "Status",
        cell: info => (
          <span
            className={
              info.getValue()
                ? "font-medium text-green-600"
                : "font-medium text-red-600"
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
              onClick={() => onDelete(row.original.userTypeIdentity)}
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
            noDataText="No user types found"
            className="bg-card"
          />
        </Grid.Item>
      </Grid>

      <ConfirmationModal
        isOpen={showDeleteModal}
        onConfirm={confirmDelete}
        onCancel={closeDeleteModal}
        title="Delete User Type"
        message="Are you sure you want to delete this?"
        confirmText="Delete"
        cancelText="Cancel"
        type="error"
        size="compact"
      />
    </>
  );
};
