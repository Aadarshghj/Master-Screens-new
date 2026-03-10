import { useCallback, useState } from "react"
import type { empanelItem } from "@/types/asset-management-system/supplier-empanelment"
import { ITEM_OPTIONS, MODEL_OPTIONS } from "@/mocks/asset-management-system/supplier-empanelment"
 const defaultRow = { itemName: "A4 100 gsm", model: "", amount: "" }
export const useEmpanelmentItemsTable = () => {

 

  const [tableData, setTableData] = useState<empanelItem[]>([defaultRow])

  const addRow = useCallback(() => {
    setTableData(prev => [...prev, defaultRow])
  }, [])

 const removeRow = useCallback((index: number) => {
    setTableData(prev => prev.filter((_, i) => i !== index))
  }, [])
 const updateRow = useCallback((
    index: number,
    field: keyof empanelItem,
    value: string | number
  ) => {
   
    setTableData(prev =>
      prev.map((row, i) =>
        i === index ? { ...row, [field]: String(value) } : row
      )
    )
  }, [])

 const resetTable = useCallback(() => {
    setTableData([defaultRow])
  }, [])

  return {
    tableData,
    ITEM_OPTIONS,
    MODEL_OPTIONS,
    addRow,
    removeRow,
    updateRow,
    resetTable
  }
}