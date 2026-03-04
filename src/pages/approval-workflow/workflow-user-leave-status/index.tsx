import React from "react";
import { useNavigate } from "react-router-dom";
import { Breadcrumb, PageWrapper, type BreadcrumbItem } from "@/components";
import UserLeaveStatusForm from "./components/form/UserLeaveStatusForm";
import UserLeaveStatusFilter from "./components/filter/UserLeaveStatusFilter";
import { UserLeaveStatusTable } from "./components/table/UserLeaveStatusTable";
import { useUserLeaveStatusForm } from "./hooks/useUserLeaveStatusForm";
import { WorkflowNavigation } from "../components/WorkflowNavigation";
export const UserLeaveStatusPage: React.FC = () => {
  const navigate = useNavigate();
  const formController = useUserLeaveStatusForm();
  const {
    page,
    size,
    isLoading,
    data,
    handlePageChange,
    handleSetUserCode,
    handleSetDelegateUserCode,
    handleDelete,
    handleEdit,
  } = formController;

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
      href: "/administration/approval-workflow-management",
      onClick: () => navigate("/administration/approval-workflow-management"),
    },
    {
      label: "User leave status",
      href: "/loan-management/approval-workflow/workflow-user-leave-status",
      onClick: () =>
        navigate(
          "/loan-management/approval-workflow/workflow-user-leave-status"
        ),
    },
  ];
  return (
    <div className="space-y-6">
      <PageWrapper
        variant="default"
        padding="xl"
        maxWidth="xl"
        contentPadding="sm"
        className="m-0 min-h-fit "
      >
        <div className="mb-6 px-4 pt-4">
          <WorkflowNavigation />
        </div>
        <Breadcrumb
          items={breadcrumbItems}
          variant="default"
          size="sm"
          className="p-4 "
        />
        <section className="p-4">
          {" "}
          <UserLeaveStatusForm formController={formController} />
        </section>
      </PageWrapper>
      <PageWrapper
        variant="default"
        padding="xl"
        maxWidth="xl"
        contentPadding="sm"
        className="pt-0 md:pt-0 lg:pt-0"
      >
        <section className="p-4">
          <UserLeaveStatusFilter
            handlePageChange={handlePageChange}
            handleSetDelegateUserCode={handleSetDelegateUserCode}
            handleSetUserCode={handleSetUserCode}
          />

          <UserLeaveStatusTable
            page={page}
            size={size}
            handlePageChange={handlePageChange}
            isLoading={isLoading}
            data={data}
            handleDelete={handleDelete}
            onEdit={handleEdit}
          />
        </section>
      </PageWrapper>
    </div>
  );
};

export default UserLeaveStatusPage;
