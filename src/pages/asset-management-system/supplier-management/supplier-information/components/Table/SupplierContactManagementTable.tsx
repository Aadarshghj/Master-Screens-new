import React, { useMemo } from "react";
import { Grid, CommonTable, Button } from "@/components";
// import { Pagination } from "@/components/ui/paginationUp";

import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { SquarePen, Trash2 } from "lucide-react";

import { useSupplierContactManagementTable } from "../Hooks/useSupplierInformationTable";
import type { SupplierContactManagementType } from "@/types/asset-management-system/supplier-management/supplier-information";

const columnHelper = createColumnHelper<SupplierContactManagementType>();
interface SupplierContactManagementTableProps {
  data: SupplierContactManagementType[]
}

export const SupplierContactManagementTable: React.FC<SupplierContactManagementTableProps> = ({ data }) => {

  const { isFetching, onEdit, onDelete } = useSupplierContactManagementTable();

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "sno",
        header: "S.No",
        size: 20,
        cell: ({ row }) => row.index + 1,
      }),

      columnHelper.accessor("contactType", {
        header: "Contact Type",
        size: 120,
      }),

      columnHelper.accessor("contactValue", {
        header: "Contact Name",
        size: 200,
      }),

      columnHelper.accessor("isActive", {
        header: "Active",
        cell: (info) => {
          const active = Boolean(info.getValue());

          return (
            <span
              className={`text-xs font-medium ${
                active ? "text-green-600" : "text-red-600"
              }`}
            >
              {active ? "ACTIVE" : "INACTIVE"}
            </span>
          );
        },
      }),

      columnHelper.accessor("isPrimary", {
        header: "Primary",
        cell: (info) => {
          const primary = Boolean(info.getValue());

          return (
            <span
              className={`text-xs font-medium ${
                primary ? "text-blue-600" : "text-gray-500"
              }`}
            >
              {primary ? "YES" : "NO"}
            </span>
          );
        },
      }),

      columnHelper.display({
        id: "actions",
        header: "Actions",
        size: 80,
        cell: ({ row }) => (
          <div className="flex gap-1">
            <Button
              variant="ghost"
              className="text-primary hover:bg-primary/40 h-6 w-6 p-0"
              title="Edit"
              onClick={() => onEdit(row.original)}
            >
              <SquarePen size={13} />
            </Button>

            <Button
              variant="ghost"
              className="text-red-600 hover:bg-red-100 h-6 w-6 p-0"
              title="Delete"
              onClick={() => onDelete(row.original)}
            >
              <Trash2 size={13} />
            </Button>
          </div>
        ),
      }),
    ],
    [onEdit, onDelete]
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 5,
      },
    },
  });

  return (
    <>
      <Grid>
        <Grid.Item>
          <CommonTable
            table={table}
            noDataText={isFetching ? "Loading..." : "No records available"}
            className="bg-card"
          />
        </Grid.Item>
      </Grid>
    </>
  );
};