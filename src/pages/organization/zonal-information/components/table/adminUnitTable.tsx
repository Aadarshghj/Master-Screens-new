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

// ── Types ──────────────────────────────────────────────────────────────────────
type TableRow =
  | { type: "data"; data: BranchResponseDto; globalIndex: number }
  | { type: "divider"; label: string };

const ALL_STATUSES = "ALL";
const PAGE_SIZE = 10;

const columnHelper = createColumnHelper<TableRow>();

// Renders a string value in uppercase, falls back to "—"
const UpperCell = ({ value }: { value: unknown }) => (
  <span className="uppercase">
    {value != null && value !== "" ? String(value) : "—"}
  </span>
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

  // Fetch lookup options so we can resolve identities → labels in the table
  const { data: rawStatusOptions = [] } = useGetBranchStatusQuery();
  const { data: categoryOptions = [] } = useGetBranchCategoryQuery();

  // ── Filter dropdowns ───────────────────────────────────────────────────────
  const dropdownOptions = useMemo(
    () => [
      { label: "All", value: ALL_UNIT_TYPES },
      ...adminUnitTypeOptions.map(o => ({ label: o.label, value: o.value })),
    ],
    [adminUnitTypeOptions]
  );

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
  const [pageIndex, setPageIndex] = useState(0);

  const handleFilter = () => {
    setSelectedUnitType(pendingUnitType);
    setAppliedStatus(pendingStatus);
    setPageIndex(0);
  };

  // ── Step 1: status filter ──────────────────────────────────────────────────
  const statusFiltered = useMemo<BranchResponseDto[]>(() => {
    if (appliedStatus === ALL_STATUSES) return data;
    return data.filter(row => row.branchStatusIdentity === appliedStatus);
  }, [data, appliedStatus]);

  // ── Step 2: sort ascending by numeric suffix of branchCode ─────────────────
  const sortedData = useMemo<BranchResponseDto[]>(
    () =>
      [...statusFiltered].sort((a, b) => {
        const numA = parseInt(a.branchCode.replace(/\D/g, ""), 10) || 0;
        const numB = parseInt(b.branchCode.replace(/\D/g, ""), 10) || 0;
        if (numA !== numB) return numA - numB;
        return a.branchCode.localeCompare(b.branchCode);
      }),
    [statusFiltered]
  );

  // ── Step 3: assign stable global 1-based index ────────────────────────────
  const indexedData = useMemo(
    () =>
      sortedData.map((row, i) => ({
        type: "data" as const,
        data: row,
        globalIndex: i + 1,
      })),
    [sortedData]
  );

  // ── Step 4: manual pagination on REAL rows only ────────────────────────────
  const totalDataRows = indexedData.length;
  const totalPages = Math.max(1, Math.ceil(totalDataRows / PAGE_SIZE));
  const safePageIndex = Math.min(pageIndex, totalPages - 1);

  const pageSlice = useMemo(
    () =>
      indexedData.slice(
        safePageIndex * PAGE_SIZE,
        (safePageIndex + 1) * PAGE_SIZE
      ),
    [indexedData, safePageIndex]
  );

  // ── Step 5: inject dividers into page slice ────────────────────────────────
  const isAllTypes = selectedUnitType === ALL_UNIT_TYPES;

  const tableRows = useMemo<TableRow[]>(() => {
    if (!isAllTypes) return pageSlice;

    const result: TableRow[] = [];
    let lastTypeId: string | null = null;

    pageSlice.forEach(item => {
      const typeId = item.data.adminUnitTypeIdentity;
      if (typeId !== lastTypeId) {
        const label =
          adminUnitTypeOptions.find(o => o.value === typeId)?.label ?? "Other";
        result.push({ type: "divider", label });
        lastTypeId = typeId;
      }
      result.push(item);
    });

    return result;
  }, [pageSlice, isAllTypes, adminUnitTypeOptions]);

  // ── View modal ─────────────────────────────────────────────────────────────
  const [viewRow, setViewRow] = useState<BranchResponseDto | null>(null);

  const viewRowUnitLabel = useMemo(() => {
    if (!viewRow) return "Branch";
    return (
      adminUnitTypeOptions.find(o => o.value === viewRow.adminUnitTypeIdentity)
        ?.label ?? "Branch"
    );
  }, [viewRow, adminUnitTypeOptions]);

  // ── Columns ────────────────────────────────────────────────────────────────
  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "sno",
        header: "S.No",
        cell: ({ row }) => {
          const r = row.original;
          if (r.type === "divider") {
            return (
              <td
                colSpan={10}
                className="bg-muted/40 text-muted-foreground border-b px-3 py-1.5 text-xs font-semibold tracking-wider uppercase"
              >
                {r.label}
              </td>
            );
          }
          return <span>{r.globalIndex}</span>;
        },
      }),

      columnHelper.display({
        id: "branchCode",
        header: `${selectedUnitLabel} Code`,
        cell: ({ row }) => {
          const r = row.original;
          if (r.type === "divider") return null;
          return <UpperCell value={r.data.branchCode} />;
        },
      }),

      columnHelper.display({
        id: "branchName",
        header: `${selectedUnitLabel} Name`,
        cell: ({ row }) => {
          const r = row.original;
          if (r.type === "divider") return null;
          return <UpperCell value={r.data.branchName} />;
        },
      }),

      columnHelper.display({
        id: "parentBranchName",
        header: "Parent Branch",
        cell: ({ row }) => {
          const r = row.original;
          if (r.type === "divider") return null;
          return <UpperCell value={r.data.parentBranchName} />;
        },
      }),

      columnHelper.display({
        id: "category",
        header: "Category",
        cell: ({ row }) => {
          const r = row.original;
          if (r.type === "divider") return null;
          const label =
            categoryOptions.find(o => o.value === r.data.branchCategoryIdentity)
              ?.label ?? r.data.branchCategoryIdentity;
          return <UpperCell value={label} />;
        },
      }),

      columnHelper.display({
        id: "address",
        header: "Address",
        cell: ({ row }) => {
          const r = row.original;
          if (r.type === "divider") return null;
          const parts = [r.data.doorNumber, r.data.addressLine1].filter(
            Boolean
          );
          return <UpperCell value={parts.join(", ")} />;
        },
      }),

      columnHelper.display({
        id: "pincode",
        header: "PIN Code",
        cell: ({ row }) => {
          const r = row.original;
          if (r.type === "divider") return null;
          return <UpperCell value={r.data.pincode} />;
        },
      }),

      columnHelper.display({
        id: "stateName",
        header: "State",
        cell: ({ row }) => {
          const r = row.original;
          if (r.type === "divider") return null;
          return <UpperCell value={r.data.stateName} />;
        },
      }),

      columnHelper.display({
        id: "status",
        header: "Status",
        cell: ({ row }) => {
          const r = row.original;
          if (r.type === "divider") return null;
          const label =
            rawStatusOptions.find(o => o.value === r.data.branchStatusIdentity)
              ?.label ?? r.data.branchStatusIdentity;
          return (
            <span
              className={
                r.data.isActive
                  ? "font-medium text-green-600"
                  : "font-medium text-red-500"
              }
            >
              {label?.toUpperCase() ?? "—"}
            </span>
          );
        },
      }),

      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const r = row.original;
          if (r.type === "divider") return null;

          const isMatchingUnitType = externalUnitType
            ? r.data.adminUnitTypeIdentity === externalUnitType
            : true;
          const canEdit = r.data.isActive && isMatchingUnitType;

          return (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="xs"
                onClick={() => setViewRow(r.data)}
                className="h-6 w-6 p-0 text-blue-500 hover:bg-blue-50 hover:text-blue-700"
                title="View"
                aria-label={`View ${r.data.branchCode}`}
              >
                <Eye className="h-3 w-3" />
              </Button>

              <Button
                variant="ghost"
                size="xs"
                onClick={() => onEdit(r.data.identity)}
                disabled={!canEdit}
                className="text-primary hover:bg-primary/50 h-6 w-6 p-0 disabled:cursor-not-allowed disabled:opacity-30"
                title={
                  !isMatchingUnitType
                    ? `Can only edit ${selectedUnitLabel} records from this page`
                    : !r.data.isActive
                      ? "Inactive record cannot be edited"
                      : "Edit"
                }
                aria-label={`Edit ${r.data.branchCode}`}
              >
                <Pencil className="h-3 w-3" />
              </Button>

              <Button
                variant="ghost"
                title="Delete"
                aria-label={`Delete ${r.data.branchCode}`}
                className="text-status-error hover:bg-status-error-background h-6 w-6 p-0"
                size="xs"
                onClick={() => openDeleteModal(r.data.identity)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          );
        },
      }),
    ],
    [
      openDeleteModal,
      onEdit,
      selectedUnitLabel,
      categoryOptions,
      rawStatusOptions,
      externalUnitType,
    ]
  );

  const table = useReactTable({
    data: tableRows,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const noDataText = isFetching
    ? "Loading..."
    : selectedUnitType !== ALL_UNIT_TYPES
      ? `No ${selectedUnitLabel} Records Found`
      : "No Records Found";

  const showingFrom = totalDataRows === 0 ? 0 : safePageIndex * PAGE_SIZE + 1;
  const showingTo = Math.min((safePageIndex + 1) * PAGE_SIZE, totalDataRows);

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

      {totalDataRows > 0 && (
        <div className="mt-4 flex items-center justify-between text-sm">
          <div className="text-muted-foreground whitespace-nowrap">
            Showing {showingFrom} to {showingTo} of {totalDataRows} entries
          </div>

          <div className="flex items-center gap-3">
            <Pagination
              currentPage={safePageIndex}
              totalPages={totalPages}
              onPageChange={page => setPageIndex(page)}
              onPreviousPage={() => setPageIndex(p => Math.max(0, p - 1))}
              onNextPage={() =>
                setPageIndex(p => Math.min(totalPages - 1, p + 1))
              }
              canPreviousPage={safePageIndex > 0}
              canNextPage={safePageIndex < totalPages - 1}
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
