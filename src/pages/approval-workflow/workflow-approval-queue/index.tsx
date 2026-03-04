import React from "react";
import { Breadcrumb, Flex, HeaderWrapper, TitleHeader } from "@/components";
import { ApprovalQueueTable } from "./components/table/ApprovalQueueTable";
import ApprovalQueueFilter from "./components/filter/ApprovalQueueFilter";
import { useApprovalQueuePage } from "./hooks/useApprovalQueuePage";
import { WorkflowNavigation } from "../components/WorkflowNavigation";

export const WorkflowApprovalQueuePage: React.FC = () => {
  const {
    page,
    size,
    breadcrumbItems,
    data,
    isLoading,
    handleSetFilters,
    handlePageChange,
  } = useApprovalQueuePage();
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <WorkflowNavigation />
      </div>
      <section>
        <Breadcrumb
          items={breadcrumbItems}
          variant="default"
          size="sm"
          className="mb-1"
        />
      </section>
      <Flex justify="between" align="center" className="mb-8 w-full">
        <HeaderWrapper>
          <TitleHeader title="Approval Queue" className="w-fit" />
        </HeaderWrapper>
      </Flex>
      <ApprovalQueueFilter handleSetFilters={handleSetFilters} />
      <ApprovalQueueTable
        page={page}
        size={size}
        handlePageChange={handlePageChange}
        isLoading={isLoading}
        data={data}
      />
    </div>
  );
};

export default WorkflowApprovalQueuePage;
