import { Plus, Trash2 } from "lucide-react"
import { useMemo } from "react"

import {
  Button,
  Select,
  Input,
  CommonTable,
  Switch
} from "@/components"

import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable
} from "@tanstack/react-table"

import type { contactDetails } from "@/types/organisation/contact-details"

interface ContactDetailsTableProps {
  tableData: contactDetails[]
  CONTACT_OPTIONS: { label: string; value: string }[]
  addRow: () => void
  removeRow: (index: number) => void
  updateRow: (index: number, field: keyof contactDetails, value: string | number) => void
  getFilteredOptions: (
    rowIndex: number,
    data: contactDetails[]
  ) => { label: string; value: string }[]
  onSaveContacts: () => void
}

export function ContactDetailsTable({
  tableData,
  CONTACT_OPTIONS,
  getFilteredOptions,
  addRow,
  removeRow,
  updateRow,
  onSaveContacts
}: ContactDetailsTableProps) {

  const columnHelper = createColumnHelper<contactDetails>()

  const columns = useMemo(() => [
    columnHelper.display({
      id: "sno",
      header: "S.No",
      cell: ({ row }) => row.index + 1
    }),

    columnHelper.display({
      id: "channel",
      header: "Branch Contact Channel",
      cell: ({ row, table }) => (
        <Select
          // Using table.options.data ensures we always get the latest data 
          // without triggering a full column recreation
          options={getFilteredOptions(row.index, table.options.data as contactDetails[])}
          value={row.original.channel}
          onValueChange={(value) =>
            updateRow(row.index, "channel", value)
          }
          size="form"
          placeholder="Select Branch Contact Channel"
          fullWidth
        />
      )
    }),

    columnHelper.display({
      id: "branchIdentity",
      header: "Branch",
      cell: ({ row }) => (
        <Input
          type="text"
          value={row.original.branchIdentity}
          onChange={(e) =>
            updateRow(row.index, "branchIdentity", e.target.value)
          }
          size="form"
          variant="form"
          className="w-40"
          restriction="numeric"
        />
      )
    }),

    columnHelper.display({
      id: "value",
      header: "Value",
      cell: ({ row }) => (
        <Input
          type="text"
          value={row.original.value}
          onChange={(e) =>
            updateRow(row.index, "value", e.target.value)
          }
          size="form"
          variant="form"
          className="w-40"
          placeholder="Enter the contact value"
          restriction="numeric"
        />
      )
    }),

    columnHelper.display({
      id: "remarks",
      header: "Remarks",
      cell: ({ row }) => (
        <Input
          type="text"
          value={row.original.remarks}
          onChange={(e) =>
            updateRow(row.index, "remarks", e.target.value)
          }
          size="form"
          variant="form"
          className="w-40"
          placeholder="Enter the Remarks"
          restriction="numeric"
        />
      )
    }),

    columnHelper.display({
      id: "isPrimary",
      header: "Primary",
      cell: ({ row }) => (
        <Switch
          checked={!!row.original.isPrimary}
          onCheckedChange={(value) =>
            updateRow(row.index, "isPrimary", value ? 1 : 0)
          }
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

    // tableData has been safely removed from this dependency array
  ], [CONTACT_OPTIONS, removeRow, updateRow, getFilteredOptions])

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel()
  })

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <h3 className="text-sm font-semibold">Branch Contact</h3>

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
      <div className="flex justify-end">
        <Button
          type="button"
          variant="default"
          onClick={onSaveContacts}
        >
          Save Contact Details
        </Button>
      </div>
    </div>
  )
}