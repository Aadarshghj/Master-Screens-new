import React, { useState, useRef } from "react";
import { PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  Breadcrumb,
  TitleHeader,
  type BreadcrumbItem,
  PageWrapper,
} from "@/components";

import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button";

import type { SupplierFormType } from "@/types/asset-management-system/supplier-management/supplier-list";

import { SupplierListForm } from "./components/Form/SupplierListForm";
import { SupplierTable } from "./components/Table/SupplierTable";
import { useSupplierForm } from "./components/Hooks/UseSupplierListForm";

export const SupplierListPage: React.FC = () => {
  const navigate = useNavigate();

  const [showForm, setShowForm] = useState(false);
  const [selectedRow, setSelectedRow] = useState<SupplierFormType | null>(null);

  const formRef = useRef<HTMLDivElement>(null);

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
    setIsEdit,
  } = useSupplierForm(selectedRow ?? undefined);

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Home", href: "/", onClick: () => navigate("/") },
    {
      label: "Customer Management System",
      href: "/customer",
      onClick: () => navigate("/customer"),
    },
    {
      label: "Asset Master",
      href: "/customer-management/asset-master",
      onClick: () => navigate("/customer-management/asset-master"),
    },
    { label: "Supplier Master", active: true },
  ];

  const handleShowForm = () => {
    setSelectedRow(null);
    setIsEdit(false);
    reset();
    setShowForm(true);
  };

  const handleHideForm = () => {
    onCancel();
    setIsEdit(false);
    setShowForm(false);
  };

  const onEdit = (row: SupplierFormType) => {
    setSelectedRow(row);
    reset(row);
    setIsEdit(true);
    setShowForm(true);

    setTimeout(() => {
      formRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }, 70);
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
        <section className="p-4 lg:p-4 xl:p-10 xl:pb-1">
          <Breadcrumb items={breadcrumbItems} variant="default" size="sm" />

          <div className="flex items-center justify-between">
            <TitleHeader title="Supplier List Master" className="py-4" />

            <NeumorphicButton
              type="button"
              variant="default"
              size="default"
              onClick={handleShowForm}
            >
              <PlusCircle width={13} />
              Add Supplier
            </NeumorphicButton>
          </div>

          {showForm && (
            <div
              ref={formRef}
              className="border-blue-10 mt-7 rounded-lg border bg-gray-100 p-5"
            >
              <SupplierListForm
                control={control}
                register={register}
                errors={errors}
                isEdit={isEdit}
                isSubmitting={isSubmitting}
                onSubmit={handleSubmit(onSubmit)}
                onCancel={handleHideForm}
                onReset={onReset}
              />
            </div>
          )}
        </section>

        <section className="p-4 lg:p-8 xl:p-10 xl:pt-4">
          <SupplierTable onEdit={onEdit} />
        </section>
      </PageWrapper>
    </div>
  );
};
