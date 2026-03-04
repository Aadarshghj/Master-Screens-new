import React, { useMemo, useState } from "react";
import { Grid, CommonTable } from "@/components";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
// import toast from "react-hot-toast";
import type { AssetItemType } from "@/types/customer-management/asset-item";
import { ASSET_ITEM_DATA } from "../../../../../../mocks/customer-management-master/asset-item";
import { SquarePen } from "lucide-react";

const columnHelper = createColumnHelper<AssetItemType>();
interface Props {
  onEdit: (item: AssetItemType) => void;
}
export const AssetItemTable: React.FC<Props> = ({ onEdit }) => {
  const [data] = useState<AssetItemType[]>(ASSET_ITEM_DATA);

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "sno",
        header: "S.No",
        cell: ({ row }) => row.index + 1,
      }),

      columnHelper.accessor("assetItemCode", {
        header: "Asset Item Code",
      }),

      columnHelper.accessor("assetGroup", {
        header: "Asset Group",
      }),

      columnHelper.accessor("assetCategory", {
        header: "Asset Category",
      }),

      columnHelper.accessor("assetType", {
        header: "Asset Type",
      }),

      columnHelper.accessor("assetItemName", {
        header: "Asset Item Name",
      }),

      columnHelper.accessor("depreciationRate", {
        header: "Depreciation Rate",
      }),

      columnHelper.accessor("depreciationMethod", {
        header: "Depreciation Method",
      }),

      columnHelper.accessor("unitOfMeasurement", {
        header: "Unit",
      }),

      columnHelper.accessor("assetDescription", {
        header: "Asset Description",
        cell: ({ getValue }) => {
          const value = getValue();
          return value && value.trim() !== "" ? value : "------";
        },
      }),

      columnHelper.accessor("tangible", {
        header: "Asset Nature",
        cell: ({ getValue }) => (getValue() ? "TANGIBLE" : "NON-TANGIBLE"),
      }),

      columnHelper.accessor("active", {
        header: "Status",
        cell: ({ getValue }) => (getValue() ? "ACTIVE" : "INACTIVE"),
      }),

      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex items-center justify-center">
            <button
              onClick={() => onEdit(row.original)}
              className="text-destructive hover:opacity-80"
            >
              <SquarePen size={14} />{" "}
            </button>
          </div>
        ),
      }),
    ],
    []
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
          <CommonTable table={table} noDataText="No asset items available" />
        </Grid.Item>
      </Grid>
    </>
  );
};
