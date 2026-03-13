import React from "react"
import { PlusCircle, LucideMinusCircle, Edit } from "lucide-react"
import { useNavigate } from "react-router-dom"

import { useMenuTree } from "../Hooks/menuTree"
import type { TreeNode } from "@/types/customer-management/menu-tree"

const MenuTreeForm: React.FC = () => {
  const navigate = useNavigate()

  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [, setSelectedNode] = React.useState<TreeNode | null>(null)
  const [editedName, setEditedName] = React.useState("")

  const { treeData, toggleNode, isExpanded } = useMenuTree()

  const renderNode = (node: TreeNode, parentPath = ""): React.ReactNode => {
    const hasChildren = node.children.length > 0
    const expanded = isExpanded(node.id)

    const currentFullPath = parentPath
      ? `${parentPath} - ${node.name}`
      : node.name

    return (
      <div key={node.id} className="pt-3">
        <div className="flex items-center gap-2">

          <div className="flex items-center gap-2 bg-indigo-100 hover:bg-indigo-200 text-xs px-4 py-1 rounded-md w-60">

            {hasChildren && (
              <span
                onClick={() => toggleNode(node.id)}
                className="cursor-pointer"
              >
                {expanded ? (
                  <LucideMinusCircle size={15} className="text-blue-500" />
                ) : (
                  <PlusCircle size={15} className="text-blue-500" />
                )}
              </span>
            )}

            <span>{node.name}</span>
          </div>

          <div className="flex gap-1">

            
            <button
              onClick={() =>
                navigate("/customer-management/master/menu-submenu", {
                  state: {
                    parentId: node.identity,
                    parentMenuCode: node.id,
                    parentMenuName: node.name,
                    parentPath: currentFullPath,
                  },
                })
              }
              className="text-xs bg-blue-500 text-white px-2 py-1 rounded"
            >
              +
            </button>

         
            <button
              onClick={() => {
                setSelectedNode(node)
                setEditedName(node.name)
                setIsModalOpen(true)
              }}
              className="text-xs bg-blue-500 text-white px-2 py-1 rounded"
            >
              <Edit size={12} />
            </button>

          </div>
        </div>

        {hasChildren && expanded && (
          <div className="ml-6">
            {node.children.map((child, index) => {
              const isLast = index === node.children.length - 1

              return (
                <div key={child.id} className="relative pl-6">

                  <span
                    className={`absolute left-0 top-0 border border-gray-800 ${
                      isLast ? "h-6" : "h-full"
                    }`}
                  />

                  <span className="absolute left-0 top-6 w-6 border border-gray-800" />

                  {renderNode(child, currentFullPath)}

                </div>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="p-4">

      {treeData.map((node) => renderNode(node))}

  
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center">

          <div className="bg-white p-4 rounded shadow-lg border w-80">

            <h2 className="text-sm font-semibold mb-2">
              Edit Menu Name
            </h2>

            <input
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              className="border w-full px-2 py-1 text-sm rounded"
            />

            <div className="flex justify-end gap-2 mt-3">

              <button
                onClick={() => setIsModalOpen(false)}
                className="px-3 py-1 text-xs bg-gray-300 rounded"
              >
                Cancel
              </button>

              <button
                className="px-3 py-1 text-xs bg-blue-500 text-white rounded"
              >
                Save
              </button>

            </div>
          </div>

        </div>
      )}

    </div>
  )
}

export default MenuTreeForm