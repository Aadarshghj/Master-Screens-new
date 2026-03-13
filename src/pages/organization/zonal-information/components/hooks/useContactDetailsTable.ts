import { useCallback, useState } from "react"
import type { contactDetails } from "@/types/organisation/contact-details"
import { useGetChannelQuery } from "@/global/service/end-points/organisation/branches.api"

const defaultRow: contactDetails = {
  channel: "",
  value: "",
  remarks: "",
  branchIdentity: "",
  isPrimary: true
}

export const useContactDetailsTable = () => {
  const { data: CONTACT_OPTIONS = [] } = useGetChannelQuery()

  const [tableData, setTableData] = useState<contactDetails[]>([defaultRow])
  
  const getFilteredOptions = useCallback(
    (rowIndex: number, data: contactDetails[]) => {
      const selectedChannels = data
        .map((row, index) => (index !== rowIndex ? row.channel : null))
        .filter(Boolean)

      return CONTACT_OPTIONS.filter(option => {
        const value = option.value

        if (value === "MOBILE") return true
        if (value === "EMAIL" && selectedChannels.includes("EMAIL")) return false
        if (value === "LANDLINE" && selectedChannels.includes("LANDLINE")) return false

        return true
      })
    },
    [CONTACT_OPTIONS]
  )

  const addRow = useCallback(() => {
    setTableData(prev => [...prev, defaultRow])
  }, [])

  const removeRow = useCallback((index: number) => {
    setTableData(prev => prev.filter((_, i) => i !== index))
  }, [])

  const updateRow = useCallback((
    index: number,
    field: keyof contactDetails,
    value: string | number | boolean
  ) => {
    setTableData(prev =>
      prev.map((row, i) =>
        i === index ? { ...row, [field]: value } : row
      )
    )
  }, [])

  const resetTable = useCallback(() => {
    setTableData([defaultRow])
  }, [])

  return {
    tableData,
    CONTACT_OPTIONS,
    getFilteredOptions,
    addRow,
    removeRow,
    updateRow,
    resetTable
  }
}