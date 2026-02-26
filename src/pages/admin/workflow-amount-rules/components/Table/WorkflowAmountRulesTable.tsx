import React, { useMemo, useState } from "react";
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
  PaginationEllipsis,
} from "@/components";
import {
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type {
  WorkflowAmountRulesRow,
  WorkflowAmountRulesTableProps,
} from "@/types/admin/amountrules";
import { WorkflowAmountRulesFilterBar } from "../Filter/WorkFlowAmountRulesFilter";
import { useGetWorkflowDefinitionsQuery } from "@/global/service/end-points/workflow/workflow-master-api";

const columnHelper = createColumnHelper<WorkflowAmountRulesRow>();

export const WorkflowAmountRulesTable: React.FC<
  WorkflowAmountRulesTableProps
> = ({ data, onEdit, onDelete }) => {
  const [selectedWorkflow, setSelectedWorkflow] = useState<string>("All");

  const filteredData = useMemo(() => {
    if (selectedWorkflow === "All") return data;
    return data.filter(item => item.workflow === selectedWorkflow);
  }, [data, selectedWorkflow]);

  const { data: workflowData = [] } = useGetWorkflowDefinitionsQuery();

  const workflowOptions = workflowData.map(item => ({
    label: item.workflowName,
    value: item.identity,
  }));
  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "serialNo",
        header: "S.No",
        cell: ({ row }) => row.index + 1,
      }),

      columnHelper.accessor("workflow", {
        header: "Workflow",
        cell: info => (
          <span className="text-foreground font-medium">{info.getValue()}</span>
        ),
      }),

      columnHelper.accessor("fromAmount", {
        header: "From Amount",
      }),

      columnHelper.accessor("toAmount", {
        header: "To Amount",
      }),

      columnHelper.accessor("amountOn", {
        header: "Amount On",
        cell: info => info.getValue().toUpperCase(),
      }),

      columnHelper.accessor("approvalFlow", {
        header: "Approval Flow",
        cell: info => info.getValue().replace(/_/g, " "),
      }),

      columnHelper.accessor("isActive", {
        header: "Status",
        cell: info => (
          <span
            className={`text-xs font-medium ${
              info.getValue() ? "text-green-600" : "text-muted-foreground"
            }`}
          >
            {info.getValue() ? "Active" : "Inactive"}
          </span>
        ),
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
              <Edit className="h-4 w-4 text-blue-500" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="text-destructive"
              onClick={() => onDelete(row.original.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ),
      }),
    ],
    [onEdit, onDelete]
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 5,
      },
    },
  });

  return (
    <div className="mt-11">
      <div className="flex items-center justify-between">
        <TitleHeader title="Saved Rules" />
      </div>

      <div className="mt-4">
        <WorkflowAmountRulesFilterBar
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
                    onClick={() => table.previousPage()}
                    className={`text-muted-foreground hover:text-foreground text-xs ${
                      !table.getCanPreviousPage()
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }`}
                  />
                </PaginationItem>

                {Array.from(
                  { length: table.getPageCount() },
                  (_, i) => i + 1
                ).map(page => {
                  const totalPages = table.getPageCount();
                  const currentPage = table.getState().pagination.pageIndex + 1;

                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1) ||
                    (currentPage <= 3 && page <= 3) ||
                    (currentPage >= totalPages - 2 && page >= totalPages - 2)
                  ) {
                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => table.setPageIndex(page - 1)}
                          isActive={currentPage === page}
                          className={`text-foreground hover:text-primary cursor-pointer text-xs ${
                            currentPage === page
                              ? "border-border bg-muted rounded-md border shadow-sm"
                              : ""
                          }`}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  }

                  if (page === currentPage - 2 || page === currentPage + 2) {
                    return (
                      <PaginationItem key={page}>
                        <PaginationEllipsis className="text-muted-foreground text-xs" />
                      </PaginationItem>
                    );
                  }

                  return null;
                })}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => table.nextPage()}
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
