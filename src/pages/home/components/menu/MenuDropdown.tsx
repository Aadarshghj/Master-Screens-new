import React from "react";
import { MenuHeader } from "./MenuHeader";
import { MenuItem as MenuItemComponent } from "./MenuItem";
import type { MenuDropdownProps } from "@/types";

export const MenuDropdown: React.FC<MenuDropdownProps> = ({
  items,
  level,
  position,
  onItemHover,
  onItemClick,
  userRating = 4.5,
  companyName = "incede",
  userImage,
}) => {
  const getDropdownStyle = () => {
    if (level === 0) {
      return {
        position: "fixed" as const,
        bottom: "1.9rem",
        left: "0rem",
        transform: "none",
        zIndex: 50,
      };
    } else {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      const leftVw = (position.x / viewportWidth) * 100;
      const topVh = (position.y / viewportHeight) * 100;

      const menuWidth = 12;
      const maxLeftVw = 100 - ((menuWidth * 100) / viewportWidth) * 16;

      return {
        position: "fixed" as const,
        left: `${Math.min(leftVw, maxLeftVw)}vw`,
        top: `${topVh}vh`,
        transform: "none",
        zIndex: 50,
      };
    }
  };

  return (
    <div
      className="bg-primary border-border  flex min-w-50 flex-col rounded-xs  border py-1 shadow-lg"
      style={getDropdownStyle()}
    >
      {level === 0 && (
        <div className="flex-shrink-0">
          <MenuHeader
            userRating={userRating}
            companyName={companyName}
            userImage={userImage}
          />
        </div>
      )}

      <div className="max-h-[70vh] overflow-y-auto pr-1">
        {items.map(item => (
          <MenuItemComponent
            key={item.id}
            item={item}
            level={level}
            onItemHover={onItemHover}
            onItemClick={onItemClick}
          />
        ))}
      </div>
    </div>
  );
};
