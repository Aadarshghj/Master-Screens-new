import React, { useMemo } from "react";
import { Button, CommonTable } from "@/components";
import {
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";
import { useGetMasterBusinessRulesQuery } from "@/global/service/end-points/loan-product-and-scheme/business-rules";
import type {
  BusinessRuleTableData,
  BusinessRulesTableProps,
  MasterBusinessRule,
} from "@/types/loan-product-and schema Stepper/business-rules.types";

const columnHelper = createColumnHelper<BusinessRuleTableData>();

export const BusinessRulesTable: React.FC<BusinessRulesTableProps> = ({
  tableData,
  onEdit,
  onDelete,
}) => {
  const { data: businessRuleOptions = [] } = useGetMasterBusinessRulesQuery(
    ""
  ) as { data: MasterBusinessRule[] };

  // Function to get business rule name from ID
  const getBusinessRuleName = (businessRuleIdentity: string) => {
    const rule = businessRuleOptions.find(
      option => option.value === businessRuleIdentity
    );
    const result = rule?.label || businessRuleIdentity;

    return result;
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor("businessRuleIdentity", {
        header: "Business Rule Name",
        cell: info => (
          <span className="text-xxs font-medium">
            {getBusinessRuleName(info.getValue())}
          </span>
        ),
      }),
      columnHelper.accessor("executionOrder", {
        header: "Execution Order",
        cell: info => (
          <span className="text-xxs font-medium">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("effectiveFrom", {
        header: "Effective From",
        cell: info => (
          <span className="text-xxs font-medium">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("effectiveTo", {
        header: "Effective To",
        cell: info => (
          <span className="text-xxs font-medium">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("isActive", {
        header: "Status",
        cell: info => (
          <span
            className={`text-xxs font-semibold ${
              info.getValue() ? "text-green-600" : "text-gray-500"
            }`}
          >
            {info.getValue() ? "Active" : "Inactive"}
          </span>
        ),
      }),
      columnHelper.display({
        id: "action",
        header: "Action",
        cell: ({ row }) => (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onEdit?.(row.original);
              }}
            >
              <Pencil className="h-4 w-4 text-blue-600" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete?.(row.original)}
            >
              <Trash2 className="h-4 w-4 text-red-600" />
            </Button>
          </div>
        ),
      }),
    ],
    [onEdit, onDelete, getBusinessRuleName]
  );

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  return (
    <div className="w-full rounded-lg border">
      <CommonTable table={table} size="default" />
    </div>
  );
};
