import { useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  createColumnHelper,
} from "@tanstack/react-table";
import type { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button/button";
import { Flex } from "@/components/ui/flex";
import { CommonTable } from "@/components/ui/data-table";
import { HeaderWrapper } from "@/components/ui/header-wrapper/HeaderWrapper";
import { TitleHeader } from "@/components/ui/title-header/TitleHeader";

export interface TableColumnConfig<T> {
  accessorKey: keyof T;
  header: string;
  cell?: (value: T[keyof T], row: T) => React.ReactNode;
}

export interface ActionButtonConfig<T> {
  label: string;
  onClick: (row: T) => void;
  variant?: "link" | "default" | "outline" | "ghost";
  size?: "xs" | "sm" | "md" | "lg" | "compact";
  className?: string;
}

interface DynamicSearchResultsTableProps<T> {
  data: T[];
  columns: TableColumnConfig<T>[];
  actionButton?: ActionButtonConfig<T>;
  title?: string;
  isSearched: boolean;
  noDataText?: string;
  searchPromptText?: string;
}

export function DynamicSearchResultsTable<T extends Record<string, unknown>>({
  data,
  columns,
  actionButton,
  title = "Search Results",
  isSearched,
  noDataText = "No results found",
  searchPromptText = "Please search to view results",
}: DynamicSearchResultsTableProps<T>) {
  const columnHelper = createColumnHelper<T>();

  const tableColumns = useMemo(() => {
    const cols: ColumnDef<T, unknown>[] = columns.map(col =>
      columnHelper.accessor((row: T) => row[col.accessorKey] as unknown, {
        id: String(col.accessorKey),
        header: col.header,
        cell: info => {
          const value = info.getValue();
          const row = info.row.original;

          if (col.cell) {
            return col.cell(value as T[keyof T], row);
          }

          return (
            <span className="text-xs font-medium">
              {value !== null && value !== undefined ? String(value) : "N/A"}
            </span>
          );
        },
      })
    );

    if (actionButton) {
      cols.push(
        columnHelper.display({
          id: "action",
          header: "Action",
          cell: ({ row }) => (
            <Button
              variant={actionButton.variant ?? "link"}
              size={actionButton.size ?? "xs"}
              className={
                actionButton.className ??
                "text-theme-primary hover:text-theme-primary/80 h-auto p-0 text-xs font-normal"
              }
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                actionButton.onClick(row.original);
              }}
            >
              {actionButton.label}
            </Button>
          ),
        })
      );
    }

    return cols;
  }, [columns, actionButton, columnHelper]);

  const table = useReactTable({
    data,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div>
      <Flex justify="between" align="center" className="mb-3">
        <HeaderWrapper>
          <TitleHeader title={title} />
        </HeaderWrapper>
      </Flex>

      <CommonTable
        table={table}
        size="default"
        noDataText={isSearched ? noDataText : searchPromptText}
      />
    </div>
  );
}
