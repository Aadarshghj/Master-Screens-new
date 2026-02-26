import React from "react";
import { useNavigate } from "react-router-dom";
import { Breadcrumb, PageWrapper, type BreadcrumbItem } from "@/components";
import { WorkflowDefinitionsForm } from "./components/Form/WorkflowDefinitions";
import { WorkflowDefinitionsFilterTable } from "./components/Form/WorkflowDefinitionsFilter";
import { WorkflowNavigation } from "../components/WorkflowNavigation";

export const WorkflowDefinitionsPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedModule, setSelectedModule] = React.useState<string>("all");
  const [selectedSubModule, setSelectedSubModule] =
    React.useState<string>("all");

  const breadcrumbItems: BreadcrumbItem[] = [
    {
      label: "Home",
      href: "/",
      onClick: () => navigate("/"),
    },
    {
      label: "Administration",
      href: "/administration",
      onClick: () => navigate("/administration"),
    },
    {
      label: "Approval Workflow Management",
      href: "/administration/workflow",
      onClick: () => navigate("/administration/workflow"),
    },
    {
      label: "Workflow Definitions",
      href: "/administration/workflow/definitions",
      onClick: () => navigate("/administration/workflow/definitions"),
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
          <WorkflowDefinitionsForm
            selectedModule={selectedModule}
            selectedSubModule={selectedSubModule}
            onModuleChange={setSelectedModule}
            onSubModuleChange={setSelectedSubModule}
          />
        </PageWrapper>
        <PageWrapper
          variant="default"
          padding="xl"
          maxWidth="xl"
          contentPadding="sm"
          className="m-0 min-h-fit"
        >
          <WorkflowDefinitionsFilterTable
            selectedModule={selectedModule}
            selectedSubModule={selectedSubModule}
            onModuleChange={setSelectedModule}
            onSubModuleChange={setSelectedSubModule}
          />
        </PageWrapper>
      </div>
    </>
  );
};
