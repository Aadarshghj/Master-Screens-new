// export interface MenuItem {
//   identity?: string      
//   menuIdentity?: string  
//   id?: string            
//   menuName: string
//   menuCode: string
//   pageUrl?: string
//   parent?: ParentMenu | null
// }

// export interface ParentMenu {
//   identity: string
//   menuCode: string
// }
export interface TreeNode {
  id: string
  identity: string
  name: string
  path?: string
  children: TreeNode[]
}