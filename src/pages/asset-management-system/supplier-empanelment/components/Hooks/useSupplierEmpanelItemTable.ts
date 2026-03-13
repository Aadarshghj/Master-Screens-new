import { useCallback, useState } from "react"
import type { empanelItem } from "@/types/asset-management-system/supplier-empanelment"
import { ITEM_OPTIONS, MODEL_OPTIONS } from "@/mocks/asset-management-system/supplier-empanelment"
import { logger } from "@/global/service"

const defaultRow = { itemName: "A4 100 gsm", model: "", amount: "" }

export const useEmpanelmentItemsTable = () => {

  const [tableData, setTableData] = useState<empanelItem[]>([defaultRow])

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null)

  const addRow = useCallback(() => {
    setTableData(prev => [...prev, defaultRow])
  }, [])

  const openDeleteModal = useCallback((index: number) => {
    setSelectedRowIndex(index)
    setShowDeleteModal(true)
  }, [])

  const closeDeleteModal = useCallback(() => {
    setShowDeleteModal(false)
    setSelectedRowIndex(null)
  }, [])

  const handleConfirmDelete = useCallback(() => {
    if (selectedRowIndex === null) return

    setTableData(prev => prev.filter((_, i) => i !== selectedRowIndex))

    logger.info("Empanel Item Deleted", { toast: true })

    closeDeleteModal()
  }, [selectedRowIndex, closeDeleteModal])

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
    openDeleteModal,
    closeDeleteModal,
    handleConfirmDelete,
    showDeleteModal,
    updateRow,
    resetTable
  }
}