import React, { useMemo } from "react";
import { Grid, CommonTable } from "@/components";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Pencil } from "lucide-react";
import { useAssetGroupTable } from "../Hooks/useAssetGroupTable";
import type { AssetGroupType } from "@/types/asset-management/asset-group.types";

const columnHelper = createColumnHelper<AssetGroupType>();

export const AssetGroupTable: React.FC = () => {
  const { data, isFetching, onEdit } = useAssetGroupTable();

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "sno",
        header: "S.No",
        cell: ({ row }) => row.index + 1,
      }),

      columnHelper.accessor("assetCode", {
        header: "Asset Group Code",
      }),

      columnHelper.accessor("assetName", {
        header: "Asset Group Name",
      }),

      columnHelper.accessor("description", {
        header: "Asset Group Description",
      }),

      columnHelper.accessor("postingGL", {
        header: "GL",
      }),

      columnHelper.accessor("isActive", {
        header: "Status",
        cell: info => (info.getValue() ? "ACTIVE" : "INACTIVE"),
      }),

      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <button
            title="Edit"
            onClick={() => onEdit(row.original)}
            className="text-primary ml-3 hover:opacity-80"
          >
            <Pencil size={12} />
          </button>
        ),
      }),
    ],

    [onEdit]
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
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
