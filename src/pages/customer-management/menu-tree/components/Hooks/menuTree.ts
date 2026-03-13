import { useState, useEffect } from "react"
import {
  useGetMenuTreeQuery,

} from "@/global/service/end-points/customer-management/menu-tree"

import type { TreeNode } from "@/types/customer-management/menu-tree"

export const useMenuTree = () => {
  const [treeData, setTreeData] = useState<TreeNode[]>([])
  const [expandedNodes, setExpandedNodes] = useState<string[]>([])

 const { data: menuData = [], refetch } = useGetMenuTreeQuery(undefined, {
  refetchOnMountOrArgChange: true
})
 

  const buildTree = (menus: any[]): TreeNode[] => {
    const map = new Map<string, TreeNode>()
    const roots: TreeNode[] = []

    menus.forEach((item) => {
      map.set(item.menuCode, {
        id: item.menuCode,
        identity: item.identity || item.menuIdentity || item.id || "",
        name: item.menuName,
        children: []
      })
    })

    menus.forEach((item) => {
      const node = map.get(item.menuCode)
      if (!node) return

      const parentCode = item.parent?.menuCode

      if (!parentCode) {
        roots.push(node)
        return
      }

      const parent = map.get(parentCode)

      if (parent) {
        parent.children.push(node)
      } else {
        roots.push(node)
      }
    })

    return roots
  }
  useEffect(() => {
  refetch()
}, [])

useEffect(() => {
  if (menuData.length) {
    const tree = buildTree(menuData)
    setTreeData(tree)
    const rootIds = tree.map((node) => node.id)
    setExpandedNodes(rootIds)
  }
}, [menuData])

  const toggleNode = (id: string) => {
    setExpandedNodes((prev) =>
      prev.includes(id) ? prev.filter((n) => n !== id) : [...prev, id]
    )
  }

  const isExpanded = (id: string) => expandedNodes.includes(id)

 

  return {
    treeData,
    toggleNode,
    isExpanded,
    
  }
}