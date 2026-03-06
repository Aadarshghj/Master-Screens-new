import { Trash2, Plus } from "lucide-react"

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
      id: "itemName",
      header: "Item",
      cell: ({ row }) => (
        <Select
          options={ITEM_OPTIONS}
          value={row.original.itemName}
          onValueChange={value =>
            updateRow(row.index, "itemName", value)
          }
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
          onValueChange={value =>
            updateRow(row.index, "model", value)
          }
        />
      )
    }),

    columnHelper.display({
      id: "amount",
      header: "Amount",
      cell: ({ row }) => (
        <Input
          type="number"
          value={row.original.amount}
          onChange={e =>
            updateRow(row.index, "amount", Number(e.target.value))
          }
        />
      )
    }),

    columnHelper.display({
      id: "action",
      header: "Action",
      cell: ({ row }) => (
        <Button
          variant="destructive"
          size="sm"
          onClick={() => removeRow(row.index)}
        >
          <Trash2 size={14} />
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

      <Button onClick={addRow}>
        <Plus size={14} />
        Add Item
      </Button>

      <CommonTable
        table={table}
        size="compact"
        noDataText="No items added"
      />

    </div>
  )
}