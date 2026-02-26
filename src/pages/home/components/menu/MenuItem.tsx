import React from "react";
import { ChevronRight } from "lucide-react";
import type { MenuItem as MenuItemType } from "@/types";
import { iconMap } from "./iconMap";

interface MenuItemProps {
  item: MenuItemType;
  level: number;
  onItemHover: (
    item: MenuItemType | null,
    level: number,
    event?: React.MouseEvent
  ) => void;
  onItemClick: (item: MenuItemType) => void;
}

export const MenuItem: React.FC<MenuItemProps> = ({
  item,
  level,
  onItemHover,
  onItemClick,
}) => {
  const IconComponent = iconMap[item.icon];
  const hasChildren = item.children && item.children.length > 0;

  return (
    <div
      className="group text-card hover:bg-card hover:text-primary mx-1 flex cursor-pointer items-center justify-between rounded px-2 py-1.5 transition-colors"
      onMouseEnter={e => onItemHover(item, level, e)}
      onClick={() => !hasChildren && onItemClick(item)}
    >
      <div className="flex items-center space-x-2">
        {IconComponent && <IconComponent className="h-4 w-4" />}
        <span className="text-xs font-medium">{item.title}</span>
      </div>
      {hasChildren && <ChevronRight className="h-3 w-3" />}
    </div>
  );
};
