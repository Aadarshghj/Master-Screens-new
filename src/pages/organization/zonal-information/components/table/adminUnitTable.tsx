import React, { useMemo, useState } from "react";
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
  useGetBranchCategoryQuery,
} from "@/global/service/end-points/organisation/branches.api";
import { AdminUnitViewModal } from "./AdminUnitViewModal";
import { Pagination } from "@/components/ui/paginationUp";
import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button";

const columnHelper = createColumnHelper<BranchResponseDto>();

const UpperCell = ({ value }: { value: unknown }) => (
  <span className="uppercase">{String(value ?? "")}</span>
);

const ALL_STATUSES = "ALL";

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

  const { data: rawStatusOptions = [] } = useGetBranchStatusQuery();

  const { data: categoryOptions = [] } = useGetBranchCategoryQuery();

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
    return data.filter(row => row.branchStatusIdentity === appliedStatus);
  }, [data, appliedStatus]);

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

      columnHelper.accessor("parentBranchName", {
        header: "Parent Branch",
        cell: info => <UpperCell value={info.getValue() ?? "—"} />,
      }),

      columnHelper.display({
        id: "category",
        header: "Category",
        cell: ({ row }) => {
          const match = categoryOptions.find(
            o => o.value === row.original.branchCategoryIdentity
          );
          return <UpperCell value={match?.label ?? "—"} />;
        },
      }),

      columnHelper.display({
        id: "address",
        header: "Address",
        cell: ({ row }) => {
          const door = row.original.doorNumber ?? "";
          const line1 = row.original.addressLine1 ?? "";
          const combined = [door, line1].filter(Boolean).join(", ");
          return <UpperCell value={combined || "—"} />;
        },
      }),

      columnHelper.accessor("pincode", {
        header: "PIN Code",
        cell: info => <UpperCell value={info.getValue()} />,
      }),

      columnHelper.accessor("stateName", {
        header: "State",
        cell: info => <UpperCell value={info.getValue()} />,
      }),

      columnHelper.display({
        id: "status",
        header: "Status",
        cell: ({ row }) => {
          const match = rawStatusOptions.find(
            o => o.value === row.original.branchStatusIdentity
          );
          const label = match?.label?.toUpperCase() ?? "—";
          const isActive = row.original.isActive;
          return (
            <span
              className={
                isActive
                  ? "font-medium text-green-600"
                  : "font-medium text-red-500"
              }
            >
              {label}
            </span>
          );
        },
      }),

      // Actions
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
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
    [
      openDeleteModal,
      onEdit,
      selectedUnitLabel,
      categoryOptions,
      rawStatusOptions,
    ]
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 10,
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

              {/* Filter button */}
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

      <AdminUnitViewModal
        row={viewRow}
        onClose={() => setViewRow(null)}
        adminUnitTypeLabel={viewRowUnitLabel}
      />
    </>
  );
};
