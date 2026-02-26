import React from "react";
import { useNavigate } from "react-router-dom";

import { Breadcrumb, type BreadcrumbItem } from "@/components";

import { StagesSetup } from "./components/Form/StagesSetup";
import { StagesSetupTable } from "./components/Table/StageSetupTable";

import { useWorkflowStages } from "./components/hooks/useWorkflowStagesForm";

export const WorkflowStagesSetupPage: React.FC = () => {
  const navigate = useNavigate();

  const {
    control,
    register,
    handleSubmit,
    formState,
    tableData,
    pageIndex,
    totalPages,
    workflowOptions,
    roleOptions,
    setPageIndex,
    onSubmit,
    handleEditStage,
    handleDeleteStage,
    handleResetForm,
  } = useWorkflowStages();

  const handleCancel = () => {
    navigate("/admin/approve-workflow");
  };

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Home", href: "/", onClick: () => navigate("/") },
    {
      label: "Administration",
      href: "/admin",
      onClick: () => navigate("/admin"),
    },
    {
      label: "Approve Workflow Management",
      href: "/admin/approve-workflow",
      onClick: () => navigate("/admin/approve-workflow"),
    },
    { label: "Workflow Stages Setup", active: true },
  ];

  return (
    <main>
      <div className="space-y-6">
        <section>
          <Breadcrumb items={breadcrumbItems} variant="default" size="sm" />
        </section>
        <section>
          <article>
            <StagesSetup
              control={control}
              register={register}
              errors={formState.errors}
              isSubmitting={formState.isSubmitting}
              readonly={false}
              workflowOptions={workflowOptions}
              roleOptions={roleOptions}
              onSubmit={handleSubmit(onSubmit)}
              onCancel={handleCancel}
              onReset={handleResetForm}
            />
          </article>
        </section>
        <section>
          <StagesSetupTable
            data={tableData}
            pageIndex={pageIndex}
            totalPages={totalPages}
            onPageChange={setPageIndex}
            onEdit={handleEditStage}
            onDelete={handleDeleteStage}
          />
        </section>
      </div>
    </main>
  );
};
