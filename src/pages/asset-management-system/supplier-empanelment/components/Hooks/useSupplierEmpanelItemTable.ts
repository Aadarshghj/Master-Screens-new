import { useState } from "react"

import type { empanelItem } from "@/types/asset-management-system/supplier-empanelment"

import {
  ITEM_OPTIONS,
  MODEL_OPTIONS
} from "../../constants/SupplierEmpanelmentDefault"

export const useEmpanelmentItemsTable = () => {

  const [tableData, setTableData] = useState<empanelItem[]>([
    { itemName: "", model: "", amount: 0 }
  ])

  const addRow = () => {
    setTableData(prev => [
      ...prev,
      { itemName: "", model: "", amount: 0 }
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
        [field]: value
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