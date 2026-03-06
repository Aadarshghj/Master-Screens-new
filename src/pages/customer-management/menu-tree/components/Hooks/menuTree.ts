import { useState } from "react"

export const useMenuTree = () => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  const toggleNode = (id: string) => {
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id]
    }))
  }
  const isExpanded = (id: string) => expanded[id]
  return {
    toggleNode, isExpanded
  }
}