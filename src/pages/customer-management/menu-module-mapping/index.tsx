import React, { useState } from "react";
import { PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Breadcrumb,
  TitleHeader,
  type BreadcrumbItem,
  PageWrapper,
} from "@/components";

import { useMenuModuleMappingForm } from "./components/Hooks/useMenuModuleMappingForm";
import { MenuModuleMappingForm } from "./components/Form/MenuModuleMappingForm";
import { MenuModuleMappingTable } from "./components/Table/MenuModuleMappingTable";
import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button";
import type { MenuModuleMappingResponseDto } from "@/types/customer-management/menu-module-mapping";

export const MenuModuleMappingPage: React.FC = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
const {
  control,
  register,
  handleSubmit,
  errors,
  isSubmitting,
  onSubmit,
  onCancel,
  onReset,
  menuNameOptions,
  moduleNameOptions,
  reset,
} = useMenuModuleMappingForm();


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
    { label: "Menu Module Mapping", active: true },
  ];

  const handleAddClick = () => {
    setShowForm(true);
  };

  const handleCancelClick = () => {
    onCancel();
    setShowForm(false);
  };
  
const handleEditClick = (row: MenuModuleMappingResponseDto) => {

  reset({
    id: row.identity,
    menuName: row.menuIdentity,      
    moduleName: row.moduleIdentity, 
    isActive: row.isActive,
  });

  setShowForm(true);
};

  return (
    <div className="space-y-6">
      <PageWrapper
        variant="default"
        padding="xl"
        maxWidth="xl"
        contentPadding="sm"
        className="m-0 min-h-fit pb-4"
      >
        <section className="p-4 lg:p-8 xl:p-10">
          <Breadcrumb items={breadcrumbItems} variant="default" size="sm" />

          <div className="flex items-center justify-between">
            <TitleHeader title="Menu Module Mapping" className="py-4" />
            <NeumorphicButton
              type="button"
              variant="default"
              size="default"
              onClick={handleAddClick}
            >
              <PlusCircle className="mr-1 h-3 w-3" />
              Add Menu Module
            </NeumorphicButton>
          </div>

          {showForm && (
            <MenuModuleMappingForm
              control={control}
              register={register}
              errors={errors}
              isSubmitting={isSubmitting}
              onSubmit={handleSubmit(onSubmit)}
              onCancel={handleCancelClick}
              onReset={onReset}
              menuNameOptions={menuNameOptions}
              moduleNameOptions={moduleNameOptions}
            />
          )}
        </section>
      </PageWrapper>

      <PageWrapper
        variant="default"
        padding="xl"
        maxWidth="xl"
        contentPadding="sm"
        className="pt-0 md:pt-0 lg:pt-0"
      > 
        <section className="p-4 lg:p-8 xl:p-10">
          <TitleHeader className="pb-4" title="List of Menu Module Mapping" />
          <MenuModuleMappingTable  menuNameOptions={menuNameOptions} moduleNameOptions={moduleNameOptions} onEdit={handleEditClick} />
        </section>
      </PageWrapper>
    </div>
  );
};
