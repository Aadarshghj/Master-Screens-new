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
import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button";
import { CoLendingSchemeMapForm } from "./components/Form/CoLendingSchemeMapForm";
import { useCoLendingSchemeMapFormController } from "./components/Hooks/useCoLendingSchemeMap";
import { CoLendingSchemeMapTable } from "./components/Table/CoLendingSchemeMapTable";
import { COL_LENDING_SCHEME_MAP_SAMPLE_DATA } from "@/mocks/co-lending-scheme-mapping/co-lender-scheme-map";

export const CoLendingSchemeMapPage: React.FC = () => {
  const navigate = useNavigate();
  
  const formController = useCoLendingSchemeMapFormController();
  const {
    onSubmit,
    handleSubmit,
    onReset,
    handleShowForm,
    handleHideForm,
    control,
    register,
    errors,
    isSubmitting,
    showForm,
    showDeleteModal,
    handleCancelDelete,
    handleConfirmDelete,
    handleDelete,
  } = formController;

  const breadcrumbItems: BreadcrumbItem[] = [
    {
      label: "Home",
      href: "/",
      onClick: () => navigate("/"),
    },
    {
      label: "Loan Product",
      href: "/loan",
      onClick: () => navigate("/loan"),
    },
    {
      label: "Loan Scheme Creation",
      href: "/loan/products-scheme",
      onClick: () => navigate("/loan/products-scheme"),
    },
    {
      label: "Scheme Mapping",
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
        message="Are you Sure you want to delete Co-Lending Scheme Mapping?"
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
              title="Co-Lending Scheme Mapping"
              className="py-4"
            />
            <NeumorphicButton
              type="button"
              variant="default"
              size="default"
              onClick={handleShowForm}
            >
              <PlusCircle width={13} />
              Add Scheme Mapping
            </NeumorphicButton>
          </div>
          {showForm && (
            <CoLendingSchemeMapForm
              control={control}
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
        <section className="p-4 lg:p-8 xl:p-10">
          <TitleHeader
            className="pb-4"
            title="View Scheme Mapping"
          />
          <CoLendingSchemeMapTable
            data={COL_LENDING_SCHEME_MAP_SAMPLE_DATA}
            isLoading={false}
            handleDelete={handleDelete}
          />
        </section>
      </PageWrapper>
    </div>
  );
};