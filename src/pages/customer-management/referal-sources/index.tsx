import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Breadcrumb,
  PageWrapper,
  TitleHeader,
  type BreadcrumbItem,
} from "@/components";
import { useReferralSourceForm } from "./components/Hooks/useReferralSources";
import { ReferralSourceForm } from "./components/Form/ReferralSourcesForm";
import { ReferralSourceTable } from "./components/Table/ReferralSourcesTable";
import { PlusCircle } from "lucide-react";
import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button";

export const ReferralSourcesPage: React.FC = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    onSubmit,
    onCancel,
    onReset,
  } = useReferralSourceForm();

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
    { label: "Referral Sources", active: true },
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
            <TitleHeader title="Referral Sources" className="py-4" />
            <NeumorphicButton
              type="button"
              variant="default"
              size="default"
              onClick={handleAddClick}
            >
              <PlusCircle className="mr-1 h-3 w-3" />
              Add Referral Sources
            </NeumorphicButton>
          </div>

          {showForm && (
            <ReferralSourceForm
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
          <TitleHeader className="pb-4" title="List of Referral Sources" />
          <ReferralSourceTable />
        </section>
      </PageWrapper>
    </div>
  );
};
