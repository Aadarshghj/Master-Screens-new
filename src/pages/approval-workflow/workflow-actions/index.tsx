import React from "react";
import { useNavigate } from "react-router-dom";
import { Breadcrumb, PageWrapper, type BreadcrumbItem } from "@/components";
import { WorkflowActionsForm } from "./components/Form/WorkflowActions";
import { WorkflowActionsFilterTable } from "./components/Form/WorkflowActionsFilter";
import { WorkflowNavigation } from "../components/WorkflowNavigation";

export const WorkflowActionsPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedWorkflow, setSelectedWorkflow] = React.useState<string>("all");

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
      label: "Workflow Actions",
      href: "/loan/products-scheme/workflow-actions",
      onClick: () => navigate("/loan/products-scheme/workflow-actions"),
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
          <WorkflowActionsForm
            selectedWorkflow={selectedWorkflow}
            onWorkflowChange={setSelectedWorkflow}
          />
        </PageWrapper>
        <PageWrapper
          variant="default"
          padding="xl"
          maxWidth="xl"
          contentPadding="sm"
          className="m-0 min-h-fit"
        >
          <WorkflowActionsFilterTable
            selectedWorkflow={selectedWorkflow}
            onWorkflowChange={setSelectedWorkflow}
          />
        </PageWrapper>
      </div>
    </>
  );
};
