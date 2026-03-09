import React, { useState } from "react";
import { PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Breadcrumb,
  TitleHeader,
  type BreadcrumbItem,
  PageWrapper,
} from "@/components";
import { useAssetGroupForm } from "./components/Hooks/useAssetGroupForm";
import { AssetGroupForm } from "./components/Form/AssetGroupForm";
import { AssetGroupTable } from "./components/Table/AssetGroupTable";
import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button";

export const AssetGroupPage: React.FC = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    errors,
    isSubmitting,
    assetTypeOptions,
    onSubmit,
    onCancel,
    onReset,
  } = useAssetGroupForm();

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Home", href: "/", onClick: () => navigate("/") },
    {
      label: "Asset Management System",
      href: "/asset-management",
      onClick: () => navigate("/asset-management"),
    },
    { label: "Asset Group", active: true },
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
            <TitleHeader title="Asset Group" className="py-4" />
            <NeumorphicButton
              type="button"
              variant="default"
              size="default"
              onClick={handleAddClick}
            >
              <PlusCircle className="mr-1 h-3 w-3" />
              Add Asset Group
            </NeumorphicButton>
          </div>

          {showForm && (
            <AssetGroupForm
              control={control}
              register={register}
              errors={errors}
              isSubmitting={isSubmitting}
              onSubmit={handleSubmit(onSubmit)}
              assetTypeOptions={assetTypeOptions}
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
          <TitleHeader className="pb-4" title="List of Asset Groups" />
          <AssetGroupTable />
        </section>
      </PageWrapper>
    </div>
  );
};
