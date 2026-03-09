import React, { useMemo } from "react";
import { Grid, CommonTable } from "@/components";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Trash2, Pencil } from "lucide-react";
import {assetItemsOptions} from "@/mocks/customer-management-master/asset-master/asset-item-attribute"
import type { AssetItemAttributeTable } from "@/types/customer-management/asset-master/asset-item-attributes.types";
import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button";

const columnHelper = createColumnHelper<AssetItemAttributeTable>();
interface TableProps {
  data: AssetItemAttributeTable[] | undefined;
  isLoading: boolean;
  handleEdit: (identity: string) => void;
  handleDelete: (identity: string) => void;
}
export const AssetItemAttributesTable: React.FC<TableProps> = ({
 // data,
  isLoading,
  handleEdit,
  handleDelete,
}) => {
  const tableData = assetItemsOptions || [];
  const columns = useMemo(
    () => [
      columnHelper.accessor("assetItem", {
        header: "Loan Product",
      }),

      columnHelper.accessor("attributeKey", {
        header: "Attribute Key",
        cell: info => info.getValue() || "- - - - - - - - -",
      }),

      columnHelper.accessor("attributeName", {
        header: "Attribute Name",
        cell: info => info.getValue() || "- - - - - - - - -",
      }),

      columnHelper.accessor("dataType", {
        header: "Data Type",
        cell: info => info.getValue() || "- - - - - - - - -",
      }),

      columnHelper.accessor("defaultValue", {
        header: "Default Value",
        cell: info => info.getValue() || "- - - - - - - - -",
      }),

      columnHelper.accessor("description", {
        header: "Description",
        cell: info => info.getValue() || "- - - - - - - - -",
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
        cell: ({ row }) => {
          const item = row.original.identity;
          return (
            <div className="flex items-center gap-2">
              <NeumorphicButton
                variant="none"
                onClick={() => handleEdit(item)}
                className="text-primary hover:bg-primary/50 h-6 w-6 p-0"
              >
                <Pencil size={13} />
              </NeumorphicButton>

              <NeumorphicButton
                variant="none"
                onClick={() => handleDelete(item)}
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
      return "Loading Asset Item Attributes...";
    }
    return "No Asset Item Attributes found";
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
