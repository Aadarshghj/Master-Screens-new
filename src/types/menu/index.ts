export interface MenuItem {
  id: string;
  title: string;
  icon: string;
  path?: string;
  children?: MenuItem[];
}

export interface MenuResponse {
  menu: MenuItem[];
}

// Menu Component Types
export interface MenuDropdownProps {
  items: MenuItem[];
  level: number;
  position: { x: number; y: number };
  onItemHover: (
    item: MenuItem | null,
    level: number,
    event?: React.MouseEvent
  ) => void;
  onItemClick: (item: MenuItem) => void;
  userRating?: number;
  companyName?: string;
  userImage?: string;
}
