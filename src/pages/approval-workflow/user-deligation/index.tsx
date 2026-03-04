import React from "react";
import { useNavigate } from "react-router-dom";
import { Breadcrumb, PageWrapper, type BreadcrumbItem } from "@/components";
import { ManageUserDelegations } from "./components/Form/UserDelegation";

export const UserDelegationPage: React.FC = () => {
  const navigate = useNavigate();

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
      label: "User Delegations",
      href: "/loan-management/Approval-workflow/user-delegations",
      onClick: () =>
        navigate("/loan-management/Approval-workflow/user-delegations"),
    },
  ];

  return (
    <PageWrapper
      variant="default"
      padding="xl"
      maxWidth="xl"
      contentPadding="sm"
      className="m-0 min-h-fit"
    >
      <section>
        <Breadcrumb
          items={breadcrumbItems}
          variant="default"
          size="sm"
          className="mt-4 mb-4 ml-4"
        />
      </section>

      <ManageUserDelegations />
    </PageWrapper>
  );
};

export default UserDelegationPage;
