import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import {
  Breadcrumb,
  PageWrapper,
  TitleHeader,
  type BreadcrumbItem,
} from "../../../../components";
import NeumorphicButton from "../../../../components/ui/neumorphic-button/neumorphic-button";
import { useMsmeTypeForm } from "./components/Hooks/useMsmeTypeForm";
import { MsmeTypeTable } from "./components/Table/MsmeTypeTable";
import { MsmeTypeForm } from "./components/Form/MsmeTypeForm";

export const MsmeTypePage: React.FC = () => {
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
  } = useMsmeTypeForm();

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Home", href: "/", onClick: () => navigate("/") },
    {
      label: "Asset Management System",
      href: "/customer/asset-mgmt",
      onClick: () => navigate("/customer/asset-mgmt"),
    },
    { label: "MSME Type", active: true },
  ];

  const handleAddClick = () => {
    setShowForm(true);
  };

  const handleCancelClick = () => {
    onCancel();
    setShowForm(false);
  };

  return (
      <PageWrapper
        variant="default"
        padding="xl"
        maxWidth="2xl"
        contentPadding="sm"
        className="m-0 min-h-fit pb-4"
      >
        <section className="p-4 lg:p-8 xl:p-10">
          <Breadcrumb items={breadcrumbItems} variant="default" size="sm" />

          <div className="flex items-center justify-between">
            <TitleHeader title="MSME Type" className="text-xl font-medium py-4" />
            <NeumorphicButton
              type="button"
              variant="default"
              size="default"
              onClick={handleAddClick}
            >
              <PlusCircle className="mr-1 h-3 w-3" />
              Add MSME Type
            </NeumorphicButton>
          </div>

          {showForm && (
            <div className="rounded-lg border bg-white p-6 shadow-sm">
            <MsmeTypeForm
              control={control}
              register={register}
              errors={errors}
              isSubmitting={isSubmitting}
              onSubmit={handleSubmit(onSubmit)}
              onCancel={handleCancelClick}
              onReset={onReset}
            />
            </div>
          )}
        </section>
        <section className="px-4 lg:px-8 xl:px-10 pt-0 pb-6">
          {/* <TitleHeader className="pb-4" title="List of Asset Category" /> */}
          <MsmeTypeTable/>
        </section>
      </PageWrapper>
      
  );
};
