import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import type { BreadcrumbItem } from "@/components";
import { useFilterApprovalQueueQuery } from "@/global/service/end-points/approval-workflow/approval-queue";
import type { ApprovalQueueFormData } from "@/types/approval-workflow/approval-queue.types";
import { approvalQueueFilterDefaultValue } from "../constants/filter.constants";

export const useApprovalQueuePage = () => {
  const navigate = useNavigate();

  const [page, setPage] = useState(0);
  const [filterPayload, setFilterPayload] = useState<ApprovalQueueFormData>(
    approvalQueueFilterDefaultValue
  );

  const size = 10;

  const breadcrumbItems: BreadcrumbItem[] = useMemo(
    () => [
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
        label: "Approval Queue",
        href: "/loan-management/approval-workflow/Approval Queue",
        onClick: () =>
          navigate("/loan-management/approval-workflow/Approval Queue"),
      },
    ],
    [navigate]
  );

  const { data, isLoading, refetch, isFetching } =
    useFilterApprovalQueueQuery(filterPayload);

  const handleSetFilters = (updates: Partial<ApprovalQueueFormData>) => {
    setFilterPayload(prev => ({
      ...prev,
      ...updates,
      page: updates.page ?? 0,
    }));

    if (!Object.prototype.hasOwnProperty.call(updates, "page")) {
      setPage(0);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    setFilterPayload(prev => ({
      ...prev,
      page: newPage,
    }));
  };

  const handleResetFilters = () => {
    setFilterPayload(approvalQueueFilterDefaultValue);
    setPage(0);
  };

  return {
    page,
    size,
    filterPayload,
    breadcrumbItems,

    data,
    isLoading,
    isFetching,

    handleSetFilters,
    handlePageChange,
    handleResetFilters,
    refetch,
  };
};
