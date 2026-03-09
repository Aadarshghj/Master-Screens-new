import { useState } from "react"

import type { empanelItem } from "@/types/asset-management-system/supplier-empanelment"

import {
  ITEM_OPTIONS,
  MODEL_OPTIONS
} from "@/mocks/asset-management-system/supplier-empanelment"

export const useEmpanelmentItemsTable = () => {

  const [tableData, setTableData] = useState<empanelItem[]>([
    { itemName: "A4 100 gsm", model: "", amount: "" }
  ])

  const addRow = () => {
    setTableData(prev => [
      ...prev,
      { itemName: "A4 100 gsm", model: "", amount: "" }
    ])
  }

  const removeRow = (index: number) => {
    setTableData(prev => prev.filter((_, i) => i !== index))
  }

  const updateRow = (
    index: number,
    field: keyof empanelItem,
    value: string | number
  ) => {
    setTableData(prev => {
      const updated = [...prev]

      updated[index] = {
        ...updated[index],
        [field]: String(value)
      }

      return updated
    })
  }

  return {
    tableData,
    ITEM_OPTIONS,
    MODEL_OPTIONS,
    addRow,
    removeRow,
    updateRow
  }
}