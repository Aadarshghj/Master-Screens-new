import React, { useMemo, useState } from "react";
import {
  Grid,
  CommonTable,
  ConfirmationModal,
  Button,
  Select,
} from "@/components";
import {
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Pencil, Trash2, Eye } from "lucide-react";
import type { BranchResponseDto } from "@/types/organisation/admin-unit";
import { useAdminUnitTable, ALL_UNIT_TYPES } from "../hooks/useAdminUnitTable";
import { AdminUnitViewModal } from "./AdminUnitViewModal";
import { Pagination } from "@/components/ui/paginationUp";

const columnHelper = createColumnHelper<BranchResponseDto>();

const UpperCell = ({ value }: { value: unknown }) => (
  <span className="uppercase">{String(value ?? "")}</span>
);

interface AdminUnitTableProps {
  onEdit: (identity: string) => void;
  externalUnitType?: string;
}

export const AdminUnitTable: React.FC<AdminUnitTableProps> = ({
  onEdit,
  externalUnitType,
}) => {
  const {
    data,
    isFetching,
    adminUnitTypeOptions,
    selectedUnitType,
    setSelectedUnitType,
    selectedUnitLabel,
    showDeleteModal,
    openDeleteModal,
    closeDeleteModal,
    confirmDeleteAdminUnit,
  } = useAdminUnitTable({ externalUnitType });

  const [viewRow, setViewRow] = useState<BranchResponseDto | null>(null);

  const viewRowUnitLabel = useMemo(() => {
    if (!viewRow) return "Branch";
    return (
      adminUnitTypeOptions.find(o => o.value === viewRow.adminUnitTypeIdentity)
        ?.label ?? "Branch"
    );
  }, [viewRow, adminUnitTypeOptions]);

  const dropdownOptions = useMemo(
    () => [
      { label: "All", value: ALL_UNIT_TYPES },
      ...adminUnitTypeOptions.map(o => ({ label: o.label, value: o.value })),
    ],
    [adminUnitTypeOptions]
  );

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "sno",
        header: "S.No",
        cell: ({ row }) => row.index + 1,
      }),
      columnHelper.accessor("branchCode", {
        header: `${selectedUnitLabel} Code`,
        cell: info => <UpperCell value={info.getValue()} />,
      }),
      columnHelper.accessor("branchName", {
        header: `${selectedUnitLabel} Name`,
        cell: info => <UpperCell value={info.getValue()} />,
      }),
      columnHelper.accessor("branchShortName", {
        header: "Short Name",
        cell: info => <UpperCell value={info.getValue()} />,
      }),
      columnHelper.accessor("districtName", {
        header: "District",
        cell: info => <UpperCell value={info.getValue()} />,
      }),
      columnHelper.accessor("stateName", {
        header: "State",
        cell: info => <UpperCell value={info.getValue()} />,
      }),
      columnHelper.accessor("postOffice", {
        header: "Post Office",
        cell: info => <UpperCell value={info.getValue()} />,
      }),
      columnHelper.accessor("pincode", {
        header: "PIN Code",
        cell: info => <UpperCell value={info.getValue()} />,
      }),
      columnHelper.accessor("isActive", {
        header: "Status",
        cell: info => (
          <span
            className={
              info.getValue()
                ? "font-medium text-green-600"
                : "font-medium text-red-500"
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
          <div className="flex items-center gap-2">
            {/* View */}
            <Button
              variant="ghost"
              size="xs"
              onClick={() => setViewRow(row.original)}
              className="h-6 w-6 p-0 text-blue-500 hover:bg-blue-50"
              title="View"
              aria-label={`View ${row.original.branchCode}`}
            >
              <Eye className="h-3 w-3" />
            </Button>

            {/* Edit */}
            <Button
              variant="ghost"
              size="xs"
              onClick={() => onEdit(row.original.identity)}
              disabled={!row.original.isActive}
              className="text-primary hover:bg-primary/50 h-6 w-6 p-0"
              title="Edit"
              aria-label={`Edit ${row.original.branchCode}`}
            >
              <Pencil className="h-3 w-3" />
            </Button>

            {/* Delete */}
            <Button
              variant="ghost"
              title="Delete"
              aria-label={`Delete ${row.original.branchCode}`}
              className="text-status-error hover:bg-status-error-background h-6 w-6 p-0"
              size="xs"
              onClick={() => openDeleteModal(row.original.identity)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        ),
      }),
    ],
    [openDeleteModal, onEdit, selectedUnitLabel]
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 5,
      },
    },
  });

  const noDataText = isFetching
    ? "Loading..."
    : selectedUnitType !== ALL_UNIT_TYPES
      ? `No ${selectedUnitLabel} Records Found`
      : "No Records Found";

  return (
    <>
      <div className="mb-4 flex items-center justify-between gap-4">
        <p className="text-muted-foreground text-sm">
          {selectedUnitType !== ALL_UNIT_TYPES
            ? `Showing: ${selectedUnitLabel}`
            : "Showing all unit types"}
        </p>

        <div className="w-48">
          <Select
            value={selectedUnitType}
            onValueChange={setSelectedUnitType}
            options={dropdownOptions}
            placeholder="Filter by Type"
            size="form"
            variant="form"
            fullWidth
            itemVariant="form"
          />
        </div>
      </div>

      <Grid>
        <Grid.Item>
          <CommonTable
            table={table}
            noDataText={noDataText}
            className="bg-card"
          />
        </Grid.Item>
      </Grid>

      {table.getRowModel().rows.length > 0 && table.getPageCount() > 0 && (
        <div className="mt-4 flex items-center justify-between text-sm">
          <div className="text-muted-foreground whitespace-nowrap">
            Showing{" "}
            {table.getState().pagination.pageIndex *
              table.getState().pagination.pageSize +
              1}{" "}
            to{" "}
            {Math.min(
              (table.getState().pagination.pageIndex + 1) *
                table.getState().pagination.pageSize,
              table.getFilteredRowModel().rows.length
            )}{" "}
            of {table.getFilteredRowModel().rows.length} entries
          </div>

          <div className="flex items-center gap-3">
            <Pagination
              currentPage={table.getState().pagination.pageIndex}
              totalPages={table.getPageCount()}
              onPageChange={page => table.setPageIndex(page)}
              onPreviousPage={() => table.previousPage()}
              onNextPage={() => table.nextPage()}
              canPreviousPage={table.getCanPreviousPage()}
              canNextPage={table.getCanNextPage()}
              maxVisiblePages={5}
            />
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={showDeleteModal}
        onConfirm={confirmDeleteAdminUnit}
        onCancel={closeDeleteModal}
        title="Delete Record"
        message={`Are you sure you want to delete this ${selectedUnitLabel.toLowerCase()}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="error"
        size="compact"
      />

      <AdminUnitViewModal
        row={viewRow}
        onClose={() => setViewRow(null)}
        adminUnitTypeLabel={viewRowUnitLabel}
      />
    </>
  );
};