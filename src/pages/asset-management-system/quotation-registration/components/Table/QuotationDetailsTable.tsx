import React, { useMemo } from "react";
import { Grid, CommonTable } from "@/components";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type { QuotationDetailsData } from "@/types/asset-management/quotation-registration-type";
import { useQuotDetTable } from "../Hooks/useQuotationDetailsTable";
import { SUPPLIER_MOCK_DATA } from "@/mocks/asset-management/quotation-registration";

const columnHelper = createColumnHelper<QuotationDetailsData>();

interface QuotationDetailsDataTableProps {
}

export const QuotationDetailsDataTable: React.FC<QuotationDetailsDataTableProps> = ({

}) => {
  const { } = useQuotDetTable();

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "sno",
        header: "S.No",
        cell: ({ row }) => row.index + 1,
      }),

      columnHelper.accessor("itemName", {
        header: "Item Name",
      }),

      columnHelper.accessor("itemSpec", {
        header: "Item Specifications",
        cell: (info) => info.getValue() || "- - - - - - - - -",
      }),

      columnHelper.accessor("model", {
        header: "Model/Man..",
        cell: (info) => info.getValue() || "- - - - - - - - -",
      }),

      columnHelper.accessor("qtyReq", {
        header: "QTY Requested",
        cell: (info) => info.getValue() || "- - - - - - - - -",
      }),

      columnHelper.accessor("qtyAvailable", {
        header: "QTY Available",
        cell: (info) => info.getValue() || "- - - - - - - - -",
      }),

      columnHelper.accessor("uom", {
        header: "UOM",
        cell: (info) => info.getValue() || "- - - - - - - - -",
      }),

      columnHelper.accessor("unitPrice", {
        header: "Unit Price",
        cell: (info) => info.getValue() || "- - - - - - - - -",
      }),

      columnHelper.accessor("amount", {
        header: "Amount",
        cell: (info) => info.getValue() || "- - - - - - - - -",
      }),

      columnHelper.accessor("sgstPercent", {
        header: "SGST %",
        cell: (info) => info.getValue() || "- - - - - - - - -",
      }),

      columnHelper.accessor("sgst", {
        header: "SGST",
        cell: (info) => info.getValue() || "- - - - - - - - -",
      }),

      columnHelper.accessor("cgstPercent", {
        header: "CGST %",
        cell: (info) => info.getValue() || "- - - - - - - - -",
      }),

      columnHelper.accessor("cgst", {
        header: "CGST",
        cell: (info) => info.getValue() || "- - - - - - - - -",
      }),

      columnHelper.accessor("igstPercent", {
        header: "IGST %",
        cell: (info) => info.getValue() || "- - - - - - - - -",
      }),

      columnHelper.accessor("igst", {
        header: "IGST",
        cell: (info) => info.getValue() || "- - - - - - - - -",
      }),

    ],
    []
  );

  const table = useReactTable({
    data: SUPPLIER_MOCK_DATA,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <Grid>
        <Grid.Item>
          <CommonTable
            table={table}
            className="bg-card"
        />
        </Grid.Item>
      </Grid>
    </>
  );
};