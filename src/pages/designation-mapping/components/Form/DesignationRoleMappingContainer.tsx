import React, { useState } from "react";
import { LayoutGrid, Table as TableIcon } from "lucide-react";

import { useDesignationRoleMapping } from "../Hooks/UseDesignationRoleMapping";
import { useDesignationRoleMappingTable } from "../Hooks/useDesignationRoleMappingTable";

import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { cn } from "@/utils";

import { KanbanBoard } from "../../../../components/ui/kanban/KanbanBoard";
import { DesignationsColumn } from "./kanban/DesignationColumn";
import { AssignedColumn } from "./kanban/AssignedRoles";
import { AvailableColumn } from "./kanban/AvailableRows";

import { DesignationRoleMappingTable } from "../Table/DesignationRoleMappingTable";

export const DesignationRoleMappingContainer: React.FC = () => {
  const {
    designations,
    assignedRoles,
    availableRoles,
    selectedDesignation,
    selectedDesignationId,
    designationSearchQuery,
    roleSearchQuery,
    tempAccessTypes,
    pendingCount,
    isModalOpen,
    combinedAssignments,
    setDesignationSearchQuery,
    setRoleSearchQuery,
    handleDesignationSelect,
    setAccessTypeForAvailable,
    moveRoleToPending,
    removeRole,
    clearAssignedRoles,
    setIsModalOpen,
    confirmAssignment,
  } = useDesignationRoleMapping();

  const {
    designations: tableDesignations,
    designationAssignments: tableAssignments,
  } = useDesignationRoleMappingTable();

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
        title="Confirm Role Assignment"
        message={`Are you sure you want to assign ${pendingCount} roles?`}
        confirmText="Confirm & Save"
        cancelText="Cancel"
        type="warning"
      />

      <ConfirmationModal
        isOpen={isClearModalOpen}
        onCancel={() => setIsClearModalOpen(false)}
        onConfirm={() => {
          clearAssignedRoles();
          setIsClearModalOpen(false);
        }}
        title="Clear Assigned Roles"
        message="Are you sure you want to clear all assigned roles?"
        confirmText="Yes, Clear"
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
            All Designations Overview
          </button>
        </div>

        {viewMode === "assignment" && (
          <div className="rounded-lg border border-slate-200 bg-white px-5 py-2 text-sm font-medium text-slate-500 shadow-sm">
            Managing:
            <span className="ml-2 font-bold text-blue-700">
              {selectedDesignation?.name || "Select a Designation"}
            </span>
          </div>
        )}
      </div>

      {viewMode === "overview" ? (
        <div className="h-[calc(100vh-140px)] px-6">
          <DesignationRoleMappingTable
            designations={tableDesignations}
            designationAssignments={tableAssignments}
            onManageDesignation={(designationId: string) => {
              handleDesignationSelect(designationId);
              setViewMode("assignment");
            }}
          />
        </div>
      ) : (
        <KanbanBoard>
          <DesignationsColumn
            designations={designations}
            assignments={combinedAssignments}
            selectedDesignationId={selectedDesignationId}
            searchQuery={designationSearchQuery}
            onSearchChange={setDesignationSearchQuery}
            onDesignationSelect={handleDesignationSelect}
          />

          <AssignedColumn
            roles={assignedRoles}
            pendingCount={pendingCount}
            onRemove={removeRole}
            onClear={() => setIsClearModalOpen(true)}
            onSave={() => pendingCount > 0 && setIsModalOpen(true)}
          />

          <AvailableColumn
            roles={availableRoles}
            searchQuery={roleSearchQuery}
            tempAccessTypes={tempAccessTypes}
            onSearchChange={setRoleSearchQuery}
            onSetAccess={setAccessTypeForAvailable}
            onMove={moveRoleToPending}
            selectedDesignationId={selectedDesignationId}
          />
        </KanbanBoard>
      )}
    </div>
  );
};
