
import MenuTreeForm from "./components/Form/MenuTreeTreeForm"
import { menuTreeData } from "./constants/menuTreeData"

const MenuTreePage = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md w-full">
      <h2 className="text-lg font-semibold">
        Menu SubMenu Tree
      </h2>
      <MenuTreeForm data={menuTreeData} />
    </div>
  )
}
export default MenuTreePage