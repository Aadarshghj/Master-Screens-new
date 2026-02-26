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
import { RiskAssessmentTypeHistoryForm } from "./components/Form/RiskAssessmentTypeHistoryForm";
import { RiskAssessmentTypeHistoryTable } from "./components/Table/RiskAssessmentTypeHistoryTable";
import { useRiskAssessmentType } from "./components/Hooks/useRiskAssessmentTypeHistoryForm";
// import { string } from "yup";
import type { RiskAssessmentTypeHistory } from "@/types/customer-management/risk-assessment-type-history";
// import { useLazyGetRiskAssessmentTypeByIdQuery } from "@/global/service/end-points/customer-management/risk-assessment-type";
// import { useRiskAssessmentTypeHistoryTable } from "./components/Hooks/useRiskAssessmentTypeHistoryTable";

export const RiskAssessmentTypeHistoryPage: React.FC = () => {
  const formRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  // const [fetchRiskAssessmentTypeById] = useLazyGetRiskAssessmentTypeByIdQuery();
const [showForm, setShowForm] = useState(false);
const [selectedRow, setSelectedRow] = useState<RiskAssessmentTypeHistory | null>(null);
// const isEdit = !!selectedRow;
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
    

  } = useRiskAssessmentType(selectedRow??undefined);

// const {
//   openDeleteModal
// } = useRiskAssessmentTypeHistoryTable();
   const handleShowForm = () => {
    setShowForm(true);
  };
  const handleCancelClick =()=>{
    onCancel();
    setSelectedRow(null);
    setShowForm(false);
  }
 const onEdit = (data: RiskAssessmentTypeHistory) => {
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
      label: "Customer Management System",
      href: "/customer",
      onClick: () => navigate("/customer"),
    },
    {
      label: "Master",
      href: "/customer/master",
      onClick: () => navigate("/customer/master"),
    },
    { label: "Risk Assessment Type", active: true },
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
            <TitleHeader title="Risk Assessment Type" className="py-4" />

            <NeumorphicButton
              type="button"
              variant="default"
              size="default"
              onClick={handleShowForm}
            >
              <PlusCircle width={13} />
              Add Risk Assessment Type
            </NeumorphicButton>
          </div>

          {showForm && (
            <div ref={formRef}>
              <RiskAssessmentTypeHistoryForm
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
            title="List of Risk Assessment Types"
          />

          <RiskAssessmentTypeHistoryTable
          // openDeleteModal={openDeleteModal} 
          onEdit={onEdit}/>
        </section>
      </PageWrapper>
    </div>
  );
};
