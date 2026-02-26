// File: src/components/approval-workflow/user-leave-status/hooks/useLeaveStatusTableColumns.tsx

import { useMemo } from "react";
import type { TableColumnConfig } from "@/components/filterDataView/DynamicSearchResultsTable";
import type { ImportDetailsData } from "@/types/approval-workflow/user-leave-status.types";

export function useLeaveStatusTableColumns(type: "success" | "error") {
  const successColumns: TableColumnConfig<ImportDetailsData>[] = useMemo(
    () => [
      {
        accessorKey: "siNo",
        header: "SI No",
        cell: value => (
          <span className="text-xs font-medium">{String(value)}</span>
        ),
      },
      {
        accessorKey: "branchCode",
        header: "Branch Code",
        cell: value => <span className="text-xs">{String(value)}</span>,
      },
      {
        accessorKey: "userCode",
        header: "User Code",
        cell: value => <span className="text-xs">{String(value)}</span>,
      },
      {
        accessorKey: "leaveFrom",
        header: "Leave From",
        cell: value => <span className="text-xs">{String(value)}</span>,
      },
      {
        accessorKey: "leaveTo",
        header: "Leave To",
        cell: value => <span className="text-xs">{String(value)}</span>,
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: value => <span className="text-xs">{String(value)}</span>,
      },
      {
        accessorKey: "delegatedUserCode",
        header: "Delegated User",
        cell: value => <span className="text-xs">{String(value)}</span>,
      },
      {
        accessorKey: "remark",
        header: "Remark",
        cell: value => <span className="text-xs">{String(value)}</span>,
      },
      {
        accessorKey: "errorMessage",
        header: "Error Details",
        cell: () => <span className="text-xs">No error</span>,
      },
    ],
    []
  );

  const errorColumns: TableColumnConfig<ImportDetailsData>[] = useMemo(
    () => [
      {
        accessorKey: "rowNumber",
        header: "Row No",
        cell: value => (
          <span className="text-xs font-medium">{String(value)}</span>
        ),
      },
      {
        accessorKey: "branchCode",
        header: "Branch Code",
        cell: value => <span className="text-xs">{String(value)}</span>,
      },
      {
        accessorKey: "userCode",
        header: "User Code",
        cell: value => <span className="text-xs">{String(value)}</span>,
      },
      {
        accessorKey: "leaveFrom",
        header: "Leave From",
        cell: value => <span className="text-xs">{String(value)}</span>,
      },
      {
        accessorKey: "leaveTo",
        header: "Leave To",
        cell: value => <span className="text-xs">{String(value)}</span>,
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: value => <span className="text-xs">{String(value)}</span>,
      },
      {
        accessorKey: "delegatedUserCode",
        header: "Delegated User",
        cell: value => <span className="text-xs">{String(value)}</span>,
      },
      {
        accessorKey: "remark",
        header: "Remark",
        cell: value => <span className="text-xs">{String(value)}</span>,
      },
      {
        accessorKey: "errorMessage",
        header: "Error Details",
        cell: value => <span className="text-xs">{String(value)}</span>,
      },
    ],
    []
  );

  return type === "success" ? successColumns : errorColumns;
}
