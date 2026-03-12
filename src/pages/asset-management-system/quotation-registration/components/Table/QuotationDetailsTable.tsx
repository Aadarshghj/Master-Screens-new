import React, { useMemo, useState } from "react";
import { Grid, CommonTable, Input } from "@/components";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type { QuotationDetailsData } from "@/types/asset-management/quotation-registration-type";
import { SUPPLIER_MOCK_DATA } from "@/mocks/asset-management/quotation-registration";

const columnHelper = createColumnHelper<QuotationDetailsData>();

interface QuotationDetailsDataTableProps {}

export const QuotationDetailsDataTable: React.FC<QuotationDetailsDataTableProps> = () => {
  const [data, setData] = useState(SUPPLIER_MOCK_DATA);

  const handleInputChange = (rowIndex: number, columnId: string, value: string) => {
    setData((prevData) => {
      const newData = [...prevData];
      newData[rowIndex] = { ...newData[rowIndex], [columnId]: value };
      return newData;
    });
  };

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

      columnHelper.display({
        id: "qtyAvailable",
        header: "QTY Available",
        cell: ({ row }) => (
          <Input
            type="text"
            value={row.original.amount}
            onChange={(e) =>
              handleInputChange(row.index, "qtyAvailable", e.target.value)
            }
            size="form"
            variant="form"
            placeholder="Enter Qty"
            className="w-20 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
          />
        )
      }),

      columnHelper.accessor("uom", {
        header: "UOM",
        cell: (info) => info.getValue() || "- - - - - - - - -",
      }),

      columnHelper.display({
        id: "unitPrice",
        header: "Unit Price",
        cell: ({ row }) => (
          <Input
            type="string"
            value={row.original.unitPrice || ""}
            onChange={(e) =>
              handleInputChange(row.index, "unitPrice", e.target.value)
            }
            size="form"
            variant="form"
            placeholder="Enter Unit Price"
            className="w-20 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
          />
        )
      }),

      columnHelper.display({
        id: "amount",
        header: "Amount",
        cell: ({ row }) => (
          <Input
            type="string"
            value={row.original.amount}
            onChange={(e) =>
              handleInputChange(row.index, "amount", e.target.value)
            }
            size="form"
            variant="form"
            placeholder="Enter Amount"
            className="w-20 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
          />
        )
      }),

      columnHelper.display({
        id: "sgstPercent",
        header: "SGST %",
        cell: ({ row }) => (
          <Input
            type="string"
            value={row.original.sgstPercent}
            onChange={(e) =>
              handleInputChange(row.index, "sgstPercent", e.target.value)
            }
            size="form"
            variant="form"
            placeholder="Enter SGST %"
            className="w-20 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
          />
        )
      }),

      columnHelper.display({
        id: "sgst",
        header: "SGST",
        cell: ({ row }) => (
          <Input
            type="string"
            value={row.original.sgst}
            onChange={(e) =>
              handleInputChange(row.index, "sgst", e.target.value)
            }
            size="form"
            variant="form"
            disabled
            placeholder="Enter SGST"
            className="w-20 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
          />
        )
      }),

      columnHelper.display({
        id: "cgstPercent",
        header: "CGST",
        cell: ({ row }) => (
          <Input
            type="string"
            value={row.original.cgstPercent}
            onChange={(e) =>
              handleInputChange(row.index, "cgstPercent", e.target.value)
            }
            size="form"
            variant="form"
            placeholder="Enter CGST %"
            className="w-20 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
          />
        )
      }),

      columnHelper.display({
        id: "cgst",
        header: "CGST",
        cell: ({ row }) => (
          <Input
            type="string"
            value={row.original.cgst}
            onChange={(e) =>
              handleInputChange(row.index, "cgst", e.target.value)
            }
            size="form"
            variant="form"
            disabled
            placeholder="Enter CGST"
            className="w-20 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
          />
        )
      }),

      columnHelper.display({
        id: "igstPercent",
        header: "IGST",
        cell: ({ row }) => (
          <Input
            type="string"
            value={row.original.igstPercent}
            onChange={(e) =>
              handleInputChange(row.index, "igstPercent", e.target.value)
            }
            size="form"
            variant="form"
            placeholder="Enter IGST %"
            className="w-20 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
          />
        )
      }),

      columnHelper.display({
        id: "igst",
        header: "IGST",
        cell: ({ row }) => (
          <Input
            type="string"
            value={row.original.igst}
            onChange={(e) =>
              handleInputChange(row.index, "igst", e.target.value)
            }
            size="form"
            variant="form"
            disabled
            placeholder="Enter IGST"
            className="w-20 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
          />
        )
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
    <Grid>
      <Grid.Item>
        <CommonTable
          table={table}
          className="bg-card"
        />
      </Grid.Item>
    </Grid>
  );
};