import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import {
  Breadcrumb,
  TitleHeader,
  type BreadcrumbItem,
  PageWrapper,
} from "@/components";
import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button";
import { useSupplierRisk } from "./components/Hooks/useSupplierRisk";
import { SupplierRiskForm } from "./components/Form/SupplierRiskForm";
import { SupplierRiskTable } from "./components/Table/SupplierRiskTable";

export const SupplierRiskPage: React.FC = () => {
  const navigate = useNavigate();
  const [showForm, setShowform] = useState(false);
  const {
    control,
    register,
    handleSubmit,
    errors,
    isSubmitting,
    onSubmit,
    onReset,
    onCancel

  } = useSupplierRisk();

  const handleShowForm = () => {
    setShowform(true)
  }
  const handleCancelClick = () => {
    onCancel()
    setShowform(false)
  }
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Home", href: "/", onClick: () => navigate("/") },
    {
      label: "Asset Management System",
      href: "/customer/master",
      onClick: () => navigate("/customer/master"),
    },
    { label: "Supplier Risk Category", active: true },
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
            <TitleHeader title="Supplier Risk Category" className="py-4" />

            <NeumorphicButton
              type="button"
              variant="default"
              size="default"
              onClick={handleShowForm}
            >
              <PlusCircle width={13} />
              Add  Supplier Risk Category
            </NeumorphicButton>

          </div>

          {showForm && (
            <SupplierRiskForm
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
                className="pt-0 md:pt-0 lg:pt-0 "
            >
                   <section className="px-10">
          <SupplierRiskTable />
        </section>
            </PageWrapper>

    </div>
  );
}