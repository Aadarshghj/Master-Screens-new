import { useState } from "react";
import { LayoutGrid, Table as TableIcon } from "lucide-react";
import { useBranchStaffMapping } from "../Hooks/useBranchStaffForm";
import { useBranchStaffMappingTable } from "../Hooks/useBranchStaffTable";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { cn } from "@/utils";
import { KanbanBoard } from "@/components/ui/kanban/KanbanBoard";
import { BranchColumn } from "./kanban/BranchColumn";
import { AssignedColumn } from "./kanban/AssignedStaff";
import { AvailableColumn } from "./kanban/AvailableStaff";
import { BranchStaffMappingTable } from "../Table/BranchStaffTable";

export const BranchStaffMappingContainer = () => {
  const {
    branches,
    branchAssignments,
    assignedStaff,
    availableStaff,
    selectedBranch,
    selectedBranchId,
    branchSearchQuery,
    staffSearchQuery,
    allStaffLoading,
    pendingCount,
    isModalOpen,
    staffToRemove,
    setStaffToRemove,
    setBranchSearchQuery,
    setStaffSearchQuery,
    handleBranchSelect,
    moveStaffToPending,
    removeStaff,
    clearAssignedStaff,
    setIsModalOpen,
    confirmAssignment,
    confirmRemoveStaff,
  } = useBranchStaffMapping();

  const { branches: tableBranches, branchAssignments: tableAssignments } =
    useBranchStaffMappingTable();
    

  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"assignment" | "overview">(
    "assignment"
  );

  return (
    <div className="h-screen w-full overflow-hidden bg-[#f8fafc] font-sans">
      <ConfirmationModal
        isOpen={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onConfirm={confirmAssignment}
        title="Confirm Staff Assignment"
        message={`Are you sure you want to assign ${pendingCount} staff?`}
        confirmText="Confirm & Save"
        cancelText="Cancel"
        type="warning"
      />

      <ConfirmationModal
        isOpen={isClearModalOpen}
        onCancel={() => setIsClearModalOpen(false)}
        onConfirm={() => {
          clearAssignedStaff();
          setIsClearModalOpen(false);
        }}
        title="Clear Assigned Staff"
        message="Are you sure you want to clear all pending staff?"
        confirmText="Yes, Clear"
        cancelText="Cancel"
        type="warning"
      />

      <ConfirmationModal
        isOpen={!!staffToRemove}
        onCancel={() => setStaffToRemove(null)}
        onConfirm={confirmRemoveStaff}
        title="Remove Staff"
        message={`Are you sure you want to remove ${staffToRemove?.staffName}?`}
        confirmText="Yes, Remove"
        cancelText="Cancel"
        type="warning"
      />
      <div className="flex flex-col items-start justify-between gap-4 px-6 pt-4 pb-2 md:flex-row md:items-center">
        <div className="flex gap-2 rounded-lg p-1">
          <button
            onClick={() => setViewMode("assignment")}
            className={cn(
              "flex items-center gap-2 rounded-md px-5 py-2 text-[11px] font-medium shadow-sm transition-all",
              viewMode === "assignment"
                ? "bg-blue-600 text-white"
                : "text-slate-600 hover:bg-slate-200 hover:text-slate-900"
            )}
          >
            <LayoutGrid size={14} />
            Assignment View
          </button>

          <button
            onClick={() => setViewMode("overview")}
            className={cn(
              "flex items-center gap-2 rounded-md px-5 py-2 text-[11px] font-medium shadow-sm transition-all",
              viewMode === "overview"
                ? "bg-blue-600 text-white"
                : "text-slate-600 hover:bg-slate-200 hover:text-slate-900"
            )}
          >
            <TableIcon size={14} />
            All Branches Overview
          </button>
        </div>

        {viewMode === "assignment" && (
          <div className="rounded-lg border border-slate-200 bg-white px-5 py-2 text-sm font-medium text-slate-500 shadow-sm">
            Managing:
            <span className="ml-2 font-bold text-blue-700">
              {selectedBranch?.branchName || "Select a Branch"}
            </span>
          </div>
        )}
      </div>

      {viewMode === "overview" ? (
        <div className="h-[calc(100vh-140px)] px-6">
          <BranchStaffMappingTable
            branches={tableBranches}
            branchAssignments={tableAssignments}
            onManageBranch={(branchId: string) => {
              handleBranchSelect(branchId);
              setViewMode("assignment");
            }}
          />
        </div>
      ) : (
        <KanbanBoard>
          <BranchColumn
            branch={branches}
            branchAssignments={branchAssignments}
            selectedBranchId={selectedBranchId}
            searchQuery={branchSearchQuery}
            onSearchChange={setBranchSearchQuery}
            onBranchSelect={handleBranchSelect}
          />

          <AssignedColumn
            staff={assignedStaff}
            pendingCount={pendingCount}
            onRemove={removeStaff}
            onClear={() => setIsClearModalOpen(true)}
            onSave={() => pendingCount > 0 && setIsModalOpen(true)}
          />

          <AvailableColumn
            staff={availableStaff}
            searchQuery={staffSearchQuery}
            onSearchChange={setStaffSearchQuery}
            onMove={moveStaffToPending}
            isLoading={allStaffLoading}
            isBranchSelected={!!selectedBranch}
          />
        </KanbanBoard>
      )}
    </div>
  );
};