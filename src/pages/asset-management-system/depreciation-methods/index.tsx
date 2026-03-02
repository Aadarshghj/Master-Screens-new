import React, { useState } from "react";
import { PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Breadcrumb,
  TitleHeader,
  type BreadcrumbItem,
  PageWrapper,
} from "@/components";
import { useDepreciationMethodsForm } from "./components/Hooks/useDepreciationMethodsForm";
import { DepreciationMethodsForm } from "./components/Form/DepreciationMethodsForm";
import { DepreciationMethodsTable } from "./components/Table/DepreciationMethodsTable";
import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button";

export const DepreciationMethodsPage: React.FC = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const {
    control,
    register,
    handleSubmit,
    isSubmitting,
    onSubmit,
    onCancel,
    onReset,
    errors,
  } = useDepreciationMethodsForm();

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Home", href: "/", onClick: () => navigate("/") },
    

    {
      label: "Asset Management System",
      href: "/asset-management",
      onClick: () => navigate("/asset-management"),
    },
    { label: "Depreciation Methods", active: true },
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
            <TitleHeader title="Depreciation Methods" className="py-4" />
            <NeumorphicButton
              type="button"
              variant="default"
              size="default"
              onClick={handleAddClick}
            >
              <PlusCircle className="mr-1 h-3 w-3" />
              Add Deprecition Methods
            </NeumorphicButton>
          </div>

          {showForm && (
             <div className="mt-3 pb-7 rounded-lg border border-gray-300 bg-white p-6 shadow-sm">
            <DepreciationMethodsForm 
                errors={errors}
                control={control}
              register={register}
              isSubmitting={isSubmitting}
              onSubmit={handleSubmit(onSubmit)}
              onCancel={handleCancelClick}
              onReset={onReset}
              isEditMode={true}
            />
            </div>
          )}
        </section>
   <section className="px-8 pb-3 ">
          <DepreciationMethodsTable/>
        </section>
      </PageWrapper>


    </div>
  );
};
