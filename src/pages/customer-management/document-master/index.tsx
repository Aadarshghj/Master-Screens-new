import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Breadcrumb,
  PageWrapper,
  TitleHeader,
  type BreadcrumbItem,
} from "@/components";
import { useDocumentMaster } from "./components/Hooks/useDocMaster";
import { DocumentMasterForm } from "./components/Form/DocumentMasterForm";
import { DocumentMasterDetailsTable } from "./components/Table/DocumentMasterTable";
import { PlusCircle } from "lucide-react";
import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button";

export const DocumentMasterPage: React.FC = () => {
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
  } = useDocumentMaster();

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
    { label: "Document Master", active: true },
  ];

  const handleAddClick = () => {
    setShowForm(true);
  };

  const handleCancelClick = () => {
    onCancel();
    setShowForm(false);
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
            <TitleHeader title="Document Master" className="py-4" />
            <NeumorphicButton
              type="button"
              variant="default"
              size="default"
              onClick={handleAddClick}
            >
              <PlusCircle className="mr-1 h-3 w-3" />
              Add Document Master
            </NeumorphicButton>
          </div>

          {showForm && (
            <DocumentMasterForm
              control={control}
              register={register}
              errors={errors}
              isSubmitting={isSubmitting}
              onSubmit={handleSubmit(onSubmit)}
              onCancel={handleCancelClick}
              onReset={onReset}
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
          <TitleHeader className="pb-4" title="List of Document Masters" />
          <DocumentMasterDetailsTable />
        </section>
      </PageWrapper>
    </div>
  );
};
