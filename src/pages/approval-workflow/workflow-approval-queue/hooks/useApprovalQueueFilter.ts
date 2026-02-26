import { useForm } from "react-hook-form";
import {
  useGetBranchQuery,
  useGetModulesQuery,
  useGetUsersStatusQuery,
  useGetWorkflowQuery,
} from "@/global/service/end-points/approval-workflow/approval-queue";
import type { ApprovalQueueFormData } from "@/types/approval-workflow/approval-queue.types";
import { approvalQueueFilterDefaultValue } from "../constants/filter.constants";

interface UseApprovalQueueFilterProps {
  handleSetFilters: (updates: Partial<ApprovalQueueFormData>) => void;
}

export const useApprovalQueueFilter = ({
  handleSetFilters,
}: UseApprovalQueueFilterProps) => {
  const { data: moduleOptions = [] } = useGetModulesQuery();
  const { data: workflowOptions = [] } = useGetWorkflowQuery();
  const { data: branchOptions = [] } = useGetBranchQuery();
  const { data: statusData = [] } = useGetUsersStatusQuery();
  const { control, handleSubmit, register, reset } =
    useForm<ApprovalQueueFormData>({
      defaultValues: approvalQueueFilterDefaultValue,
    });

  const normalizeAll = <T extends string>(value: T) =>
    value === "all" ? "" : value;

  const onSubmit = (data: ApprovalQueueFormData) => {
    handleSetFilters({
      ...data,
      moduleIdentity: normalizeAll(data.moduleIdentity ?? ""),
      workflowIdentity: normalizeAll(data.workflowIdentity ?? ""),
      branchIdentity: normalizeAll(data.branchIdentity ?? ""),
      status: normalizeAll(data.status ?? ""),
      page: 0,
      size: 10,
    });
  };

  const branchOptionsWithAll = [
    { value: "all", label: "All" },
    ...branchOptions,
  ];

  const moduleOptionsWithAll = [
    { value: "all", label: "All" },
    ...moduleOptions,
  ];

  const workflowOptionsWithAll = [
    { value: "all", label: "All" },
    ...workflowOptions,
  ];

  const statusOptionsWithAll = [{ value: "all", label: "All" }, ...statusData];

  return {
    control,
    register,
    handleSubmit,
    reset,
    branchOptionsWithAll,
    moduleOptionsWithAll,
    workflowOptionsWithAll,
    statusOptionsWithAll,
    onSubmit,
  };
};
