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

import { FirmRoleForm } from "./components/Form/FirmRoleForm";
import { FirmRoleTable } from "./components/Table/FirmRoleTable";
import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button";
import { useFirmRoleFormController } from "./hooks/useFirmRoleForm";

export const FirmRolePage: React.FC = () => {
  const navigate = useNavigate();
  const formController = useFirmRoleFormController();
  const {
    tableData,
    register,
    handleSubmit,
    errors,
    isSubmitting,
    onSubmit,
    onReset,
    handleShowForm,
    handleHideForm,
    showForm,
    showDeleteModal,
    handleCancelDelete,
    handleConfirmDelete,
    handleDelete,
    isLoading,
  } = formController;

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Home", href: "/", onClick: () => navigate("/") },
    {
      label: "Customer Management System",
      href: "/customer",
      onClick: () => navigate("/customer"),
    },
    {
      label: "Master",
      href: "/customer/master",
      onClick: () => navigate("/customer/master"),
    },
    { label: "Firm Role", active: true },
  ];

  return (
    <div className="space-y-6">
      <ConfirmationModal
        isOpen={showDeleteModal}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        title="Delete"
        message="Are you Sure you want to delete firm role."
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
        className="m-0 min-h-fit pb-4"
      >
        <section className="p-4 lg:p-8 xl:p-10">
          <Breadcrumb items={breadcrumbItems} variant="default" size="sm" />
          <div className="flex items-center justify-between">
            <TitleHeader title="Firm Role" className="py-4" />
            <NeumorphicButton
              type="button"
              variant="default"
              size="default"
              onClick={handleShowForm}
            >
              <PlusCircle width={13} />
              Add Firm Role
            </NeumorphicButton>
          </div>
          {showForm && (
            <FirmRoleForm
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
          <TitleHeader className="pb-4" title="List of Firm Roles" />
          <FirmRoleTable
            data={tableData ?? []}
            isLoading={isLoading}
            handleDelete={handleDelete}
          />
        </section>
      </PageWrapper>
    </div>
  );
};
