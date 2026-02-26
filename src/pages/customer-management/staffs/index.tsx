import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Breadcrumb,
  ConfirmationModal,
  PageWrapper,
  TitleHeader,
  type BreadcrumbItem,
} from "@/components";
import { StaffForm } from "./components/Form/StaffsForm";
import { StaffsTable } from "./components/Table/StaffsTable";
import { PlusCircle } from "lucide-react";
import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button";
import { useStaffFormController } from "./hooks/useStaffForm";

export const StaffPage: React.FC = () => {
  const navigate = useNavigate();
  const formController = useStaffFormController();
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
    control,
    reportingPersonOption,
    appUser,
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
    { label: "Staffs", active: true },
  ];

  return (
    <div className="space-y-6">
      <ConfirmationModal
        isOpen={showDeleteModal}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        title="Delete"
        message="Are you Sure you want to delete staff."
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
            <TitleHeader title="Staffs" className="py-4" />
            <NeumorphicButton
              type="button"
              variant="default"
              size="default"
              onClick={handleShowForm}
            >
              <PlusCircle width={13} />
              Add Staff
            </NeumorphicButton>
          </div>
          {showForm && (
            <StaffForm
              appUser={appUser}
              control={control}
              register={register}
              errors={errors}
              isSubmitting={isSubmitting}
              onSubmit={handleSubmit(onSubmit)}
              onCancel={handleHideForm}
              onReset={onReset}
              reportingPersonOption={reportingPersonOption ?? []}
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
          <TitleHeader className="pb-4" title="List of Staffs" />
          <StaffsTable
            data={tableData ?? []}
            isLoading={isLoading}
            handleDelete={handleDelete}
          />
        </section>
      </PageWrapper>
    </div>
  );
};
