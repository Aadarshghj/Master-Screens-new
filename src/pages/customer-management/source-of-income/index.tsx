import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Breadcrumb,
  ConfirmationModal,
  PageWrapper,
  TitleHeader,
  type BreadcrumbItem,
} from "@/components";
import { PlusCircle } from "lucide-react";
import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button";

import { SourceOfIncomeForm } from "./components/Form/SourceOfIncomeForm";
import { SourceOfIncomeTable } from "./components/Table/SourceOfIncomeTable";
import { useSourceOfIncomeFormController } from "./components/hooks/useSourceOfIncomeForm";
import type { SourceOfIncomeData } from "@/types/customer-management/source-income";

export const SourceOfIncomePage: React.FC = () => {
  const formRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  const [showForm, setShowForm] = useState(false);
  const [selectedRow, setSelectedRow] =
    useState<SourceOfIncomeData | null>(null);

  const {
    tableData,
    register,
    handleSubmit,
    errors,
    isSubmitting,
    onSubmit,
    onReset,
    handleDelete,
    showDeleteModal,
    handleCancelDelete,
    handleConfirmDelete,
    isLoading,
    reset,
  } = useSourceOfIncomeFormController(selectedRow ?? undefined);

  const handleShowForm = () => {
    setShowForm(true);
  };

  const handleCancelClick = () => {
    onReset();
    setSelectedRow(null);
    setShowForm(false);
  };

  const onEdit = (data: SourceOfIncomeData) => {
    setSelectedRow(data);
    setShowForm(true);
    reset({
    name: data.name,
    code: data.code,
  });


    setTimeout(() => {
      formRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }, 100);
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
    { label: "Source of Income", active: true },
  ];

  return (
    <div className="space-y-6">
      <ConfirmationModal
        isOpen={showDeleteModal}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        title="Delete"
        message="Are you Sure you want to delete source of income."
        confirmText="Delete"
        cancelText="Cancel"
        type="error"
        size="compact"
      />


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
            <TitleHeader title="Source of Income" className="py-4" />

            <NeumorphicButton
              type="button"
              variant="default"
              size="default"
              onClick={handleShowForm}
            >
              <PlusCircle width={13} />
              Add Source of Income
            </NeumorphicButton>
          </div>

          {showForm && (
            <div ref={formRef}>
              <SourceOfIncomeForm
                register={register}
                errors={errors}
                isSubmitting={isSubmitting}
                onSubmit={handleSubmit(onSubmit)}
                onCancel={handleCancelClick}
                onReset={onReset}
                isEdit={!!selectedRow}
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
          <TitleHeader
            className="pb-4"
            title="List of Source of Income"
          />

          <SourceOfIncomeTable
            data={tableData ?? []}
            isLoading={isLoading}
            handleDelete={handleDelete}
            onEdit={onEdit}
          />
        </section>
      </PageWrapper>
    </div>
  );
};