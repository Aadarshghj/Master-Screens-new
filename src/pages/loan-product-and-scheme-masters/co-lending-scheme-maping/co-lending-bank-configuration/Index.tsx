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
import { useCoLendingBankConfigFormController } from "./components/Hooks/useCoLendingBankConfig";
import { BankConfigForm } from "./components/Form/CoLendingBankConfigForm";
import { CoLendingBankConfigTable } from "./components/Table/CoLendingBankConfigTable";
import {BANK_TABLE_DATA} from "@/mocks/bank/bank-config";
import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button";

export const CoLendingBankConfigPage: React.FC = () => {
  const navigate = useNavigate();
  const formController = useCoLendingBankConfigFormController();
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
      label: "Bank Configuration",
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
        message="Are you Sure you want to delete Co-Lending Bank Configuration?"
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
              title="Co-Lending Bank Configuration"
              className="py-4"
            />
            <NeumorphicButton
              type="button"
              variant="default"
              size="default"
              onClick={handleShowForm}
            >
              <PlusCircle width={13} />
              Add Bank Configuration
            </NeumorphicButton>
          </div>
          {showForm && (
            <BankConfigForm
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
            title="View Co-Lending Bank Configuration"
          />
          <CoLendingBankConfigTable
            data={BANK_TABLE_DATA}
            isLoading={false}
            handleDelete={handleDelete}
          />
        </section>
      </PageWrapper>
    </div>
  );
};
