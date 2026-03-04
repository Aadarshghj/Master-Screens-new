import React, { useMemo } from "react";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { CommonTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";

import { Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type {
  WorkflowStage,
  WorkflowStagesTableProps,
} from "@/types/approval-workflow/workflow-stagesetup";
import {
  ITEMS_PER_PAGE,
  TABLE_TEXTS,
  BADGE_TEXTS,
} from "../../constants/form.constants";

const columnHelper = createColumnHelper<WorkflowStage>();

export const WorkflowStagesTable: React.FC<WorkflowStagesTableProps> = ({
  stages,

  currentPage,

  onEdit,
  onDelete,
  workflowOptions,
  roleOptions,
}) => {
  const getWorkflowName = (workflowId: string | undefined) => {
    if (!workflowId) return "";
    const workflow = workflowOptions.find(opt => opt.value === workflowId);
    return workflow?.label || workflowId;
  };

  const getRoleName = (roleId: string | undefined) => {
    if (!roleId) return "";
    const role = roleOptions.find(opt => opt.value === roleId);
    return role?.label || roleId;
  };

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "sNo",
        header: "S.No",
        cell: ({ row }) => (
          <span className="text-foreground font-medium">
            {currentPage * ITEMS_PER_PAGE + row.index + 1}
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
      columnHelper.accessor("levelOrder", {
        header: "Level Order",
        cell: info => (
          <span className="text-foreground">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("levelName", {
        header: "Level Name",
        cell: info => (
          <span className="text-foreground">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("assignedRoleIdentity", {
        header: "Assigned to Role",
        cell: info => (
          <span className="text-foreground">
            {getRoleName(info.getValue())}
          </span>
        ),
      }),
      columnHelper.accessor("isFinalLevel", {
        header: "Final Level",
        cell: info => (
          <Badge variant={info.getValue() ? "default" : "secondary"}>
            {info.getValue() ? BADGE_TEXTS.TRUE : BADGE_TEXTS.FALSE}
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
              onClick={() => onDelete(row.original)}
              className="text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ),
      }),
    ],
    [currentPage, onEdit, onDelete, workflowOptions, roleOptions]
  );

  const table = useReactTable({
    data: stages,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  });

  return (
    <div className="space-y-4">
      <CommonTable
        table={table}
        size="default"
        noDataText={TABLE_TEXTS.NO_DATA}
        className="bg-card"
      />
    </div>
  );
};
