import React, { useMemo } from "react";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Pagination } from "@/components/ui/paginationUp";
import { CommonTable } from "@/components/ui/data-table";
import { Button, Grid } from "@/components/ui";
import type {
  LeadFollowupData,
  ConfigOption,
} from "@/types/lead/lead-followup.types";
import { Eye, History } from "lucide-react";

interface LeadFollowupTableProps {
  leads: LeadFollowupData[];
  selectedLeads: string[];
  onSelectLead: (leadId: string, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
  onUpdateLeadData: (leadId: string, field: string, value: string) => void;
  isLoading?: boolean;
  followUpTypeOptions: ConfigOption[];
  leadStageOptions: ConfigOption[];
  currentPage: number;
  totalPages: number;
  totalElements: number;
  onPageChange: (page: number) => void;
  onViewDetails: (leadId: string) => void;
  onViewHistory: (leadId: string) => void;
}
const columnHelper = createColumnHelper<LeadFollowupData>();

export const LeadFollowupTable: React.FC<LeadFollowupTableProps> = ({
  leads,

  onUpdateLeadData,
  isLoading = false,
  followUpTypeOptions,
  leadStageOptions,
  currentPage,
  totalPages,
  totalElements,
  onPageChange,
  onViewDetails,
  onViewHistory,
}) => {
  const columns = useMemo(
    () => [
      columnHelper.accessor(row => `${row.leadCode} - ${row.leadFullName}`, {
        header: "Lead ID -Name",
        cell: info => (
          <span className="text-foreground font-medium">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("contactNumber", {
        header: "Mobile No",
        cell: info => (
          <span className="text-foreground font-mono">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("assignToUser", {
        header: "Assigned To",
        cell: info => (
          <span className="text-foreground">{info.getValue()}</span>
        ),
      }),

      columnHelper.accessor("followUpDate", {
        header: "Follow-up Date",
        cell: info => {
          const value = info.getValue();
          return (
            <span className="text-foreground">
              {value ? new Date(value).toLocaleDateString("en-GB") : "-"}
            </span>
          );
        },
      }),

      columnHelper.accessor("nextFollowUpDate", {
        header: "Next Follow-up Date",
        cell: info => {
          const value = info.getValue();
          return (
            <span className="text-foreground">
              {value ? new Date(value).toLocaleDateString("en-GB") : "-"}
            </span>
          );
        },
      }),

      columnHelper.accessor("leadStageName", {
        header: "Lead Stage",
        cell: info => (
          <span className="text-foreground">{info.getValue() || "-"}</span>
        ),
      }),

      columnHelper.accessor("followUpTypeName", {
        header: "Follow-up Type",
        cell: info => (
          <span className="text-foreground">{info.getValue() || "-"}</span>
        ),
      }),

      columnHelper.accessor("followUpNotes", {
        header: "Follow-up Notes",
        cell: info => (
          <span className="text-foreground">{info.getValue() || "-"}</span>
        ),
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Button
              variant="outlineBlue"
              size="xs"
              onClick={() => onViewDetails(row.original.leadIdentity)}
              className="flex items-center gap-1"
            >
              <Eye className="h-3 w-3" />
              Details
            </Button>
            <Button
              variant="outlineYellow"
              size="xs"
              onClick={() => onViewHistory(row.original.leadIdentity)}
              className="flex items-center gap-1"
            >
              <History className="h-3 w-3" />
              History
            </Button>
          </div>
        ),
      }),
    ],
    [onUpdateLeadData, followUpTypeOptions, leadStageOptions]
  );

  const table = useReactTable({
    data: leads,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  });

  return (
    <article className="mt-4">
      <Grid>
        <Grid.Item>
          <CommonTable
            table={table}
            size="default"
            noDataText={
              isLoading
                ? "Loading leads..."
                : "No leads found. Please apply filters to view data."
            }
            className="bg-card "
          />
        </Grid.Item>

        {leads.length > 0 && totalPages > 0 && (
          <Grid.Item className="mt-4">
            <div className="flex items-center justify-between text-sm">
              <div className="text-muted-foreground whitespace-nowrap">
                Showing {currentPage * 10 + 1} to{" "}
                {Math.min((currentPage + 1) * 10, totalElements)} of{" "}
                {totalElements} entries
              </div>
              <div className="flex items-center gap-3">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={onPageChange}
                  onPreviousPage={() => {
                    if (currentPage > 0) {
                      onPageChange(currentPage - 1);
                    }
                  }}
                  onNextPage={() => {
                    if (currentPage < totalPages - 1) {
                      onPageChange(currentPage + 1);
                    }
                  }}
                  canPreviousPage={currentPage > 0}
                  canNextPage={currentPage < totalPages - 1}
                  maxVisiblePages={5}
                />
              </div>
            </div>
          </Grid.Item>
        )}
      </Grid>
    </article>
  );
};
