import React, { useMemo } from "react";
import { Grid,
   CommonTable,
   } from "@/components";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Trash2, Pencil } from "lucide-react";

import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button";
import type { CoLendingSchemeMapType } from "@/types/loan-product-and-scheme-masters/co-lending-scheme-mapping/co-lending-scheme-map";
import { COL_LENDING_SCHEME_MAP_SAMPLE_DATA } from "@/mocks/co-lending-scheme-mapping/co-lender-scheme-map";

const columnHelper = createColumnHelper<CoLendingSchemeMapType>();
interface TableProps {
  data: CoLendingSchemeMapType[] | undefined;
  isLoading: boolean;
  // handleEdit: (identity: string) => void;
  handleDelete: (identity: string) => void;
}
export const CoLendingSchemeMapTable: React.FC<TableProps> = ({
 data = COL_LENDING_SCHEME_MAP_SAMPLE_DATA,
  isLoading,
//   handleEdit,
  handleDelete,
}) => {
  const tableData = data || [];
  const columns = useMemo(
    () => [
      

      columnHelper.accessor("productcode", {
        header: "Product",
        cell: info => info.getValue() || "- - - - - - - - -",
      }),

      columnHelper.accessor("schemecode", {
        header: "Scheme",
        cell: info => info.getValue() || "- - - - - - - - -",
      }),

      columnHelper.accessor("bankcode", {
        header: "Linked Banks",
        cell: info => `${info.getValue() || 0}`,
      }),
     
      columnHelper.accessor("bankname", {
        header: "Status",
        cell: info => `${info.getValue() || 0}`,
      }),

      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: ({  }) => {
        //   const item = row.original.identity;
          return (
            <div className="flex items-center gap-2">
              <NeumorphicButton
                variant="none"
                // onClick={() => handleEdit(item)}
                className="text-primary hover:bg-primary/50 h-6 w-6 p-0"
              >
                <Pencil size={13} />
              </NeumorphicButton>

              <NeumorphicButton
                variant="none"
                // onClick={() => handleDelete(item)}
                className="text-status-error hover:bg-status-error-background h-6 w-6 p-0"
              >
                <Trash2 size={13} />
              </NeumorphicButton>
            </div>
          );
        },
      }),
    ],
    [handleDelete]
  );
  const getNoDataText = () => {
    if (isLoading) {
      return "Loading Co-Lending Bank Configurations...";
    }
    return "No Co-Lending Bank Configurations found";
  };

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Grid>
      <Grid.Item>
        <CommonTable
          table={table}
          size="default"
          noDataText={getNoDataText()}
          className="bg-card"
        />
      </Grid.Item>
    </Grid>
  );
};