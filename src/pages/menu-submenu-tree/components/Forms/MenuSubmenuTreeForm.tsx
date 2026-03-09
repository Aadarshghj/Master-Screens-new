import React, { useState } from "react"
import { PlusCircle, LucideMinusCircle, LucideTrash2 } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { menuTree } from "../Hooks/useMenuSubmenuTree"
import type { TreeNode } from "../../constants/menuSubmenuTreeValues"

interface Props {
  data: TreeNode[]
}

const MenuTreeForm: React.FC<Props> = ({ data }) => {
  const { toggleNode, isExpanded } = menuTree()
  const navigate = useNavigate()

  const [treeData, setTreeData] = useState<TreeNode[]>(data)
  const [activeInput, setActiveInput] = useState<string | null>(null)
  const [inputValue, setInputValue] = useState("")

  const addChildNode = (nodes: TreeNode[], parentId: string): TreeNode[] => {
    return nodes.map((node) => {
      if (node.id === parentId) {
        const newChild: TreeNode = {
          id: Date.now().toString(),
          name: inputValue,
          children: [],
        }

        return {
          ...node,
          children: [...(node.children || []), newChild],
        }
      }

      if (node.children) {
        return {
          ...node,
          children: addChildNode(node.children, parentId),
        }
      }

      return node
    })
  }

  const handleAdd = (parentId: string) => {
    if (!inputValue.trim()) return

    const updatedTree = addChildNode(treeData, parentId)
    setTreeData(updatedTree)

    setInputValue("")
    setActiveInput(null)
  }

  const deleteNode = (nodes: TreeNode[], nodeId: string): TreeNode[] => {
    return nodes
      .filter((node) => node.id !== nodeId)
      .map((node) => ({
        ...node,
        children: node.children ? deleteNode(node.children, nodeId) : [],
      }))
  }

  const handleDelete = (id: string) => {
    if (!confirm("Delete this menu?")) return
    const updatedTree = deleteNode(treeData, id)
    setTreeData(updatedTree)
  }

  const renderNode = (node: TreeNode) => {
    const hasChildren = node.children && node.children.length > 0
    const expanded = isExpanded(node.id)

    return (
      // Fix 1: Changed mt-3 to pt-3 to prevent margin collapse
      <div key={node.id} className="pt-3">
        <div className="flex items-center gap-2">
          <div
            onClick={() => {
              if (hasChildren) {
                toggleNode(node.id)
              } else {
                navigate("/customer-management/master/menu-submenu")
              }
            }}
            className="flex items-center gap-2 bg-indigo-100 hover:bg-indigo-200 text-xs px-4 py-1 rounded-md w-60 cursor-pointer text-black"
          >
            {hasChildren && (
              <span className="font-bold text-xs">
                {expanded ? (
                  <LucideMinusCircle className="text-blue-500" size={15} />
                ) : (
                  <PlusCircle className="text-blue-500" size={15} />
                )}
              </span>
            )}

            <span>{node.name}</span>
          </div>

          <div className="flex gap-1">
            <button
              onClick={() => setActiveInput(node.id)}
              className="text-xs bg-blue-500 text-white px-2 py-1 rounded"
            >
              +
            </button>

            <button
              onClick={() => handleDelete(node.id)}
              className="text-xs bg-blue-500 text-white px-2 py-1 rounded"
            >
              <LucideTrash2 size={12} />
            </button>
          </div>
        </div>

        {activeInput === node.id && (
          // Added mt-2 just so the input box doesn't squash against the button
          <div className="flex gap-2 mt-2">
            <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="border px-2 py-1 text-xs rounded"
              placeholder="Enter menu"
            />
            <button
              onClick={() => handleAdd(node.id)}
              className="bg-blue-500 text-white px-2 py-1 text-xs rounded"
            >
              Add
            </button>
          </div>
        )}

        {hasChildren && expanded && (
          <div className="ml-6">
            {node.children?.map((child, index) => {
              const isLast = index === node.children!.length - 1

              return (
                <div key={child.id} className="relative pl-6">
                  {/* Fix 2 & 3: border-l instead of border, h-6 for the last element, top-0 to connect fully */}
                  <span
                    className={`absolute left-0 top-0 border border-gray-800 ${
                      isLast ? "h-6" : "h-full"
                    }`}
                  ></span>
                  
                  {/* Fix 2 & 3: border-t instead of border, top-6 to hit perfectly in the middle */}
                  <span className="absolute left-0 top-6 w-6 border border-gray-800"></span>

                  {renderNode(child)}
                </div>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  return <div className="p-4">{treeData.map(renderNode)}</div>
}

export default MenuTreeForm