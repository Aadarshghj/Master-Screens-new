import React, { useMemo, useState } from "react";

import { CommonTable, Grid, Input, Select } from "@/components/ui";
import type { OtherChargesData } from "@/types/asset-management-system/quotation-registration-type";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button";
import { Trash2 } from "lucide-react";
import { CHARGES_OPTIONS } from "../../constants/QuotationRegDefault";

const columnHelper = createColumnHelper<OtherChargesData>();

interface OtherChargesTableProps {
  data: OtherChargesData[];
}

export const OtherChargesTable: React.FC<OtherChargesTableProps> = ({
  data,
}) => {
  const [tableData, setTableData] = useState<OtherChargesData[]>(data);

  const updateRow = (
    rowIndex: number,
    field: keyof OtherChargesData,
    value: any
  ) => {
    const updatedData = [...tableData];
    updatedData[rowIndex] = { ...updatedData[rowIndex], [field]: value };
    setTableData(updatedData);
  };

  const handleInputChange = (
    rowIndex: number,
    field: keyof OtherChargesData,
    value: any
  ) => {
    const updatedData = [...tableData];
    updatedData[rowIndex] = { ...updatedData[rowIndex], [field]: value };
    setTableData(updatedData);
  };

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "sno",
        header: "S.No",
        cell: ({ row }) => row.index + 1,
      }),
      columnHelper.display({
        id: "chargeName",
        header: "Charge Name",
        size: 220,
        cell: ({ row }) => (
          <div className="rounded-md focus-within:ring-1 focus-within:ring-blue-600">
            <Select
              options={CHARGES_OPTIONS}
              value={row.original.chargeName || ""}
              onValueChange={value => updateRow(row.index, "chargeName", value)}
              size="form"
              fullWidth
            />
          </div>
        ),
      }),

      columnHelper.display({
        id: "chargeAmount",
        header: "Charge Amount",
        cell: ({ row }) => (
          <Input
            type="text"
            value={row.original.chargeAmount || ""}
            onChange={e =>
              handleInputChange(row.index, "chargeAmount", e.target.value)
            }
            size="form"
            variant="form"
            placeholder="Enter Charge Amount"
            className="w-30 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none"
          />
        ),
      }),

      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: () => (
          <div className="flex items-center gap-2">
            <NeumorphicButton
              variant="none"
              className="text-status-error hover:bg-status-error-background h-6 w-6 p-0"
            >
              <Trash2 size={13} />
            </NeumorphicButton>
          </div>
        ),
      }),
    ],
    [tableData]
  );

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Grid>
      <Grid.Item>
        <CommonTable table={table}></CommonTable>
      </Grid.Item>
    </Grid>
  );
};
