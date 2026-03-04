import React, { useState, useEffect } from "react";
import { PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Breadcrumb,
  PageWrapper,
  TitleHeader,
  type BreadcrumbItem,
} from "@/components";

import type { AssetItemType } from "@/types/customer-management/asset-item";
import { useAssetItem } from "./components/hook/useAssetItem";
import { AssetItemForm } from "./components/form/AssetItemForm";
import { AssetItemTable } from "./components/table/AssetItemTable";
import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button";

export const AssetItemPage: React.FC = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);

  const [editingItem, setEditingItem] = useState<AssetItemType | null>(null);

  const {
    control,
    register,
    handleSubmit,
    errors,
    isSubmitting,
    onSubmit,
    onCancel,
    onReset,
    reset,
  } = useAssetItem();

  useEffect(() => {
    if (editingItem) {
      reset(editingItem);
      setShowForm(true);
    }
  }, [editingItem, reset]);

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Home", href: "/", onClick: () => navigate("/") },
    {
      label: "Customer Management System",
      href: "/customer",
      onClick: () => navigate("/customer"),
    },
    {
      label: "Asset Management System",
      href: "/customer/asset",
      onClick: () => navigate("/customer/asset"),
    },
    { label: "Asset Item", active: true },
  ];

  const handleAddClick = () => {
    setEditingItem(null);
    setShowForm(true);
  };

  const handleCancelClick = () => {
    onCancel();
    setEditingItem(null);
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <PageWrapper
        variant="default"
        padding="xl"
        maxWidth="full"
        contentPadding="sm"
        className="m-0 min-h-fit pb-4"
      >
        <section className="p-4 lg:p-8 xl:p-10">
          <Breadcrumb items={breadcrumbItems} variant="default" size="sm" />

          <div className="flex items-center justify-between">
            <TitleHeader title="Asset Item" className="py-4" />
            <NeumorphicButton
              type="button"
              variant="default"
              size="default"
              onClick={handleAddClick}
            >
              <PlusCircle className="mr-1 h-3 w-3" />
              Add Asset Item
            </NeumorphicButton>
          </div>

          {showForm && (
            <div className="mb-6 rounded-lg border bg-white p-6 shadow-sm">
              <AssetItemForm
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

        <section className="px-4 pt-0 pb-6 lg:px-8 xl:px-10">
          <AssetItemTable onEdit={setEditingItem} />
        </section>
      </PageWrapper>
    </div>
  );
};
