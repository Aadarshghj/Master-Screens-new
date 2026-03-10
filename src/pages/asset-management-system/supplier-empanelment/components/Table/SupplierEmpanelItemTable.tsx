import { Plus, Trash2 } from "lucide-react"
import { useMemo } from "react"

import {
  Button,
  Select,
  Input,
  CommonTable
} from "@/components"

import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable
} from "@tanstack/react-table"

import type { empanelItem } from "@/types/asset-management-system/supplier-empanelment"

interface EmpanelmentItemsTableProps {
  tableData: empanelItem[]
  ITEM_OPTIONS: { label: string; value: string }[]
  MODEL_OPTIONS: { label: string; value: string }[]
  addRow: () => void
  removeRow: (index: number) => void
  updateRow: (index: number, field: keyof empanelItem, value: string | number) => void
}

export function EmpanelmentItemsTable({
  tableData,
  ITEM_OPTIONS,
  MODEL_OPTIONS,
  addRow,
  removeRow,
  updateRow
}: EmpanelmentItemsTableProps) {

  const columnHelper = createColumnHelper<empanelItem>()

  const columns = useMemo(() => [

    columnHelper.display({
      id: "sno",
      header: "S.No",
      cell: ({ row }) => row.index + 1
    }),

    columnHelper.display({
      id: "itemName",
      header: "Item Name",
      cell: ({ row }) => (
        <Select
          options={ITEM_OPTIONS}
          value={row.original.itemName}
          onValueChange={(value) =>
            updateRow(row.index, "itemName", value)
          }
          size="form"
          placeholder="Select Item Name"
          fullWidth
        />
      )
    }),

    columnHelper.display({
      id: "model",
      header: "Model",
      cell: ({ row }) => (
        <Select
          options={MODEL_OPTIONS}
          value={row.original.model}
          onValueChange={(value) =>
            updateRow(row.index, "model", value)
          }
          size="form"
          placeholder="Select Model"
          fullWidth
        />
      )
    }),

    columnHelper.display({
      id: "amount",
      header: "Amount",
      cell: ({ row }) => (
        <Input
          type="text"
          value={row.original.amount}
          onChange={(e) =>
            updateRow(row.index, "amount", e.target.value)
          }
          size="form"
          variant="form"
          placeholder="Enter Amount"
          className="w-40"
          restriction="numeric"
          
        />
      )
    }),

    columnHelper.display({
      id: "action",
      header: "Action",
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          className="text-status-error h-6 w-6 p-0"
          onClick={() => removeRow(row.index)}
        >
          <Trash2 size={13} />
        </Button>
      )
    })

  ], [ITEM_OPTIONS, MODEL_OPTIONS, removeRow, updateRow])

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel()
  })

  return (
    <div className="space-y-3">

      <div className="flex items-center gap-3">
        <h3 className="text-sm font-semibold">Empanel Items</h3>

        <button
          type="button"
          onClick={addRow}
          className="bg-blue-700 text-white p-1 rounded-md flex items-center justify-center"
        >
          <Plus size={15} />
        </button>
      </div>

      <CommonTable
        table={table}
        size="compact"
        noDataText="No items added"
      />

    </div>
  )
}