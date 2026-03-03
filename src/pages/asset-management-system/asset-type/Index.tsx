import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import {
  Breadcrumb,
  TitleHeader,
  type BreadcrumbItem,
  PageWrapper,
} from "@/components";
import { useAssetType } from "./components/Hooks/useAssetType";
import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button";
import { AssetTypeForm } from "./components/Form/AssetTypeForm";
import { AssetTypeTable } from "./components/Table/AssetTypeTable";

export const AssetTypePage: React.FC = () => {
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

  } = useAssetType();

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
    { label: "Asset Type", active: true },
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
            <TitleHeader title="Asset Type" className="py-4" />

            <NeumorphicButton
              type="button"
              variant="default"
              size="default"
              onClick={handleShowForm}
            >
              <PlusCircle width={13} />
              Add Asset Type
            </NeumorphicButton>

          </div>

          {showForm && (
            <AssetTypeForm
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
          <AssetTypeTable />
        </section>
      </PageWrapper>

    </div>
  );
}