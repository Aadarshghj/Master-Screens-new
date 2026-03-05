import React, { useState,useRef } from "react";
import { PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Breadcrumb,
  TitleHeader,
  type BreadcrumbItem,
  PageWrapper,
} from "@/components";

import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button";
// import { string } from "yup";
import type { TdsSectionTypes } from "@/types/customer-management/asset-master/tds-section";
import { TdsSectionTable } from "./components/Table/TdsSectionTable";
import { TdsSectionForm } from "./components/Form/TdsSectionForm";
import { useTdsSectionForm } from "./components/Hook/useTdsSectionForm";

export const TdsSectionPage: React.FC = () => {
  const formRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
const [showForm, setShowForm] = useState(false);
const [selectedRow, setSelectedRow] = useState<TdsSectionTypes | null>(null);

  const {
    control,
    register,
    handleSubmit,
    errors,
    isSubmitting,
    onSubmit,
    onReset,
    onCancel,
    reset,
  } = useTdsSectionForm();


   const handleShowForm = () => {
    setShowForm(true);
  };
  const handleCancelClick =()=>{
    onCancel();
    setSelectedRow(null);
    setShowForm(false);
  }
 const onEdit = (data: TdsSectionTypes) => {
  setSelectedRow(data);
  setShowForm(true);
  reset(data);

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
      label: "Asset Management System",
      href: "/asset-management",
      onClick: () => navigate("/asset-management"),
    },
    
    { label: "TDS Section ", active: true },
  ];

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
            <TitleHeader title="TDS Section" className="py-4" />

            <NeumorphicButton
              type="button"
              variant="default"
              size="default"
              onClick={handleShowForm}
            >
              <PlusCircle width={13} />
              Add TDS Section Type
            </NeumorphicButton>
          </div>

          {showForm && (
            <div ref={formRef}>
              <TdsSectionForm
              control={control}
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
            title="List of TDS Section"
          />

          <TdsSectionTable
          // openDeleteModal={openDeleteModal} 
          onEdit={onEdit}/>
        </section>
      </PageWrapper>
    </div>
  );
};
