// components/WorkflowAmount/Table/WorkflowAmountTable.tsx

import React, { useMemo } from "react";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { CommonTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/paginationUp";
import { Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type {
  WorkflowAmountRule,
  OptionType,
} from "@/types/approval-workflow/workflow-amount.types";

interface WorkflowAmountTableProps {
  rules: WorkflowAmountRule[];
  isLoading?: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalElements: number;
  onEdit: (rule: WorkflowAmountRule) => void;
  onDelete: (identity: string) => void;
  workflowOptions: OptionType[];
  approvalFlowOptions: OptionType[];
  amountOnOptions: OptionType[];
}

const columnHelper = createColumnHelper<WorkflowAmountRule>();

export const WorkflowAmountTable: React.FC<WorkflowAmountTableProps> = ({
  rules,

  currentPage,
  totalPages,
  onPageChange,
  totalElements,
  onEdit,
  onDelete,
  workflowOptions,
  approvalFlowOptions,
  amountOnOptions,
}) => {
  const getWorkflowName = (workflowId: string) => {
    const workflow = workflowOptions.find(opt => opt.value === workflowId);
    return workflow?.label || workflowId;
  };

  const getApprovalFlowName = (flowId: string) => {
    const flow = approvalFlowOptions.find(opt => opt.value === flowId);
    return flow?.label || flowId;
  };

  const getAmountOnName = (amountOnId: string) => {
    const amountOn = amountOnOptions.find(opt => opt.value === amountOnId);
    return amountOn?.label || amountOnId;
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "sNo",
        header: "S.No",
        cell: ({ row }) => (
          <span className="text-foreground font-medium">
            {currentPage * 10 + row.index + 1}
          </span>
        ),
      }),
      columnHelper.accessor("workflowIdentity", {
        header: "Workflow",
        cell: info => (
          <span className="text-foreground font-medium">
            {getWorkflowName(info.getValue())}
          </span>
        ),
      }),
      columnHelper.accessor("fromAmount", {
        header: "From Amount",
        cell: info => (
          <span className="text-foreground">
            {formatAmount(info.getValue())}
          </span>
        ),
      }),
      columnHelper.accessor("toAmount", {
        header: "To Amount",
        cell: info => (
          <span className="text-foreground">
            {formatAmount(info.getValue())}
          </span>
        ),
      }),
      columnHelper.accessor("amountOn", {
        header: "Amount on",
        cell: info => (
          <span className="text-foreground">
            {getAmountOnName(info.getValue())}
          </span>
        ),
      }),
      columnHelper.accessor("approvalFlow", {
        header: "Approval Flow",
        cell: info => {
          const flows = info.getValue();
          if (Array.isArray(flows)) {
            return (
              <div className="flex flex-wrap gap-1">
                {flows.map((flowId, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {getApprovalFlowName(flowId)}
                  </Badge>
                ))}
              </div>
            );
          }
          return (
            <span className="text-foreground">
              {getApprovalFlowName(flows)}
            </span>
          );
        },
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: info => (
          <Badge
            variant={
              info.getValue()?.toUpperCase() === "ACTIVE"
                ? "default"
                : "secondary"
            }
          >
            {info.getValue()?.toUpperCase() || "ACTIVE"}
          </Badge>
        ),
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="xs"
              onClick={() => onEdit(row.original)}
              className="text-blue-600 hover:bg-blue-50 hover:text-blue-700"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="xs"
              onClick={() => {
                const ruleId =
                  row.original.workflowAmountRuleIdentity ||
                  (
                    row.original as WorkflowAmountRule & {
                      identity?: string;
                      id?: string;
                    }
                  ).identity ||
                  (
                    row.original as WorkflowAmountRule & {
                      identity?: string;
                      id?: string;
                    }
                  ).id;
                console.log("Delete button clicked for rule:", row.original);
                console.log("Rule ID for delete:", ruleId);
                onDelete(ruleId!);
              }}
              className="text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ),
      }),
    ],
    [currentPage, onEdit, onDelete, workflowOptions, approvalFlowOptions]
  );

  const table = useReactTable({
    data: rules,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  });

  return (
    <div className="space-y-4">
      <CommonTable
        table={table}
        size="default"
        noDataText="No workflow amount rules found. Please add a new rule."
        className="bg-card"
      />

      {rules.length > 0 && totalPages > 0 && (
        <div className="flex items-center justify-between text-sm">
          <div className="text-muted-foreground whitespace-nowrap">
            Showing {currentPage * 10 + 1} to{" "}
            {Math.min((currentPage + 1) * 10, totalElements)} of {totalElements}{" "}
            entries
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
      )}
    </div>
  );
};
