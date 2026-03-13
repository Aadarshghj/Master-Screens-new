import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle } from "lucide-react";

import {
  Breadcrumb,
  TitleHeader,
  type BreadcrumbItem,
  PageWrapper,
} from "../../../components";

import NeumorphicButton from "../../../components/ui/neumorphic-button/neumorphic-button";

import { OrnamentTypeMasterTable } from "./components/Table/OrnamentTypeMasterTable";
import type { OrnamentType } from "@/types/customer-management/ornament-type";

import { OranmentTypeForm } from "./components/Form/OrnamentTypeMasterForm";
import { useOrnamentTypeMasterForm } from "./components/Hooks/useOrnamentTypeMasterForm";
import { useOrnamentTypeMasterTable } from "./components/Hooks/useOrnamentTypeMasterTable";

export const OrnamentTypePage: React.FC = () => {
  const navigate = useNavigate();

  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const form = useOrnamentTypeMasterForm(() => setShowForm(false));

  const table = useOrnamentTypeMasterTable();

  const formRef = useRef<HTMLDivElement | null>(null);

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
    { label: "Ornament Type", active: true },
  ];

  const handleAddClick = () => {
    setIsEdit(false);
    form.onReset();
    setShowForm(true);
  };

  const handleCancelClick = () => {
    form.onCancel();
    setShowForm(false);
  };

  const onEdit = (data: OrnamentType) => {
    setIsEdit(true);
    setShowForm(true);

    form.reset(data);

    setTimeout(() => {
      formRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 100);
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
            <TitleHeader title="Ornament Type Master" className="py-4" />

            <NeumorphicButton
              type="button"
              variant="default"
              size="default"
              onClick={handleAddClick}
            >
              <PlusCircle className="mr-1 h-3 w-3" />
              Add Ornament Type
            </NeumorphicButton>
          </div>

          {showForm && (
            <div ref={formRef}>
              <OranmentTypeForm
                control={form.control}
                register={form.register}
                errors={form.errors}
                isSubmitting={form.isSubmitting}
                onSubmit={form.handleSubmit(form.onSubmit)}
                onCancel={handleCancelClick}
                onReset={form.onReset}
                isEdit={isEdit}
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
        className="pt-0"
      >
        <section className="p-4 lg:p-8 xl:p-10">
          <TitleHeader className="pb-4" title="List of Ornament Types" />

          <OrnamentTypeMasterTable
            data={table.data || []}
            onEdit={onEdit}
            onDelete={table.openDeleteModal}
            showDeleteModal={table.showDeleteModal}
            confirmDelete={table.confirmDeleteOrnamentType}
            closeDeleteModal={table.closeDeleteModal}
          />
        </section>
      </PageWrapper>
    </div>
  );
};

export default OrnamentTypePage;