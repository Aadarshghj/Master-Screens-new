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
import type { WorkflowActionData } from "@/types/approval-workflow/workflow-actions.types";
import { useGetWorkflowActionQuery } from "@/global/service/end-points/approval-workflow/workflow-definitions";

interface WorkflowActionsTableProps {
  actions: WorkflowActionData[];
  onEdit: (action: WorkflowActionData) => void;
  onDelete: (action: WorkflowActionData) => void;
  isLoading?: boolean;
  isSearched: boolean;
  currentPage: number;
  totalPages: number;
  totalElements: number;
  onPageChange: (page: number) => void;
  workflowOptions: Array<{
    value: string;
    label: string;
    identity?: string;
  }>;
  deletingActionId?: string | null;
}

const columnHelper = createColumnHelper<WorkflowActionData>();

export const WorkflowActionsTable: React.FC<WorkflowActionsTableProps> = ({
  actions,
  onEdit,
  onDelete,
  isLoading = false,
  isSearched,
  currentPage,
  totalPages,
  totalElements,
  onPageChange,
  workflowOptions,
  deletingActionId,
}) => {
  const { data: workflowActionOptions = [] } = useGetWorkflowActionQuery();

  const getWorkflowName = (workflowIdentity: string) => {
    if (!workflowOptions || workflowOptions.length === 0) {
      return "—";
    }
    const workflow = workflowOptions.find(
      opt => opt.identity === workflowIdentity || opt.value === workflowIdentity
    );
    return workflow?.label || "—";
  };

  const getWorkflowActionName = (workflowActionIdentity: string) => {
    console.log("workflowActionOptions```", workflowActionOptions);
    console.log("workflowActionIdentity```", workflowActionIdentity);

    if (!workflowActionOptions || workflowActionOptions.length === 0) {
      return "—";
    }
    const workflow = workflowActionOptions.find(
      opt => opt.value === workflowActionIdentity
    );
    return workflow?.label || "—";
  };

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "serialNumber",
        header: "SI No",
        cell: info => (
          <span className="text-xs font-medium">
            {currentPage * 10 + info.row.index + 1}
          </span>
        ),
      }),
      columnHelper.accessor("workflowIdentity", {
        header: "Workflow",
        cell: info => (
          <span className="text-xs font-medium">
            {getWorkflowName(info.getValue() as string)}
          </span>
        ),
      }),
      columnHelper.accessor("linkedStageName", {
        header: "Linked Stage",
        cell: info => <span className="text-xs">{info.getValue()}</span>,
      }),
      columnHelper.accessor("actionName", {
        header: "Action Name",
        cell: info => (
          <span className="text-xs">
            {" "}
            {getWorkflowActionName(info.getValue() as string)}
          </span>
        ),
      }),
      columnHelper.accessor("nextLevelStageName", {
        header: "Next Level",
        cell: info => <span className="text-xs">{info.getValue()}</span>,
      }),
      columnHelper.accessor("terminalAction", {
        header: "Terminal Actions",
        cell: info => {
          const isTerminal = Boolean(info.getValue());
          return (
            <span
              className={`text-xs font-medium ${
                isTerminal ? "text-green-600" : "text-gray-600"
              }`}
            >
              {isTerminal ? "YES" : "NO"}
            </span>
          );
        },
      }),
      columnHelper.display({
        id: "actions",
        header: "Action",
        cell: ({ row }) => {
          const action = row.original;
          const actionId =
            action.actionId ||
            (action as WorkflowActionData & { identity?: string }).identity;
          const isDeleting = deletingActionId === actionId;
          return (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="xs"
                onClick={() => onEdit(action)}
                disabled={isDeleting}
                className="text-primary hover:bg-primary/50 h-6 w-6 p-0"
                title="Edit action"
              >
                <Pencil className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="xs"
                onClick={() => onDelete(action)}
                disabled={isDeleting}
                className="text-status-error hover:bg-status-error-background h-6 w-6 p-0"
                title="Delete action"
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
    [onEdit, onDelete, deletingActionId, workflowOptions, currentPage]
  );

  const table = useReactTable({
    data: actions,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const getNoDataText = () => {
    if (isLoading) {
      return "Loading workflow actions...";
    }
    if (!isSearched) {
      return "Please filter to view results";
    }
    return "No workflow actions found";
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
        {actions.length > 0 && totalPages > 0 && (
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
