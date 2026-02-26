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
import type { LoanSchemePropertyData } from "@/types/loan-product-and-scheme-masters/loan-scheme-properties.types";

interface LoanSchemePropertiesTableProps {
  properties: LoanSchemePropertyData[];
  onEdit: (property: LoanSchemePropertyData) => void;
  onDelete: (property: LoanSchemePropertyData) => void;
  isLoading?: boolean;
  isSearched: boolean;
  loanProductOptions: Array<{
    value: string;
    label: string;
    identity?: string;
  }>;
  dataTypeOptions: Array<{ value: string; label: string; identity?: string }>;
  deletingPropertyId?: string | null;
}

const columnHelper = createColumnHelper<LoanSchemePropertyData>();

export const LoanSchemePropertiesTable: React.FC<
  LoanSchemePropertiesTableProps
> = ({
  properties,
  onEdit,
  onDelete,
  isLoading = false,
  isSearched,
  loanProductOptions,
  dataTypeOptions,
  deletingPropertyId,
}) => {
  const getLoanProductName = (productId: string) => {
    if (!loanProductOptions || loanProductOptions.length === 0) {
      return "—";
    }
    const product = loanProductOptions.find(
      opt => opt.identity === productId || opt.value === productId
    );
    return product?.label || "—";
  };

  const getDataTypeName = (dataTypeId: string) => {
    if (!dataTypeOptions || dataTypeOptions.length === 0) {
      return "—";
    }
    const dataType = dataTypeOptions.find(
      opt => opt.identity === dataTypeId || opt.value === dataTypeId
    );
    return dataType?.label || "—";
  };
  const columns = useMemo(
    () => [
      columnHelper.accessor("productId", {
        header: "Loan Product",
        cell: info => (
          <span className="text-xs font-medium">
            {getLoanProductName(info.getValue() as string)}
          </span>
        ),
      }),
      columnHelper.accessor("propertyKey", {
        header: "Property Key",
        cell: info => <span className="text-xs">{info.getValue()}</span>,
      }),
      columnHelper.accessor("propertyName", {
        header: "Property Name",
        cell: info => <span className="text-xs">{info.getValue()}</span>,
      }),

      columnHelper.accessor("dataTypeId", {
        header: "Data Type",
        cell: info => (
          <span className="text-xs">
            {getDataTypeName(info.getValue() as string)}
          </span>
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
      columnHelper.accessor("isRequired", {
        header: "Required",
        cell: info => (
          <span className={`text-xs font-medium ${info.getValue()}`}>
            {info.getValue() ? "Required" : "Not Required"}
          </span>
        ),
      }),
      columnHelper.accessor("statusName", {
        header: "Status",
        cell: info => (
          <span
            className={`text-xs font-medium ${
              String(info.getValue()) === "ACTIVE"
                ? "text-green-600"
                : "text-gray-600"
            }`}
          >
            {String(info.getValue())}
          </span>
        ),
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const property = row.original;
          const propertyId =
            property.propertyId ||
            (property as LoanSchemePropertyData & { identity?: string })
              .identity;
          const isDeleting = deletingPropertyId === propertyId;
          return (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="xs"
                onClick={() => onEdit(property)}
                disabled={isDeleting}
                className="text-primary hover:bg-primary/50 h-6 w-6 p-0"
                title="Edit property"
              >
                <Pencil className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="xs"
                onClick={() => onDelete(property)}
                disabled={isDeleting}
                className="text-status-error hover:bg-status-error-background h-6 w-6 p-0"
                title="Delete property"
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
    [onEdit, onDelete, deletingPropertyId, loanProductOptions, dataTypeOptions]
  );

  const table = useReactTable({
    data: properties,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const getNoDataText = () => {
    if (isLoading) {
      return "Loading loan scheme properties...";
    }
    if (!isSearched) {
      return "Please filter to view results";
    }
    return "No loan scheme properties found";
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
      </Grid>
    </article>
  );
};
