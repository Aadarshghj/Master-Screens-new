import React, { useState } from "react";
import { LayoutGrid, Table as TableIcon } from "lucide-react";

import { useUserRoleMapping } from "../Hooks/UseUserRoleMapping";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { cn } from "@/utils";

import { KanbanBoard } from "../../../../components/ui/kanban/KanbanBoard";
import { UsersColumn } from "./kanban/UserColumn";
import { AssignedColumn } from "./kanban/AssignedRoles";
import { AvailableColumn } from "./kanban/AvailableRows";

import { UserRoleMappingTable } from "../Table/UserRoleMappingTable";

export const UserRoleMappingContainer: React.FC = () => {
  const {
    users,
    assignedRoles,
    assignments,
    availableRoles,
    selectedUser,
    selectedUserId,
    userSearchQuery,
    roleSearchQuery,
    tempAccessTypes,
    pendingCount,
    isModalOpen,
    accessOptions,

    roleToRemove,
    setRoleToRemove,
    confirmRemoveRole,

    setUserSearchQuery,
    setRoleSearchQuery,
    handleUserSelect,
    setAccessTypeForAvailable,
    moveRoleToPending,
    removeRole,
    isClearModalOpen,
    clearAssignedRoles,
    setIsClearModalOpen,
    setIsModalOpen,
    confirmAssignment,
  } = useUserRoleMapping();

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
        onConfirm={clearAssignedRoles}
        title="Clear Pending Roles"
        message={`Are you sure you want to remove ${pendingCount} unsaved pending roles?`}
        confirmText="Yes, Clear"
        cancelText="Cancel"
        type="warning"
      />

      <ConfirmationModal
        isOpen={!!roleToRemove}
        onCancel={() => setRoleToRemove(null)}
        onConfirm={confirmRemoveRole}
        title="Remove Assigned Role"
        message={`Are you sure you want to remove the "${roleToRemove?.title}" role? This will revoke their permissions immediately.`}
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
                ? "bg-blue-600 text-white shadow-sm"
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
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-200 hover:text-slate-900"
            )}
          >
            <TableIcon size={14} />
            User Roles Overview
          </button>
        </div>

        {viewMode === "assignment" && (
          <div className="rounded-lg border border-slate-200 bg-white px-5 py-2 text-sm font-medium text-slate-500 shadow-sm">
            Managing:
            <span className="ml-2 font-bold text-blue-700">
              {selectedUser?.name || "Select a User"}
            </span>
          </div>
        )}
      </div>

      {viewMode === "overview" ? (
        <div className="relative flex-1 overflow-auto p-3">
          <UserRoleMappingTable
            users={users}
            assignments={assignments}
            onManageUser={userId => {
              handleUserSelect(userId);
              setViewMode("assignment");
            }}
          />
        </div>
      ) : (
        <KanbanBoard>
          <UsersColumn
            users={users}
            assignments={assignments}
            selectedUserId={selectedUserId}
            searchQuery={userSearchQuery}
            onSearchChange={setUserSearchQuery}
            onUserSelect={handleUserSelect}
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
            accessOptions={accessOptions}
            onSearchChange={setRoleSearchQuery}
            onSetAccess={setAccessTypeForAvailable}
            onMove={moveRoleToPending}
            isDisabled={!selectedUserId}
          />
        </KanbanBoard>
      )}
    </div>
  );
};
