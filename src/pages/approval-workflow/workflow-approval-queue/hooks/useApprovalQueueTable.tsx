import { useMemo, useState } from "react";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { format } from "date-fns";
import { useAppDispatch, useAppSelector } from "@/hooks/store";
import { setShowApprovalConfirmationModal } from "@/global/reducers/approval-confirmation.reducer";
import {
  resetApprovalView,
  setShowApprovalView,
} from "@/global/reducers/approval-workflow/approval-view-modal.reducer";
import type { RootState } from "@/global/store";
import type {
  AprovalQueueResponse,
  QueData,
} from "@/types/approval-workflow/approval-queue.types";
import { Eye } from "lucide-react";
import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button";

interface UseApprovalQueueTableProps {
  page: number;
  size: number;
  data: AprovalQueueResponse | undefined;
  isLoading: boolean;
}

const columnHelper = createColumnHelper<QueData>();

export const useApprovalQueueTable = ({
  page,
  size,
  data,
  isLoading,
}: UseApprovalQueueTableProps) => {
  const [identity, setIdentity] = useState("");
  const [moduleCode, setModuleCode] = useState("");

  const dispatch = useAppDispatch();
  const { showApprovalView } = useAppSelector(
    (state: RootState) => state.approvalViewModal
  );

  const tableData = data?.content ?? [];
  const totalPages = data?.totalPages ?? 0;
  const totalElements = data?.totalElements ?? 0;
  const currentPage = page;

  const handleClose = () => {
    dispatch(resetApprovalView());
    setIdentity("");
    setModuleCode("");
  };

  const handleView = (
    identity: string,
    moduleCode: string,
    rowIdentity: string
  ) => {
    dispatch(
      setShowApprovalConfirmationModal({
        action: null,
        instanceIdentity: rowIdentity,
        showConfirmationModal: false,
      })
    );
    setIdentity(identity);
    setModuleCode(moduleCode);
    dispatch(setShowApprovalView(true));
  };

  const getNoDataText = () => {
    if (isLoading) {
      return "Loading approval queue...";
    }
    return "No approval queue found";
  };

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "slNo",
        header: "S.No",
        cell: ({ row }) => (
          <span className="text-xs font-medium">
            {page * size + row.index + 1}
          </span>
        ),
      }),
      columnHelper.accessor("branchCode", {
        header: "Branch Code - Name",
        cell: info => <span className="text-xs">{info.getValue()}</span>,
      }),
      columnHelper.accessor("moduleName", {
        header: "Module",
        cell: info => <span className="text-xs">{info.getValue()}</span>,
      }),
      columnHelper.accessor("referenceNo", {
        header: "Reference No.",
        cell: info => <span className="text-xs">{info.getValue()}</span>,
      }),
      columnHelper.accessor("workflowDefinitionName", {
        header: "Workflow",
        cell: info => <span className="text-xs">{info.getValue()}</span>,
      }),
      columnHelper.accessor("amount", {
        header: "Amount",
        cell: info => <span className="text-xs">{info.getValue() ?? "-"}</span>,
      }),
      columnHelper.accessor("currentStageName", {
        header: "Current Stage",
        cell: info => <span className="text-xs">{info.getValue()}</span>,
      }),
      columnHelper.display({
        header: "Created By",
        cell: ({ row }) => {
          const name = row.original.createdBy;
          const code = row.original.createdByCode;
          return (
            <div className="flex items-center gap-2 uppercase">
              {code + "-" + name}
            </div>
          );
        },
      }),
      columnHelper.accessor("createdAt", {
        header: "Created At",
        cell: info => {
          const date = info.getValue();
          return date ? format(new Date(date), "dd/MM/yyyy") : "-";
        },
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: info => <span className="text-xs">{info.getValue()}</span>,
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const identity = row.original.referenceIdentity;
          const moduleCode = row.original.moduleCode;
          const rowIdentity = row.original.rowIdentity;

          return (
            <div className="flex items-center gap-2">
              <NeumorphicButton
                variant="none"
                onClick={() => handleView(identity, moduleCode, rowIdentity)}
                className="text-primary hover:bg-primary/50 h-6 w-6 p-0"
              >
                <Eye size={13} />
              </NeumorphicButton>
            </div>
          );
        },
      }),
    ],
    [page, size]
  );

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return {
    identity,
    moduleCode,
    showApprovalView,
    tableData,
    totalPages,
    totalElements,
    currentPage,
    table,
    handleClose,
    handleView,
    getNoDataText,
  };
};
