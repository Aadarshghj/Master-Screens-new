import React, { useMemo } from "react";
import { Grid, CommonTable, Button } from "@/components";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";
import type { OrnamentNameData } from "@/types/customer-management/ornament-name";
import { useOrnamentNameTable } from "../Hooks/useOrnamentNameTable";
import { ORNAMENT_NAME_SAMPLE_DATA } from "@/mocks/customer-management-master/ornament-name";
import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button";

const columnHelper = createColumnHelper<OrnamentNameData>();

interface OrnamentNameTableProps {
}

export const OrnamentNameTable: React.FC<OrnamentNameTableProps> = ({

}) => {
  const { } = useOrnamentNameTable();

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "sno",
        header: "S.No",
        cell: ({ row }) => row.index + 1,
      }),

      columnHelper.accessor("ornamentType", {
        header: "Ornament Type",
      }),

      columnHelper.accessor("ornamentCode", {
        header: "Ornament Code",
        cell: (info) => info.getValue() || "- - - - - - - - -",
      }),

      columnHelper.accessor("ornamentName", {
        header: "Ornament Name",
        cell: (info) => info.getValue() || "- - - - - - - - -",
      }),

      columnHelper.accessor("description", {
        header: "Description",
        cell: (info) => info.getValue() || "- - - - - - - - -",
      }),

      columnHelper.accessor("isActive", {
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
        cell: ({}) => {
          return (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="xs"
                // onClick={() => onEdit(row.original)}
                // disabled={!row.original.isActive}
                className="text-primary hover:bg-primary/50 h-6 w-6 p-0"
                title="Edit"
              >
                <Pencil className="h-3 w-3" />
              </Button>

              <NeumorphicButton
                variant="none"
                // onClick={() => handleDelete(item)}
                // disabled={!row.original.isActive}
                className="text-status-error hover:bg-status-error-background h-6 w-6 p-0"
              >
                <Trash2 size={13} />
              </NeumorphicButton>
            </div> 
          );   
        },
      }),
    ],
    []
  );

  const table = useReactTable({
    data: ORNAMENT_NAME_SAMPLE_DATA,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <Grid>
        <Grid.Item>
          <CommonTable
            table={table}
            // noDataText={ ? "Loading..." : "No Ornament Name"}
            className="bg-card"
        />
         <div className="flex items-center justify-end gap-2 mt-4 text-sm">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="px-2 py-1 rounded text-gray-500 hover:text-gray-700 disabled:opacity-40"
            >
              ‹ Previous
            </button>
  
            {Array.from({ length: table.getPageCount() }, (_, i) => {
              const isActive = table.getState().pagination.pageIndex === i;
            
              return (
                <button
                  key={i}
                  onClick={() => table.setPageIndex(i)}
                  className={`
                    min-w-[20px] h-[20px] flex items-center justify-center
                    rounded-lg font-medium transition-all duration-200
                    ${isActive
                      ? "bg-white text-gray-700 shadow-[0_2px_6px_rgba(0,0,0,0.15)]"
                      : "text-gray-500 hover:bg-white hover:text-gray-700 hover:shadow-[0_2px_6px_rgba(0,0,0,0.12)] hover:-translate-y-[1px]"
                    }
                  `}
                >
                  {i + 1}
                </button>
              );
            })}
  
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="px-2 py-1 rounded text-gray-500 hover:text-gray-700 disabled:opacity-40"
            >
              Next ›
            </button>
          </div>
        </Grid.Item>
      </Grid>
    </>
  );
};