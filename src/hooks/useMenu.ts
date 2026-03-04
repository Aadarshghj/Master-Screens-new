import { useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import type { MenuItem } from "@/types";

type ActiveMenus = {
  [level: number]: {
    items: MenuItem[];
    position: { x: number; y: number };
  };
};

const MENU_CONFIG = {
  width: 280,
  itemHeight: 55,
  padding: 16,
  minMargin: 10,
  hoverDelay: 200,
  submenuOffset: 8,
} as const;

export const useMenu = () => {
  const [activeMenus, setActiveMenus] = useState<ActiveMenus>({});
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

  const clearHoverTimeout = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  }, []);

  const calculatePosition = useCallback(
    (rect: DOMRect, menuHeight: number, isSubmenu = false) => {
      const { innerWidth: vw, innerHeight: vh } = window;

      let x = isSubmenu ? rect.right + 8 : rect.left;
      let y = isSubmenu ? rect.top : rect.bottom + 8;

      if (x + MENU_CONFIG.width > vw) {
        x = isSubmenu
          ? rect.left - MENU_CONFIG.width - 8
          : Math.max(10, vw - MENU_CONFIG.width - 10);
      }

      if (y + menuHeight > vh) {
        y = isSubmenu
          ? Math.max(10, vh - menuHeight - 10)
          : rect.top - menuHeight - 8;
      }

      return {
        x: Math.max(10, Math.min(x, vw - MENU_CONFIG.width - 10)),
        y: Math.max(10, Math.min(y, vh - menuHeight - 10)),
      };
    },
    []
  );

  const openMenu = useCallback(
    (menuItems: MenuItem[]) => {
      if (!menuItems?.length) return;

      // Get the trigger element using the class selector
      const triggerElement = document.querySelector(
        ".menu-trigger"
      ) as HTMLElement;
      if (!triggerElement) {
        return;
      }

      const rect = triggerElement.getBoundingClientRect();
      const menuHeight =
        menuItems.length * MENU_CONFIG.itemHeight + MENU_CONFIG.padding;
      const position = calculatePosition(rect, menuHeight);

      setActiveMenus({ 0: { items: menuItems, position } });
    },
    [calculatePosition]
  );

  const closeMenu = useCallback(() => {
    clearHoverTimeout();
    setActiveMenus({});
  }, [clearHoverTimeout]);

  const removeMenusAboveLevel = useCallback((level: number) => {
    setActiveMenus(prev => {
      const filtered = Object.fromEntries(
        Object.entries(prev).filter(([key]) => parseInt(key) <= level)
      );
      return filtered;
    });
  }, []);

  const handleItemHover = useCallback(
    (item: MenuItem | null, level: number, event?: React.MouseEvent) => {
      clearHoverTimeout();

      if (!item?.children?.length) {
        hoverTimeoutRef.current = setTimeout(() => {
          removeMenusAboveLevel(level);
        }, MENU_CONFIG.hoverDelay);
        return;
      }

      if (!event) return;

      const rect = event.currentTarget.getBoundingClientRect();
      const submenuHeight =
        item.children.length * MENU_CONFIG.itemHeight + MENU_CONFIG.padding;
      const position = calculatePosition(rect, submenuHeight, true);

      setActiveMenus(prev => {
        const newMenus = { ...prev };
        Object.keys(newMenus).forEach(key => {
          if (parseInt(key) > level) delete newMenus[parseInt(key)];
        });
        newMenus[level + 1] = { items: item.children!, position };
        return newMenus;
      });
    },
    [clearHoverTimeout, removeMenusAboveLevel, calculatePosition]
  );

  const handleItemClick = useCallback(
    (item: MenuItem) => {
      if (!item.children?.length && item.path) {
        navigate(item.path);
        closeMenu();
      }
    },
    [navigate, closeMenu]
  );

  return {
    activeMenus,
    openMenu,
    closeMenu,
    handleItemHover,
    handleItemClick,
  };
};
