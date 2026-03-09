import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import {
  Breadcrumb,
  TitleHeader,
  type BreadcrumbItem,
  PageWrapper,
  Modal,
} from "@/components";
import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button";

import { useSubModuleForm } from "./components/Hooks/UseSubModuleForm";
import { SubModuleForm } from "./components/Form/SubModuleForm";
import { SubModuleTable } from "./components/Table/SubModuleTable";
import { useSubModuleTable } from "./components/Hooks/UseSubModuleTable";

import type { SubModule } from "@/types/customer-management/sub-module-management-type";

export const SubModulePage: React.FC = () => {
  const navigate = useNavigate();

  const [showForm, setShowform] = useState(false);
  const [selectedRow, setSelectedRow] = useState<SubModule | null>(null);

  const handleCloseForm = () => {
    setShowform(false);
    setSelectedRow(null);
  };

  const {
    control,
    register,
    handleSubmit,
    errors,
    isSubmitting,
    isEdit,
    onReset,
    onCancel,
    moduleOptions,
    isLoadingModules,
  } = useSubModuleForm(selectedRow, handleCloseForm);

  const {
    data = [],
    isLoading,
    showDeleteModal,
    closeDeleteModal,
    confirmDeleteSubModule,
    isDeleting,
    openDeleteModal,
  } = useSubModuleTable((row: SubModule) => handleEdit(row));

  const handleShowForm = () => {
    setSelectedRow(null);
    setShowform(true);
  };

  const handleCancelClick = () => {
    onCancel();
    handleCloseForm();
  };

  const handleEdit = (row: SubModule) => {
    setSelectedRow(row);
    setShowform(true);
  };

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
    { label: "Sub Module Management", active: true },
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
            <TitleHeader title="Sub-Module" className="py-4" />

            <NeumorphicButton
              type="button"
              variant="default"
              size="default"
              onClick={handleShowForm}
            >
              <PlusCircle width={13} />
              Add Sub-Module
            </NeumorphicButton>
          </div>

          {showForm && (
            <SubModuleForm
              control={control}
              register={register}
              errors={errors}
              isSubmitting={isSubmitting}
              isEdit={isEdit}
              onSubmit={handleSubmit}
              onCancel={handleCancelClick}
              onReset={onReset}
              moduleOptions={moduleOptions}
              isLoadingModules={isLoadingModules}
            />
          )}
        </section>
      </PageWrapper>

      <PageWrapper
        variant="default"
        padding="xl"
        maxWidth="xl"
        contentPadding="sm"
        className="pt-0"
      >
        <section className="p-4 lg:p-8 xl:p-10">
          <TitleHeader className="pb-4" title="List of Sub Modules" />

         
          <SubModuleTable
            onEdit={handleEdit}
            data={data} 
            isLoading={isLoading} 
            openDeleteModal={openDeleteModal}
          />
        </section>
      </PageWrapper>

      {showDeleteModal && (
        <Modal
          isOpen={showDeleteModal}
          close={closeDeleteModal}
          title="Delete Sub-Module"
          variant="danger"
        >
          <div className="p-4 text-center">
            <p className="text-sm text-gray-600">
              Are you sure you want to delete this sub-module? This action
              cannot be undone.
            </p>
            <div className="mt-6 flex justify-center gap-4">
              <NeumorphicButton
                variant="grey"
                size="default"
                onClick={closeDeleteModal}
                disabled={isDeleting}
              >
                Cancel
              </NeumorphicButton>
              <NeumorphicButton
                variant="error"
                size="default"
                onClick={confirmDeleteSubModule}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Confirm Delete"}
              </NeumorphicButton>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
