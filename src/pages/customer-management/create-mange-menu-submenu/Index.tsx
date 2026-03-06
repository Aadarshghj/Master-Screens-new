import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import {
  Breadcrumb,
  TitleHeader,
  type BreadcrumbItem,
  PageWrapper,
} from "@/components";
import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button";

import { MenuSubmenuForm } from "./components/Form/MenuSubmenuForm";
import { MenuSubmenuTable } from "./components/Table/MenuSubmenuTable";
import { useMenuSubMenu } from "./components/Hooks/useMenuSubmenu";
import type { menuSubmenu } from "@/types/customer-management/create-manage-menus-submenu.type";
import { useLazyGetMenuSubmenuByIdQuery } from "@/global/service/end-points/customer-management/create-update-menu-submenu";

export const MenuSubmenuPage: React.FC = () => {
  const navigate = useNavigate();
  const [showForm, setShowform] = useState(true);
  const formRef = useRef<HTMLDivElement | null>(null)
  const [selectedRow, setSelectedRow] = useState<menuSubmenu | null>(
    null
  );
  const [fetchMenuId] = useLazyGetMenuSubmenuByIdQuery()
  const {
    control,
    register,
    handleSubmit,
    errors,
    isSubmitting,
    onSubmit,
    onReset,
    onCancel,
    reset

  } = useMenuSubMenu(selectedRow ?? undefined);

  const handleShowForm = () => {
    setSelectedRow(null)
    reset()
    setShowform(true)
  }
  const handleCancelClick = () => {
    onCancel()
    setSelectedRow(null)
    setShowform(false)
  }


  const onEdit = async (data: menuSubmenu) => {
    try {
      const response = await fetchMenuId(data.menuIdentity).unwrap();

      const result = Array.isArray(response) ? response[0] : response;

      if (!result) {
        console.error("No record found");
        return;
      }

      setSelectedRow(result);
      setShowform(true);
      reset(result);

      requestAnimationFrame(() => {
        formRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      });
    } catch (error) {
      console.error("Failed to fetch record:", error);
    }
  };

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Home", href: "/", onClick: () => navigate("/") },
    {
      label: "Customer Management System",
      href: "/customer",
      onClick: () => navigate("/customer"),
    },
    {
      label: "Master",
      href: "/customer/master",
      onClick: () => navigate("/customer/master"),
    },
    { label: "Menus and Sub-Menus", active: true },
  ];

  return (
    <div className="space-y-6">
      <PageWrapper
        variant="default"
        padding="xl"
        maxWidth="xl"
        contentPadding="sm"
        className="m-0 min-h-fit "
      >
        <section className="p-4 lg:p-8 xl:p-10">
          <Breadcrumb items={breadcrumbItems} variant="default" size="sm" />

          <div className="flex items-center justify-between">
            <TitleHeader title="Menus and Sub-Menus" className="py-4" />
            <section>

          <NeumorphicButton
  type="button"
  variant="default"
  size="default"
  className="mx-2"
  onClick={() =>
    navigate("/customer-management/master/menu-submenu-tree", { replace: true })
  }
>
  <PlusCircle width={13} />
  View Menu
</NeumorphicButton>
              <NeumorphicButton
                type="button"
                variant="default"
                size="default"
                onClick={handleShowForm}
              >
                <PlusCircle width={13} />
                Add Menu Sub-Menu
              </NeumorphicButton>
            </section>

          </div>

          {showForm && (
            <MenuSubmenuForm
              control={control}
              register={register}
              errors={errors}
              isSubmitting={isSubmitting}
              onSubmit={handleSubmit(onSubmit)}
              onCancel={handleCancelClick}
              onReset={onReset}
              isEdit={!!selectedRow}

            />
          )}

        </section>

      </PageWrapper>

      <PageWrapper
        variant="default"
        padding="xl"
        maxWidth="xl"
        contentPadding="sm"
        className="pt-0"
      >
        <section className="p-4 lg:p-8 xl:p-10">
          <TitleHeader className="pb-4" title="List of Menu" />

          <MenuSubmenuTable onEdit={onEdit} />
        </section>
      </PageWrapper>

    </div>
  );
}