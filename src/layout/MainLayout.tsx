import React from "react";
import { MultiLevelMenu } from "@/pages/home/components/menu";
import { toggleMenu, closeMenu } from "@/global/reducers/menu.reducer";
import menuicon from "@/assets/menuicon.png";
import { useGetMenuItemsQuery } from "@/global/service";
import userlogo from "@/assets/userlogo.png";
import type { RootState } from "@/global/store";
import { useAppDispatch, useAppSelector } from "@/hooks/store";
import { Header } from "@/pages/home/components/Header";
import { Footer } from "@/pages/home/components/Footer";
import { PageWrapper } from "@/components/ui";

interface DashboardLayoutProps {
  children: React.ReactNode;
  className?: string;
  isLayoutHidden?: boolean;
}

export function MainLayout({
  children,
  className,
  isLayoutHidden = false,
}: DashboardLayoutProps) {
  const dispatch = useAppDispatch();

  const { isOpen: isMenuOpen, userRating } = useAppSelector(
    (state: RootState) => state.menu
  );
  const { data: menuData, isLoading } = useGetMenuItemsQuery();

  const handleToggleMenu = () => dispatch(toggleMenu());
  const handleCloseMenu = () => dispatch(closeMenu());

  return (
    <section className={`flex min-h-screen flex-col ${className || ""}`}>
      <Header />

      <main className="flex-1 overflow-y-auto pt-12 pb-10 lg:pt-14">
        {isLayoutHidden ? (
          children
        ) : (
          <PageWrapper variant="default" padding="xl" maxWidth="xl">
            {children}
          </PageWrapper>
        )}
      </main>

      <Footer
        onMenuToggle={handleToggleMenu}
        menuButtonClassName="menu-trigger menu-system"
        menuIcon={menuicon}
      />

      {!isLoading && menuData?.menu && (
        <MultiLevelMenu
          isOpen={isMenuOpen}
          onClose={handleCloseMenu}
          triggerClassName=".menu-trigger"
          menuItems={menuData.menu}
          userRating={userRating}
          companyName="incede"
          userImage={userlogo}
        />
      )}
    </section>
  );
}
