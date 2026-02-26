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
import { Pagination } from "@/components/ui/paginationUp";
import type { LoanBusinessRuleData } from "@/types/loan-product-and-scheme-masters/business-rules.types";

interface LoanBusinessRulesTableProps {
  rules: LoanBusinessRuleData[];
  onEdit: (rule: LoanBusinessRuleData) => void;
  onDelete: (rule: LoanBusinessRuleData) => void;
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

  deletingRuleId?: string | null;
}

const columnHelper = createColumnHelper<LoanBusinessRuleData>();

export const LoanBusinessRulesTable: React.FC<LoanBusinessRulesTableProps> = ({
  rules,
  onEdit,
  onDelete,
  isLoading = false,
  isSearched,
  currentPage,
  totalPages,
  totalElements,
  onPageChange,
  loanProductOptions,
  deletingRuleId,
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

  const columns = useMemo(
    () => [
      columnHelper.accessor("productIdentity", {
        header: "Loan Product",
        cell: info => (
          <span className="text-xs font-medium">
            {getLoanProductName(info.getValue() as string)}
          </span>
        ),
      }),
      columnHelper.accessor("ruleCode", {
        header: "Rule Code",
        cell: info => <span className="text-xs">{info.getValue()}</span>,
      }),
      columnHelper.accessor("ruleName", {
        header: "Rule Name",
        cell: info => <span className="text-xs">{info.getValue()}</span>,
      }),
      columnHelper.accessor("ruleCategoryName", {
        header: "Rule Category",
        cell: info => <span className="text-xs">{info.getValue()}</span>,
      }),
      columnHelper.accessor("conditionExpression", {
        header: "Condition Expression",
        cell: info => (
          <span
            className="block max-w-xs truncate text-xs"
            title={info.getValue()}
          >
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor("actionExpression", {
        header: "Action Expression",
        cell: info => (
          <span
            className="block max-w-xs truncate text-xs"
            title={info.getValue()}
          >
            {info.getValue()}
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
        header: "Action",
        cell: ({ row }) => {
          const rule = row.original;
          const ruleId =
            rule.ruleId ||
            (rule as LoanBusinessRuleData & { identity?: string }).identity;
          const isDeleting = deletingRuleId === ruleId;
          return (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="xs"
                onClick={() => onEdit(rule)}
                disabled={isDeleting}
                className="text-primary hover:bg-primary/50 h-6 w-6 p-0"
                title="Edit rule"
              >
                <Pencil className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="xs"
                onClick={() => onDelete(rule)}
                disabled={isDeleting}
                className="text-status-error hover:bg-status-error-background h-6 w-6 p-0"
                title="Delete rule"
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
    [onEdit, onDelete, deletingRuleId, loanProductOptions]
  );

  const table = useReactTable({
    data: rules,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const getNoDataText = () => {
    if (isLoading) {
      return "Loading business rules...";
    }
    if (!isSearched) {
      return "Please filter to view results";
    }
    return "No business rules found";
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
        {rules.length > 0 && totalPages > 0 && (
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
