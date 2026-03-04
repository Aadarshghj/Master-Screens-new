import React, { useState } from "react";
import { StagesSetup } from "./components/Form/StagesStep";
import { useNavigate } from "react-router-dom";
import { Breadcrumb, PageWrapper, type BreadcrumbItem } from "@/components";
import type { WorkflowStage } from "@/types/approval-workflow/workflow-stagesetup";
import { StagesTable } from "./components/Form/StagesFilter";
import { WorkflowNavigation } from "../components/WorkflowNavigation";

export const WorkflowStagesSetupPage: React.FC = () => {
  const navigate = useNavigate();
  const [editingStage, setEditingStage] = useState<WorkflowStage | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedWorkflow, setSelectedWorkflow] = useState<string>("");

  const handleWorkflowChange = (workflow: string) => {
    setSelectedWorkflow(workflow);
  };

  const handleStageUpdated = () => {
    // Trigger refetch in table component
    setRefreshTrigger(prev => prev + 1);
  };

  const handleEdit = (stage: WorkflowStage) => {
    setEditingStage(stage);
  };

  const breadcrumbItems: BreadcrumbItem[] = [
    {
      label: "Home",
      href: "/",
      onClick: () => navigate("/"),
    },
    {
      label: "Loan Management System",
      href: "/loan-management",
      onClick: () => navigate("/loan-management"),
    },
    {
      label: "Approval Workflow",
      href: "/loan-management/Approval-workflow",
      onClick: () => navigate("/loan-management/Approval-workflow"),
    },
    {
      label: "Workflow Stages Setup",
      href: "/loan-management/Approval-workflow/workflow-stages-setup",
      onClick: () =>
        navigate("/loan-management/Approval-workflow/workflow-stages-setup"),
    },
  ];

  return (
    <>
      <div className="space-y-6">
        <PageWrapper
          variant="default"
          padding="xl"
          maxWidth="xl"
          contentPadding="sm"
          className="m-0 min-h-fit"
        >
          <div className="mb-6 px-4 pt-4">
            <WorkflowNavigation />
          </div>
          <section>
            <Breadcrumb
              items={breadcrumbItems}
              variant="default"
              size="sm"
              className="mt-4 mb-4 ml-4"
            />
          </section>
          <StagesSetup
            editingStage={editingStage}
            setEditingStage={setEditingStage}
            onStageUpdated={handleStageUpdated}
            selectedWorkflow={selectedWorkflow}
            onWorkflowChange={handleWorkflowChange}
          />
        </PageWrapper>
        <PageWrapper
          variant="default"
          padding="xl"
          maxWidth="xl"
          contentPadding="sm"
          className="m-0 min-h-fit"
        >
          <StagesTable
            onEdit={handleEdit}
            onRefresh={refreshTrigger}
            onWorkflowChange={handleWorkflowChange}
            selectedWorkflow={selectedWorkflow}
            key={refreshTrigger}
          />
        </PageWrapper>
      </div>
    </>
  );
};

export default WorkflowStagesSetupPage;
