import React, { useState, useRef } from "react";
import { PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Breadcrumb,
  TitleHeader,
  type BreadcrumbItem,
  PageWrapper,
} from "@/components";
import { useModuleMgmtForm } from "./components/Hooks/useModuleMgmtForm";
import { ModuleTypeForm } from "./components/Form/ModuleMgmtForm";
import { ModuleMgmtTable } from "./components/Table/ModuleMgmtTable";
import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button";
import type { ModuleType } from "@/types/customer-management/module-management";
import { useLazyGetModuleByIdQuery } from "@/global/service/end-points/customer-management/module-management.api";

export const ModuleMgmtPage: React.FC = () => {
  const navigate = useNavigate();
  const [ showForm, setShowForm ] = useState(false);
  const [ selectedRow, setSelectedRow ] = useState<ModuleType | null>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const [ fetchModuleById ] = useLazyGetModuleByIdQuery();

  const {
    control,
    reset,
    onSubmit,
    handleSubmit,
    onReset,
    onCancel,
    register,
    errors,
    isSubmitting,
  } = useModuleMgmtForm(selectedRow ?? undefined);

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
    {
      label: "Module Management",
      active: true,
    },
  ];

  const handleShowForm = () => {
    setSelectedRow(null);
    setShowForm(true);
  };

  const handleHideForm = () => {
    onCancel();
    setSelectedRow(null);
    setShowForm(false);
  };

  const onEdit = async (moduleIdentity: string) => {
    try {
      const response = await fetchModuleById(moduleIdentity).unwrap();
      setSelectedRow(response);
      reset(response);
      setShowForm(true);
      setSelectedRow(response);

      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
      }, 70);
    } catch (error) {
      console.error("Failed to fetch Module by ID", error);
    }
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
            <TitleHeader title="Modules" className="py-4" />
            <NeumorphicButton
              type="button"
              variant="default"
              size="default"
              onClick={handleShowForm}
            >
              <PlusCircle width={13} />
              Add Module
            </NeumorphicButton>
          </div>

          {showForm && (
            <div ref = {formRef}>
            <ModuleTypeForm
              control={control}
              register={register}
              errors={errors}
              isEdit={!!selectedRow}
              isSubmitting={isSubmitting}
              onSubmit={handleSubmit(onSubmit)}
              onCancel={handleHideForm}
              onReset={onReset}
            />
            </div>
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
          <TitleHeader className="pb-4" title="List of Modules" />
          <ModuleMgmtTable  
             onEdit = {onEdit} 
            />
        </section>
      </PageWrapper>
    </div>
  );
};