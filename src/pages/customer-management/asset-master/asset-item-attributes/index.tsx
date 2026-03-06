import React from "react";
import { PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Breadcrumb,
  TitleHeader,
  type BreadcrumbItem,
  PageWrapper,
  ConfirmationModal,
} from "@/components";
import { useAssetItemFormController } from "./hooks/useAssetItemAttributeForm";
import { AssetItemAttributeForm } from "./components/Form/AssetItemAttributeForm";
import { AssetItemAttributesTable } from "./components/Table/AssetItemAttributeTable";
import { AssetItemAttributesFilter } from "./components/Form/AssetItemAttributeFilter";
import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button";

export const AssetItemAttributesPage: React.FC = () => {
  const navigate = useNavigate();
  const formController = useAssetItemFormController();
  const {
    onSubmit,
    handleSubmit,
    onReset,
    handleShowForm,
    handleHideForm,
    register,
    errors,
    isSubmitting,
    showForm,
    showDeleteModal,
    handleCancelDelete,
    handleConfirmDelete,
    // onEdit,
    handleDelete,
  } = formController;

  const breadcrumbItems: BreadcrumbItem[] = [
    {
      label: "Home",
      href: "/",
      onClick: () => navigate("/"),
    },
    {
      label: "Loan Management System",
      href: "/loan",
      onClick: () => navigate("/loan"),
    },
    {
      label: "Loan Products & Scheme",
      href: "/loan/products-scheme",
      onClick: () => navigate("/loan/products-scheme"),
    },
    {
      label: "Loan Scheme Attributes Master",
      // href: "/loan/products-scheme/asset-item-attributes",
      // onClick: () => navigate("/loan/products-scheme/asset-item-attributes"),
      active: true,
    },
  ];

  return (
    <div className="space-y-6">
      <ConfirmationModal
        isOpen={showDeleteModal}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        title="Delete"
        message="Are you Sure you want to delete Asset Item Attributes?"
        confirmText="Delete"
        cancelText="Cancel"
        type="error"
        size="compact"
      />
      <PageWrapper
        variant="default"
        padding="xl"
        maxWidth="xl"
        contentPadding="sm"
        className="m-0 min-h-fit  pb-4"
      >
        <section className="p-4 lg:p-8 xl:p-10">
          <Breadcrumb items={breadcrumbItems} variant="default" size="sm" />
          <div className="flex items-center justify-between">
            <TitleHeader
              title="Asset Item Attributes Master"
              className="py-4"
            />
            <NeumorphicButton
              type="button"
              variant="default"
              size="default"
              onClick={handleShowForm}
            >
              <PlusCircle width={13} />
              Add Asset Item attribute master
            </NeumorphicButton>
          </div>
          {showForm && (
            <AssetItemAttributeForm
              register={register}
              errors={errors}
              isSubmitting={isSubmitting}
              onSubmit={handleSubmit(onSubmit)}
              onCancel={handleHideForm}
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
        <AssetItemAttributesFilter/>
        <section className="p-4 lg:p-8 xl:p-10">
          {/* <TitleHeader className="pb-4" title="List of Asset Item Attribute" /> */}
          <AssetItemAttributesTable
            data={[]}
            isLoading={true}
            // handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        </section>
      </PageWrapper>
    </div>
  );
};
