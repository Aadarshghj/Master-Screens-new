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
import {BANK_TABLE_DATA} from "@/mocks/bank/bank-config"
import type { BankConfigData } from "@/types/loan-product-and-scheme-masters/co-lending-scheme-mapping/co-lending-bank-config.types";
import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button";

const columnHelper = createColumnHelper<BankConfigData>();
interface TableProps {
  data: BankConfigData[] | undefined;
  isLoading: boolean;
  handleDelete: (identity: string) => void;
}
export const CoLendingBankConfigTable: React.FC<TableProps> = ({
 data = BANK_TABLE_DATA,
  isLoading,
  handleDelete,
}) => {
  const tableData = data || [];
  const columns = useMemo(
    () => [
       columnHelper.accessor("bankCode", {
        header: "Bank Code",
        cell: info => info.getValue() || "- - - - - - - - -",
      }),

      columnHelper.accessor("bankName", {
        header: "Bank Name",
        cell: info => info.getValue() || "- - - - - - - - -",
      }),

      columnHelper.accessor("interestRate", {
        header: "Interest %",
        cell: info => `${info.getValue() || 0}%`,
      }),

      columnHelper.accessor("mode", {
        header: "Mode",
        cell: info => {
          const mode = Boolean(info.getValue());
          return (
            <span
              className={`text-xs }`}
            >
              {mode ? "API" : "SFTP"}
            </span>
          );
        },
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
        cell: ({  }) => {
          return (
            <div className="flex items-center gap-2">
              <NeumorphicButton
                variant="none"
                className="text-primary hover:bg-primary/50 h-6 w-6 p-0"
              >
                <Pencil size={13} />
              </NeumorphicButton>

              <NeumorphicButton
                variant="none"
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
