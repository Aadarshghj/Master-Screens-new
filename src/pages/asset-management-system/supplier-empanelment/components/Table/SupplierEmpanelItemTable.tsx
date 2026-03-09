import { Plus, Trash2 } from "lucide-react"

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

import { useEmpanelmentItemsTable } from "../Hooks/useSupplierEmpanelItemTable"

import type { empanelItem } from "@/types/asset-management-system/supplier-empanelment"


export function EmpanelmentItemsTable() {

  const {
    tableData,
    ITEM_OPTIONS,
    MODEL_OPTIONS,
    addRow,
    removeRow,
    updateRow
  } = useEmpanelmentItemsTable()

  const columnHelper = createColumnHelper<empanelItem>()

const columns = [
columnHelper.display({
        id: "sno",
        header: "S.No",
        cell: ({ row }) => row.index + 1,
      }),
  columnHelper.display({
  id: "itemName",
  header: "Item",
  size: 220,
  cell: ({ row }) => (
    <div className="rounded-md focus-within:ring-1 focus-within:ring-blue-600">
      <Select
        options={ITEM_OPTIONS}
        value={row.original.itemName}
        onValueChange={(value) =>
          updateRow(row.index, "itemName", value)
        }
        size="form"
        fullWidth
      />
    </div>
  )
}),

  columnHelper.display({
  id: "model",
  header: "Model",
  size: 220,
  cell: ({ row }) => (
    <div className="rounded-md focus-within:ring-1 focus-within:ring-blue-600 ">
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
    </div>
  )
}),

  columnHelper.display({
  id: "amount",
  header: "Amount",
  cell: ({ row }) => (
    <Input
      type="text"
      value={row.original.amount || ""}
      onChange={e =>
        updateRow(row.index, "amount", e.target.value)
        
      }
      size="form"
      variant="form"
      placeholder="Enter Amount"
      className="w-40 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
    />
  )
}),

  columnHelper.display({
    id: "action",
    header: "Action",
    size: 80,
    cell: ({ row }) => (
      <Button
        variant="ghost"
        size="sm"
        className="text-status-error hover:bg-status-error-background h-6 w-6 p-0"
        onClick={() => removeRow(row.index)}
      >
        <Trash2 size={13} />
      </Button>
    )
  })
]
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
    className="bg-blue-700 text-white p-1 rounded-md hover:bg-blue-800 flex items-center justify-center"
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