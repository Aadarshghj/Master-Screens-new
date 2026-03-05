import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle } from "lucide-react";

import {
  Breadcrumb,
  TitleHeader,
  type BreadcrumbItem,
  PageWrapper,
} from "@/components";

import { AssetModelForm } from "./components/Form/AssetModelForm";
import { useAssetModelForm } from "./components/Hooks/useAssetModelForm";
import { AssetModelTable } from "./components/Table/AssetModelTable";

import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button";

export const AssetModelPage: React.FC = () => {
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
    assetItemOptions,
  } = useAssetModelForm();

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Home", href: "/", onClick: () => navigate("/") },
    {
      label: "Asset Management System",
      href: "/asset-management",
      onClick: () => navigate("/asset-management"),
    },
    { label: "Asset Model", active: true },
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
            <TitleHeader title="Asset Model" className="py-4" />

            <NeumorphicButton
              type="button"
              variant="default"
              size="default"
              onClick={handleAddClick}
            >
              <PlusCircle width={13} />
              Add Asset Model
            </NeumorphicButton>
          </div>

          {showForm && (
            <div className=" rounded-lg border border-border bg-card p-5 shadow-sm">
            <AssetModelForm
              control={control}
              register={register}
              errors={errors}
              isSubmitting={isSubmitting}
              onSubmit={handleSubmit(onSubmit)}
              onCancel={handleCancelClick}
              onReset={onReset}
              assetItemOptions={assetItemOptions}
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
        className="pt-0 md:pt-0 lg:pt-0">
         <section className="px-9">
          {/* <TitleHeader className="pb-4" title="List of Asset Models" /> */}
          <AssetModelTable />
        </section>
      </PageWrapper>

     
    </div>
  );
};
