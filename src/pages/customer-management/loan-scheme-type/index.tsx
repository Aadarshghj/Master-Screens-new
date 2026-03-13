import React, { useState } from "react";
import { PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Breadcrumb,
  TitleHeader,
  type BreadcrumbItem,
  PageWrapper,
} from "@/components";
import { useLoanSchemeTypeForm } from "./components/Hooks/useLoanSchemeTypeForm";
import { LoanSchemeTypeForm } from "./components/Form/LoanSchemeTypeForm";
import { LoanSchemeTypeTable } from "./components/Table/LoanSchemeTypeTable";
import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button";
import type { LoanSchemeTypeResponseDto } from "@/types/customer-management/loan-scheme-type";

export const LoanSchemeTypePage: React.FC = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);

  const {
    register,
    handleSubmit,
    isSubmitting,
    onSubmit,
    onCancel,
    onReset,
    errors,
    control,
    reset,
  } = useLoanSchemeTypeForm();

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
      { label: "Loan Scheme Type", active: true },
    ];

  const handleAddClick = () => {
    setShowForm(true);
  };

  const handleCancelClick = () => {
    onCancel();
    setShowForm(false);
  };
  const handleEditClick = (row: LoanSchemeTypeResponseDto) => {
  
    reset({
      id: row.identity,
      schemeTypeName: row.schemeTypeName,      
      description: row.description, 
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
            <TitleHeader title="Loan Scheme Type" className="py-4" />
            <NeumorphicButton
              type="button"
              variant="default"
              size="default"
              onClick={handleAddClick} 
            >
              <PlusCircle className="mr-1 h-3 w-3" />
              Add Loan Scheme Type
            </NeumorphicButton>
          </div>

          {showForm && (
             <div className="mt-3 pb-7 rounded-lg border border-gray-300 bg-white p-6 shadow-sm">
            <LoanSchemeTypeForm 
              register={register}
              isSubmitting={isSubmitting}
              onSubmit={handleSubmit(onSubmit)}
              onCancel={handleCancelClick}
              onReset={onReset}
              errors={errors}
              control={control}
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
   <section className="p-4 lg:p-8 xl:p-10 ">
              <TitleHeader className="pb-4" title="List of Loan Scheme Type" />
    
          <LoanSchemeTypeTable onEdit={handleEditClick}/>
        </section>
      </PageWrapper>
    </div>
  );
};


