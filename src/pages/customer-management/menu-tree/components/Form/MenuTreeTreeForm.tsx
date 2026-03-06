import React from "react"
import type { TreeNode } from "../../constants/menuTreeData"
import { useMenuTree } from "../Hooks/menuTree"
import { CiCircleMinus } from "react-icons/ci";
import { CiCirclePlus } from "react-icons/ci";
import { useNavigate } from "react-router-dom";

interface Props {
  data: TreeNode[]
}

const MenuTreeForm: React.FC<Props> = ({ data }) => {
  const { toggleNode, isExpanded } = useMenuTree()
  const navigate = useNavigate()
  const renderNode = (node: TreeNode) => {
    const hasChildren = node.children && node.children.length > 0
    const expanded = isExpanded(node.id)

    return (

      <div key={node.id} className="ml-6 mt-3">
        <div

          onClick={() => {
            if (hasChildren) {
              toggleNode(node.id)
            } else {
              navigate("/customer-management/master/menu-submenu")
            }
          }}
          className="flex items-center gap-2 bg-indigo-100 hover:bg-indigo-200
  text-xs px-4 py-1 rounded-md w-60 cursor-pointer text-black "
        >

          {hasChildren && (
            <span className="font-bold text-xs ">
              {expanded ? <CiCircleMinus style={{ color: "blue", fontSize: "15px" }} /> : <CiCirclePlus style={{ color: "blue", fontSize: "15px" }} />}
            </span>
          )}

          <span>{node.name}</span>
        </div>

        {hasChildren && expanded && (
          <div className="ml-4 border-l border-gray-800 pl-4">
            {node.children?.map((child) => (
              <div key={child.id} className="relative flex items-center">
                <span className="absolute -left-4 w-4 border-t border-gray-800"></span>
                <span className="absolute-"></span>
                {renderNode(child)}
              </div>
            ))}
          </div>
        )}
      </div>
    )
  } 
  return <div className="p-4">{data.map(renderNode)}</div>
}
export default MenuTreeForm
