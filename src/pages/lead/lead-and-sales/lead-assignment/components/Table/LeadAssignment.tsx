import React, { useMemo, useState } from "react";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { CommonTable } from "@/components/ui/data-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { LeadAssignmentModal } from "../Modal/LeadAssignment";
import { Pagination } from "@/components/ui/paginationUp";

interface Lead {
  leadIdentity: string;
  leadCode: string;
  fullName: string;
  contactNumber: string;
  email: string;
  interestedProduct: string;
  leadSource: string;
  leadStage: string;
  leadStatus: string;
  gender: string;
  assignTo?: string;
  assignToUser?: string;
  assignedOn?: string;
  [key: string]: string | number | boolean | undefined;
}

interface LeadAssignmentTableProps {
  leads: Lead[];
  selectedLeads: string[];
  onSelectLead: (leadId: string, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
  isLoading?: boolean;
  staffOptions?: Array<{ value: string; label: string }>;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalElements: number;
  onUpdateAssignment?: () => void;
}

const columnHelper = createColumnHelper<Lead>();

export const LeadAssignmentTable: React.FC<LeadAssignmentTableProps> = ({
  leads,
  selectedLeads,
  onSelectLead,
  onSelectAll,
  totalPages,
  currentPage,
  onPageChange,
  totalElements,
  staffOptions = [],
  onUpdateAssignment,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<{
    leadIdentity: string;
    leadCode: string;
    fullName: string;
    currentAssignment?: string;
    leadDate?: string;
  } | null>(null);

  const currentUserIdentity = "5b671099-483a-404d-a885-0eca2d009ce7";

  const handleEditAssignment = (lead: Lead) => {
    setSelectedLead({
      leadIdentity: lead.leadIdentity,
      leadCode: lead.leadCode,
      fullName: lead.fullName,
      currentAssignment: lead.assignToUser,
      leadDate: lead.assignedOn,
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedLead(null);
  };

  const handleModalSuccess = () => {
    if (onUpdateAssignment) {
      onUpdateAssignment();
    }
  };

  const maskContactNumber = (contactNumber: string) => {
    if (!contactNumber) return "-";
    const cleanNumber = contactNumber.replace(/\D/g, "");
    if (cleanNumber.length <= 4) return contactNumber;
    const lastFour = cleanNumber.slice(-4);
    const maskedPart = "x".repeat(cleanNumber.length - 4);
    return maskedPart + lastFour;
  };

  const getStaffNameById = (assignToId: string | undefined) => {
    if (!assignToId) return "-";
    const staff = staffOptions.find(option => option.value === assignToId);
    return staff?.label || "-";
  };

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "select",
        header: () => (
          <Checkbox
            checked={selectedLeads.length === leads.length && leads.length > 0}
            onCheckedChange={onSelectAll}
            className="border-2 border-slate-400 data-[state=checked]:border-slate-700 data-[state=checked]:bg-slate-700"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={selectedLeads.includes(row.original.leadIdentity)}
            onCheckedChange={checked =>
              onSelectLead(row.original.leadIdentity, checked as boolean)
            }
            className="border-2 border-slate-400 data-[state=checked]:border-slate-700 data-[state=checked]:bg-slate-700"
          />
        ),
      }),
      columnHelper.accessor("leadCode", {
        header: "Lead Code",
        cell: info => (
          <span className="text-foreground font-medium">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("fullName", {
        header: "Full Name",
        cell: info => (
          <span className="text-foreground">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("gender", {
        header: "Gender",
        cell: info => (
          <span className="text-foreground">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("contactNumber", {
        header: "Contact Number",
        cell: info => (
          <span className="text-foreground">
            {maskContactNumber(info.getValue())}
          </span>
        ),
      }),
      columnHelper.accessor("email", {
        header: "Email",
        cell: info => (
          <span className="text-foreground">{info.getValue() || "-"}</span>
        ),
      }),
      columnHelper.accessor("interestedProduct", {
        header: "Product/Service",
        cell: info => (
          <span className="text-foreground">{info.getValue()}</span>
        ),
      }),
      columnHelper.display({
        id: "assignToUser",
        header: "Assigned To",
        cell: ({ row }) => (
          <span className="text-foreground">
            {getStaffNameById(
              row.original.assignTo || row.original.assignToUser
            )}
          </span>
        ),
      }),
      columnHelper.accessor("leadSource", {
        header: "Lead Source",
        cell: info => (
          <span className="text-foreground">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("leadStage", {
        header: "Lead Stage",
        cell: info => (
          <span className="text-foreground">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("leadStatus", {
        header: "Lead Status",
        cell: info => (
          <span className="text-foreground">{info.getValue()}</span>
        ),
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <Button
            variant={"link"}
            size={"xs"}
            className="text-theme-primary hover:text-theme-primary/80 h-auto p-0 text-xs font-normal"
            onClick={() => handleEditAssignment(row.original)}
          >
            Re-assign →
          </Button>
        ),
      }),
    ],
    [leads, selectedLeads, onSelectLead, onSelectAll, staffOptions]
  );

  const table = useReactTable({
    data: leads,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  });

  return (
    <>
      <div className="space-y-4">
        <CommonTable
          table={table}
          size="default"
          noDataText="No leads found. Please apply filters to search for leads."
          className="bg-card "
        />

        {leads.length > 0 && totalPages > 0 && (
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
        )}
      </div>

      {selectedLead && (
        <LeadAssignmentModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          leadData={selectedLead}
          assignedByIdentity={currentUserIdentity}
          onSuccess={handleModalSuccess}
        />
      )}
    </>
  );
};
