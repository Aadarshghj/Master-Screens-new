import React from "react";
import { useNavigate } from "react-router-dom";
import { Breadcrumb, PageWrapper, type BreadcrumbItem } from "@/components";
import { ApproverRoleMappingForm } from "./components/Form/ApproverRoleMapping";
import { ApproverRoleMappingFilterTable } from "./components/Form/ApproverRoleMappingFilter";
import { WorkflowNavigation } from "../components/WorkflowNavigation";

export const ApproverRoleMappingPage: React.FC = () => {
  const navigate = useNavigate();

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
      href: "/administration/approval-workflow",
      onClick: () => navigate("/administration/approval-workflow"),
    },
    {
      label: "Approver Role Mapping",
      href: "/administration/approval-workflow/role-mapping",
      onClick: () => navigate("/administration/approval-workflow/role-mapping"),
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
          <ApproverRoleMappingForm />
        </PageWrapper>
        <PageWrapper
          variant="default"
          padding="xl"
          maxWidth="xl"
          contentPadding="sm"
          className="m-0 min-h-fit"
        >
          <ApproverRoleMappingFilterTable />
        </PageWrapper>
      </div>
    </>
  );
};
