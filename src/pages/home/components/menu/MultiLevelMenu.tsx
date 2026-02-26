import React, { useEffect } from "react";
import { MenuDropdown } from "./MenuDropdown";
import type { MenuItem } from "@/types";
import { useMenu } from "@/hooks/useMenu";
import useOutSideClick from "@/hooks/useOutSideClick";

interface MultiLevelMenuProps {
  isOpen: boolean;
  onClose: () => void;
  triggerClassName: string;
  menuItems: MenuItem[];
  userRating?: number;
  companyName?: string;
  userImage?: string;
}

export const MultiLevelMenu: React.FC<MultiLevelMenuProps> = ({
  isOpen,
  onClose,
  menuItems,
  userRating = 4.5,
  companyName = "incede",
  userImage,
}) => {
  const { activeMenus, openMenu, closeMenu, handleItemHover, handleItemClick } =
    useMenu();

  useOutSideClick({
    targetClassName: ".menu-system",
    actionState: isOpen,
    outSideClickCallback: onClose,
  });

  // Open menu when isOpen becomes true
  useEffect(() => {
    if (isOpen && menuItems?.length) {
      // You'll need to update your useMenu hook to not require a ref
      openMenu(menuItems);
    } else if (!isOpen) {
      closeMenu();
    }
  }, [isOpen, menuItems, openMenu, closeMenu]);

  if (!isOpen) return null;

  return (
    <div className="menu-container menu-system">
      {Object.entries(activeMenus).map(([level, menuData]) => (
        <MenuDropdown
          key={level}
          items={menuData.items}
          level={parseInt(level)}
          position={menuData.position}
          onItemHover={handleItemHover}
          onItemClick={handleItemClick}
          userRating={userRating}
          companyName={companyName}
          userImage={userImage}
        />
      ))}
    </div>
  );
};
