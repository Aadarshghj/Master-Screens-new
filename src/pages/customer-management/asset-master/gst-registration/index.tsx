import React, { useState } from "react";
import { PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Breadcrumb,
  TitleHeader,
  type BreadcrumbItem,
  PageWrapper,
} from "@/components";
import { useGstRegistrationForm } from "./components/hooks/useGstRegistrationForm";
import { GstRegistrationForm } from "./components/Form/GstRegistrationForm";
import { GstRegistrationTable } from "./components/Table/GstRegistrationTable";
import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button";

export const GstRegistrationPage: React.FC = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);

  const {
    control,
    onSubmit,
    handleSubmit,
    onReset,
    onCancel,
    register,
    errors,
    isSubmitting,
  } = useGstRegistrationForm();

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Home", href: "/", onClick: () => navigate("/") },
    {
      label: "Asset Management System",
      href: "/asset-management-system",
      onClick: () => navigate("/asset-management-system"),
    },
    {
      label: "GST Registration",
      active: true,
    },
  ];

  const handleShowForm = () => {
    setShowForm(true);
  };

  const handleHideForm = () => {
    onCancel();
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <PageWrapper variant="default" padding="xl" maxWidth="xl" contentPadding="sm" className="m-0 min-h-fit pb-4">
        <section className="p-4 lg:p-8 xl:p-10">
          <Breadcrumb items={breadcrumbItems} variant="default" size="sm" />
          <div className="flex items-center justify-between">
            <TitleHeader title="GST Registration" className="py-4" />
            <NeumorphicButton type="button" variant="default" size="default" onClick={handleShowForm}>
              <PlusCircle width={13} />
              Add GST Registration
            </NeumorphicButton>
          </div>

          {showForm && (
            <div className="mb-6 rounded-lg border bg-white p-6 shadow-sm">
              <GstRegistrationForm
                control={control}
                register={register}
                errors={errors}
                isSubmitting={isSubmitting}
                onSubmit={handleSubmit(onSubmit)}
                onCancel={handleHideForm}
                onReset={onReset}
              />
            </div>
          )}
        </section>


        <section className="p-4 lg:p-8 xl:p-10">
          {/* <TitleHeader className="pb-4" 
          title="List of GST Registrations" 
          /> */}
          <GstRegistrationTable />
        </section>
      </PageWrapper>
    </div>
  );
};