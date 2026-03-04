import React, { useMemo } from "react";
import { Edit, Trash2 } from "lucide-react";
import {
  CommonTable,
  Grid,
  TitleHeader,
  Button,
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationNext,
  Flex,
} from "@/components";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { StagesSetupFilterBar } from "../Filter/StageSetupFilter";
import type {
  StagesSetupTableProps,
  WorkflowStageRow,
} from "@/types/admin/workflow-stages";
import { useStagesSetupTable } from "../hooks/useWorkflowStagesTable";

const columnHelper = createColumnHelper<WorkflowStageRow>();

export const StagesSetupTable: React.FC<StagesSetupTableProps> = ({
  data,
  pageIndex,
  totalPages,
  onPageChange,
  onEdit,
  onDelete,
}) => {
  const {
    filteredData,
    selectedWorkflow,
    setSelectedWorkflow,
    workflowOptions,
    getWorkflowName,
    getRoleName,
  } = useStagesSetupTable(data);

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "serialNo",
        header: "S.No",
        cell: ({ row }) => row.index + 1,
      }),

      columnHelper.accessor("workflowIdentity", {
        header: "Workflow",
        cell: info => getWorkflowName(info.getValue()),
      }),

      columnHelper.accessor("levelOrder", {
        header: "Level Order",
      }),

      columnHelper.accessor("levelName", {
        header: "Level Name",
        cell: info => <span className="uppercase">{info.getValue()}</span>,
      }),

      columnHelper.accessor("assignedRoleIdentity", {
        header: "Assigned to Role",
        cell: info => getRoleName(info.getValue()),
      }),

      columnHelper.accessor("isFinalLevel", {
        header: "Final Level",
        cell: info => (info.getValue() ? "Yes" : "No"),
      }),

      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="xs"
              onClick={() => onEdit(row.original)}
            >
              <Edit className="h-4 w-4 text-blue-300" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="text-destructive"
              onClick={() => onDelete(row.original.workflowStageIdentity)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ),
      }),
    ],
    [onEdit, onDelete, getWorkflowName, getRoleName]
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: totalPages,
    state: {
      pagination: {
        pageIndex,
        pageSize: 5,
      },
    },
  });

  return (
    <div className="mt-11">
      <div className="flex items-center justify-between">
        <TitleHeader title="Saved Stages" />
      </div>

      <div className="mt-4">
        <StagesSetupFilterBar
          workflowOptions={workflowOptions}
          selectedWorkflow={selectedWorkflow}
          onFilterApply={setSelectedWorkflow}
        />
      </div>

      <div className="mt-8">
        <Grid>
          <Grid.Item>
            <CommonTable
              table={table}
              size="default"
              noDataText="No records found"
              className="bg-card"
            />
          </Grid.Item>
        </Grid>
      </div>

      <Flex justify="end" gap={3} className="mt-4">
        {table.getRowModel().rows.length > 0 && (
          <div className="mt-4 flex justify-end">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => onPageChange(pageIndex - 1)}
                    className={`text-muted-foreground hover:text-foreground text-xs ${
                      !table.getCanPreviousPage()
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }`}
                  />
                </PaginationItem>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  page => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => onPageChange(page - 1)}
                        isActive={pageIndex + 1 === page}
                        className="text-foreground hover:text-primary cursor-pointer text-xs"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => onPageChange(pageIndex + 1)}
                    className={`text-muted-foreground hover:text-primary text-xs ${
                      !table.getCanNextPage()
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }`}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </Flex>
    </div>
  );
};
