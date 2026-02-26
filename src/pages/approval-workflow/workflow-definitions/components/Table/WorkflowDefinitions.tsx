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
import type {
  ModuleConfigOption,
  WorkflowDefinitionData,
} from "@/types/approval-workflow/workflow-definitions.types";

interface WorkflowDefinitionsTableProps {
  definitions: WorkflowDefinitionData[];
  onEdit: (definition: WorkflowDefinitionData) => void;
  onDelete: (definition: WorkflowDefinitionData) => void;
  isLoading?: boolean;
  isSearched: boolean;
  currentPage: number;
  totalPages: number;
  totalElements: number;
  onPageChange: (page: number) => void;

  moduleOptions: ModuleConfigOption[];
  deletingDefinitionId?: string | null;
}

const columnHelper = createColumnHelper<WorkflowDefinitionData>();

export const WorkflowDefinitionsTable: React.FC<
  WorkflowDefinitionsTableProps
> = ({
  definitions,
  onEdit,
  onDelete,
  isLoading = false,
  isSearched,
  currentPage,
  totalPages,
  totalElements,
  onPageChange,
  moduleOptions,
  deletingDefinitionId,
}) => {
  const getModuleName = (moduleIdentity: string) => {
    if (!moduleOptions || moduleOptions.length === 0) {
      return "—";
    }
    const module = moduleOptions.find(
      opt => opt.identity === moduleIdentity || opt.value === moduleIdentity
    );
    return module?.label || "—";
  };

  const getSubModuleName = (
    moduleIdentity: string | undefined,
    subModuleIdentity: string | undefined
  ) => {
    if (
      !moduleIdentity ||
      !subModuleIdentity ||
      !moduleOptions ||
      moduleOptions.length === 0
    ) {
      return "—";
    }

    const module = moduleOptions.find(
      opt => opt.identity === moduleIdentity || opt.value === moduleIdentity
    );

    if (!module?.subModules) return "—";

    const subModule = module.subModules.find(
      sub => sub.identity === subModuleIdentity
    );

    return subModule?.subModuleName || "—";
  };
  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "slNo",
        header: "S.No",
        cell: ({ row }) => (
          <span className="text-xs font-medium">
            {currentPage * 10 + row.index + 1}
          </span>
        ),
      }),
      columnHelper.accessor("moduleIdentity", {
        header: "Module",
        cell: info => (
          <span className="text-xs font-medium">
            {getModuleName(info.getValue() as string)}
          </span>
        ),
      }),

      columnHelper.accessor("subModuleName", {
        header: "Sub Module",
        cell: info => {
          const row = info.row.original;
          const subModuleName = getSubModuleName(
            row.moduleIdentity,
            row.subModuleIdentity
          );
          return <span className="text-xs">{subModuleName}</span>;
        },
      }),
      columnHelper.accessor("workflowName", {
        header: "Workflow Name",
        cell: info => <span className="text-xs">{info.getValue()}</span>,
      }),
      columnHelper.accessor("description", {
        header: "Description",
        cell: info => (
          <span
            className="block max-w-xs truncate text-xs"
            title={info.getValue() || ""}
          >
            {info.getValue() || "—"}
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
          const definition = row.original;
          const definitionId =
            definition.definitionId ||
            (definition as WorkflowDefinitionData & { identity?: string })
              .identity;
          const isDeleting = deletingDefinitionId === definitionId;
          return (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="xs"
                onClick={() => onEdit(definition)}
                disabled={isDeleting}
                className="text-primary hover:bg-primary/50 h-6 w-6 p-0"
                title="Edit definition"
              >
                <Pencil className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="xs"
                onClick={() => onDelete(definition)}
                disabled={isDeleting}
                className="text-status-error hover:bg-status-error-background h-6 w-6 p-0"
                title="Delete definition"
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
    [onEdit, onDelete, deletingDefinitionId, moduleOptions, currentPage]
  );

  const table = useReactTable({
    data: definitions,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const getNoDataText = () => {
    if (isLoading) {
      return "Loading workflow definitions...";
    }
    if (!isSearched) {
      return "Please filter to view results";
    }
    return "No workflow definitions found";
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
        {definitions.length > 0 && totalPages > 0 && (
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
