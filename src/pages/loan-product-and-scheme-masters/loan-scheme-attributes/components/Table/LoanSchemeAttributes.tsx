import React, { useMemo } from "react";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { CommonTable } from "@/components/ui/data-table";
import { Grid } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import type { LoanSchemeAttributeData } from "@/types/loan-product-and-scheme-masters/loan-scheme-attributes.types";
import { Pagination } from "@/components/ui/paginationUp";

interface LoanSchemeAttributesTableProps {
  attributes: LoanSchemeAttributeData[];
  onEdit: (attribute: LoanSchemeAttributeData) => void;
  onDelete: (attribute: LoanSchemeAttributeData) => void;
  isLoading?: boolean;
  isSearched: boolean;
  currentPage: number;
  totalPages: number;
  totalElements: number;
  onPageChange: (page: number) => void;
  loanProductOptions: Array<{
    value: string;
    label: string;
    identity?: string;
  }>;
  dataTypeOptions: Array<{ value: string; label: string; identity?: string }>;
  deletingAttributeId?: string | null;
}

const columnHelper = createColumnHelper<LoanSchemeAttributeData>();

export const LoanSchemeAttributesTable: React.FC<
  LoanSchemeAttributesTableProps
> = ({
  attributes,
  onEdit,
  onDelete,
  isLoading = false,
  isSearched,
  currentPage,
  totalPages,
  totalElements,
  onPageChange,
  loanProductOptions,
  dataTypeOptions,
  deletingAttributeId,
}) => {
  const getLoanProductName = (productIdentity: string) => {
    if (!loanProductOptions || loanProductOptions.length === 0) {
      return "—";
    }
    const product = loanProductOptions.find(
      opt => opt.identity === productIdentity || opt.value === productIdentity
    );
    return product?.label || "—";
  };

  const getDataTypeName = (dataTypeIdentity: string) => {
    if (!dataTypeOptions || dataTypeOptions.length === 0) {
      return "—";
    }
    const dataType = dataTypeOptions.find(
      opt => opt.identity === dataTypeIdentity || opt.value === dataTypeIdentity
    );
    return dataType?.label || "—";
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor("productIdentity", {
        header: "Loan Product",
        cell: info => (
          <span className="text-xs font-medium">
            {getLoanProductName(String(info.getValue()))}
          </span>
        ),
      }),
      columnHelper.accessor("attributeKey", {
        header: "Attribute Key",
        cell: info => <span className="text-xs">{info.getValue()}</span>,
      }),
      columnHelper.accessor("attributeName", {
        header: "Attribute Name",
        cell: info => <span className="text-xs">{info.getValue()}</span>,
      }),

      columnHelper.accessor("dataType", {
        header: "Data Type",
        cell: info => (
          <span className="text-xs">{getDataTypeName(info.getValue())}</span>
        ),
      }),
      columnHelper.accessor("defaultValue", {
        header: "Default Value",
        cell: info => (
          <span className="text-xs">
            {info.getValue() ? String(info.getValue()) : "—"}
          </span>
        ),
      }),
      columnHelper.accessor("description", {
        header: "Description",
        cell: info => (
          <span className="text-xs">
            {info.getValue() ? String(info.getValue()) : "—"}
          </span>
        ),
      }),

      columnHelper.accessor("active", {
        header: "Status",
        cell: info => {
          const isActive = Boolean(info.getValue());
          return (
            <span
              className={`text-xs font-medium ${
                isActive ? "text-green-600" : "text-gray-600"
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
          const attribute = row.original;

          const attributeId =
            attribute.attributeId ||
            (attribute as LoanSchemeAttributeData & { identity?: string })
              .identity;

          const isDeleting = deletingAttributeId === attributeId;
          return (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="xs"
                onClick={() => onEdit(attribute)}
                disabled={isDeleting}
                className="text-primary hover:bg-primary/50 h-6 w-6 p-0"
                title="Edit attribute"
              >
                <Pencil className="h-3 w-3" />
              </Button>

              <Button
                variant="ghost"
                size="xs"
                onClick={() => onDelete(attribute)}
                disabled={isDeleting}
                className="text-status-error hover:bg-status-error-background h-6 w-6 p-0"
                title="Delete attribute"
              >
                {isDeleting ? (
                  <div className="border-status-error h-3 w-3 animate-spin rounded-full border-b"></div>
                ) : (
                  <Trash2 className="h-3 w-3" />
                )}
              </Button>
            </div>
          );
        },
      }),
    ],
    [onEdit, onDelete, deletingAttributeId, loanProductOptions, dataTypeOptions]
  );

  const table = useReactTable({
    data: attributes,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const getNoDataText = () => {
    if (isLoading) {
      return "Loading loan scheme attributes...";
    }
    if (!isSearched) {
      return "Please filter to view results";
    }
    return "No loan scheme attributes found";
  };

  return (
    <article className="mt-4">
      <Grid>
        <Grid.Item>
          <CommonTable
            table={table}
            size="default"
            noDataText={getNoDataText()}
            className="bg-card"
          />
        </Grid.Item>
        {attributes.length > 0 && totalPages > 0 && (
          <Grid.Item className="mt-4">
            <div className="flex items-center justify-between text-sm">
              <div className="text-muted-foreground whitespace-nowrap">
                Showing {currentPage * 10 + 1} to{" "}
                {Math.min((currentPage + 1) * 10, totalElements)} of{" "}
                {totalElements} entries
              </div>
              <div className="flex items-center gap-3">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={onPageChange}
                  onPreviousPage={() => {
                    if (currentPage > 0) {
                      onPageChange(currentPage - 1);
                    }
                  }}
                  onNextPage={() => {
                    if (currentPage < totalPages - 1) {
                      onPageChange(currentPage + 1);
                    }
                  }}
                  canPreviousPage={currentPage > 0}
                  canNextPage={currentPage < totalPages - 1}
                  maxVisiblePages={5}
                />
              </div>
            </div>
          </Grid.Item>
        )}
      </Grid>
    </article>
  );
};
