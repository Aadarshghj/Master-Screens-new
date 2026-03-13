import React, { useMemo, useState, useCallback } from "react";
import {
  Grid,
  CommonTable,
  ConfirmationModal,
  Button,
  Select,
  Flex,
  Form,
} from "@/components";
import { FormContainer } from "@/components/ui/form-container";
import {
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Pencil, Trash2, Eye, Filter } from "lucide-react";
import type { BranchResponseDto } from "@/types/organisation/admin-unit";
import { useAdminUnitTable, ALL_UNIT_TYPES } from "../hooks/useAdminUnitTable";
import {
  useGetBranchStatusQuery,
  useGetBranchByIdQuery,
} from "@/global/service/end-points/organisation/branches.api";
import { AdminUnitViewModal } from "./AdminUnitViewModal";
import { Pagination } from "@/components/ui/paginationUp";
import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button";

const columnHelper = createColumnHelper<BranchResponseDto>();

const UpperCell = ({ value }: { value: unknown }) => (
  <span className="uppercase">
    {value != null && value !== "" ? String(value) : "—"}
  </span>
);

const ALL_STATUSES = "ALL";

interface AdminUnitTableProps {
  onEdit: (identity: string) => void;
  externalUnitType?: string;
}

const ViewModalLoader: React.FC<{
  identity: string;
  adminUnitTypeLabel: string;
  onClose: () => void;
}> = ({ identity, adminUnitTypeLabel, onClose }) => {
  const { data: fullRow, isFetching } = useGetBranchByIdQuery(identity);

  if (isFetching) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="rounded-lg bg-white px-8 py-6 shadow-xl">
          <p className="text-sm text-gray-600">Loading details…</p>
        </div>
      </div>
    );
  }

  return (
    <AdminUnitViewModal
      row={fullRow ?? null}
      onClose={onClose}
      adminUnitTypeLabel={adminUnitTypeLabel}
    />
  );
};

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

  const { data: rawStatusOptions = [] } = useGetBranchStatusQuery();

  const statusDropdownOptions = useMemo(
    () => [
      { label: "All", value: ALL_STATUSES },
      ...rawStatusOptions.map(o => ({ label: o.label, value: o.value })),
    ],
    [rawStatusOptions]
  );

  const [pendingUnitType, setPendingUnitType] = useState<string>(
    externalUnitType ?? ALL_UNIT_TYPES
  );
  const [pendingStatus, setPendingStatus] = useState<string>(ALL_STATUSES);
  const [appliedStatus, setAppliedStatus] = useState<string>(ALL_STATUSES);

  const handleFilter = () => {
    setSelectedUnitType(pendingUnitType);
    setAppliedStatus(pendingStatus);
  };

  const filteredData = useMemo<BranchResponseDto[]>(() => {
    if (appliedStatus === ALL_STATUSES) return data;
    return data.filter(
      row =>
        row.branchStatusIdentity != null &&
        row.branchStatusIdentity === appliedStatus
    );
  }, [data, appliedStatus]);

  const [viewIdentity, setViewIdentity] = useState<string | null>(null);
  const [viewUnitLabel, setViewUnitLabel] = useState<string>("Branch");

  const handleView = useCallback(
    (row: BranchResponseDto) => {
      const label =
        adminUnitTypeOptions.find(o => o.value === row.adminUnitTypeIdentity)
          ?.label ?? "Branch";
      setViewUnitLabel(label);
      setViewIdentity(row.identity);
    },
    [adminUnitTypeOptions]
  );

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
        cell: ({ row, table }) =>
          table.getState().pagination.pageIndex *
            table.getState().pagination.pageSize +
          row.index +
          1,
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

      columnHelper.accessor("parentBranchName", {
        header: "Parent Branch",
        cell: info => <UpperCell value={info.getValue()} />,
      }),

      columnHelper.display({
        id: "address",
        header: "Address",
        cell: ({ row }) => {
          const door = row.original.doorNumber || "";
          const line1 = row.original.addressLine1 || "";
          const address = [door, line1].filter(Boolean).join(", ");
          return <UpperCell value={address} />;
        },
      }),

      columnHelper.accessor("stateName", {
        header: "State",
        cell: info => <UpperCell value={info.getValue()} />,
      }),

      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const identity = row.original.identity;

          return (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="xs"
                onClick={() => handleView(row.original)}
                disabled={!identity}
                className="h-6 w-6 p-0 text-blue-500 hover:bg-blue-50"
              >
                <Eye className="h-3 w-3" />
              </Button>

              <Button
                variant="ghost"
                size="xs"
                onClick={() => identity && onEdit(identity)}
                disabled={!identity}
                className="text-primary h-6 w-6 p-0"
              >
                <Pencil className="h-3 w-3" />
              </Button>

              <Button
                variant="ghost"
                size="xs"
                onClick={() => identity && openDeleteModal(identity)}
                disabled={!identity}
                className="text-status-error h-6 w-6 p-0"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          );
        },
      }),
    ],
    [openDeleteModal, onEdit, selectedUnitLabel, handleView]
  );
console.log(data);
  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageIndex: 0, pageSize: 10 },
    },
  });

  const noDataText = isFetching
    ? "Loading..."
    : selectedUnitType !== ALL_UNIT_TYPES
      ? `No ${selectedUnitLabel} Records Found`
      : "No Records Found";

  return (
    <>
      <FormContainer className="px-0">
        <Form onSubmit={e => e.preventDefault()}>
          <div className="mt-2">
            <Form.Row>
              <Form.Col lg={2} md={6} span={12}>
                <Form.Field label="Unit Type">
                  <Select
                    value={pendingUnitType}
                    onValueChange={setPendingUnitType}
                    options={dropdownOptions}
                    placeholder="Filter by Type"
                    size="form"
                    variant="form"
                    fullWidth
                    itemVariant="form"
                  />
                </Form.Field>
              </Form.Col>

              <Form.Col lg={2} md={6} span={12}>
                <Form.Field label="Status">
                  <Select
                    value={pendingStatus}
                    onValueChange={setPendingStatus}
                    options={statusDropdownOptions}
                    placeholder="Filter by Status"
                    size="form"
                    variant="form"
                    fullWidth
                    itemVariant="form"
                  />
                </Form.Field>
              </Form.Col>

              <Form.Col lg={1} md={6} span={12}>
                <Flex.ActionGroup className="mt-4 flex items-center justify-end">
                  <NeumorphicButton
                    variant="default"
                    type="button"
                    onClick={handleFilter}
                  >
                    <Filter className="h-5 w-4" />
                    Filter
                  </NeumorphicButton>
                </Flex.ActionGroup>
              </Form.Col>
            </Form.Row>
          </div>
        </Form>
      </FormContainer>

      <p className="text-muted-foreground mb-4 text-sm">
        {selectedUnitType !== ALL_UNIT_TYPES
          ? `Showing: ${selectedUnitLabel}`
          : "Showing all unit types"}
      </p>

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

      {viewIdentity && (
        <ViewModalLoader
          identity={viewIdentity}
          adminUnitTypeLabel={viewUnitLabel}
          onClose={() => setViewIdentity(null)}
        />
      )}
    </>
  );
};
