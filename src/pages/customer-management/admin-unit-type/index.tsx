import React, { useState, useRef } from "react";
import { PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Breadcrumb,
  TitleHeader,
  type BreadcrumbItem,
  PageWrapper,
} from "@/components";
import { useAdminUnitForm } from "./components/hooks/useAdminUnitTypeForm";
import { AdminUnitTypeForm } from "./components/Form/AdminUnitTypeForm";
import { AdminUnitTypeTable } from "./components/Table/AdminUnitTypeTable";
import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button";
import type { AdminUnitType } from "@/types/customer-management/admin-unit-type";
import { useLazyGetAdminUnitByIdQuery } from "@/global/service/end-points/customer-management/admin-unit-type.api";

export const AdminUnitTypePage: React.FC = () => {
  const navigate = useNavigate();
  const [ showForm, setShowForm ] = useState(false);
  const [selectedRow, setSelectedRow] = useState<AdminUnitType | null>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const [ fetchAdminUnitById ] = useLazyGetAdminUnitByIdQuery();

  const {
    control,
    reset,
    onSubmit,
    handleSubmit,
    onReset,
    isEdit,
    onCancel,
    register,
    errors,
    isSubmitting,
    setIsEdit
  } = useAdminUnitForm(selectedRow ?? undefined);

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
    { label: "Admin Unit Type", active: true },
  ];

  const handleShowForm = () => {
    setShowForm(true);
  };

  const handleHideForm = () => {
    onCancel();
    setIsEdit(false);
    console.log(isEdit);
    setShowForm(false);
  };

  const onEdit = async (identity: string) => {
    try {
      const response = await fetchAdminUnitById(identity).unwrap();
      setSelectedRow(response);
      reset(response);
      setShowForm(true);
      setIsEdit(true);

      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
      }, 70);
    } catch (error) {
      console.error("Failed to fetch admin unit by ID", error);
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
            <TitleHeader title="Admin Unit Type" className="py-4" />
            <NeumorphicButton
              type="button"
              variant="default"
              size="default"
              onClick={handleShowForm}
            >
              <PlusCircle width={13} />
              Add Admin Unit Type
            </NeumorphicButton>
          </div>

          {showForm && (
            <div ref = {formRef}>
            <AdminUnitTypeForm
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
          <TitleHeader className="pb-4" title="List of Admin Unit Type" />
          <AdminUnitTypeTable  
             onEdit = {onEdit} 
            />
        </section>
      </PageWrapper>
    </div>
  );
};
