import React, { useState } from "react";
import { Shield, Trash2, Save, Clock, X } from "lucide-react";
import { KanbanColumn } from "@/components/ui/kanban/KanbanColumn";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { cn } from "@/utils";
import type { AssignedRole } from "../../../constants";

interface Props {
  roles: AssignedRole[];
  pendingCount: number;
  onRemove: (id: string) => void;
  onClear: () => void;
  onSave: () => void;
}

export const AssignedColumn: React.FC<Props> = ({
  roles,
  pendingCount,
  onRemove,
  onClear,
  onSave,
}) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setRoleToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (roleToDelete) {
      onRemove(roleToDelete);
    }
    setIsDeleteModalOpen(false);
    setRoleToDelete(null);
  };

  return (
    <>
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setRoleToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Remove Role"
        message="Are you sure you want to remove this role?"
        confirmText="Yes, Remove"
        cancelText="Cancel"
        type="warning"
      />

      <KanbanColumn
        title="Assigned Roles"
        icon={<Shield size={18} className="text-green-500" />}
        count={roles.length}
        footer={
          <div className="flex justify-end gap-3 border-t border-slate-200 bg-white p-2">
            <button
              onClick={onClear}
              disabled={pendingCount === 0}
              className={cn(
                "flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium transition-colors",
                pendingCount > 0
                  ? "text-slate-600 hover:bg-slate-50 hover:text-red-600"
                  : "cursor-not-allowed bg-slate-100 text-slate-400"
              )}
            >
              <Trash2 size={11} /> Clear
            </button>

            <button
              onClick={onSave}
              disabled={pendingCount === 0}
              className={cn(
                "flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white shadow-md transition-all active:scale-[0.98]",
                pendingCount > 0
                  ? "bg-blue-600 hover:bg-blue-700 hover:shadow-lg"
                  : "cursor-not-allowed bg-slate-300"
              )}
            >
              <Save size={11} /> Save {pendingCount > 0 && `(${pendingCount})`}
            </button>
          </div>
        }
      >
        {roles.length === 0 ? (
          <div className="flex h-40 flex-col items-center justify-center text-sm text-slate-400">
            <Shield size={32} className="mb-2 opacity-20" />
            No roles assigned
          </div>
        ) : (
          roles.map(role => {
            const isPending = role.status === "Pending";

            return (
              <div
                key={role.id}
                className={cn(
                  "relative mb-2 rounded-lg border p-3 transition-all duration-200",
                  isPending
                    ? "border-orange-200 bg-orange-100"
                    : "border-slate-200 bg-green-200 hover:border-blue-300"
                )}
              >
                <button
                  onClick={() => handleDeleteClick(role.id)}
                  className={cn(
                    "absolute top-2 right-2 rounded-full p-1 opacity-60 transition-colors hover:opacity-100",
                    isPending
                      ? "text-orange-800 hover:bg-orange-200"
                      : "text-slate-500 hover:bg-slate-200/50"
                  )}
                >
                  <X size={12} strokeWidth={3} />
                </button>

                <div className="mb-1 flex items-center gap-1">
                  <Shield
                    size={11}
                    className={isPending ? "text-orange-900" : "text-slate-500"}
                  />
                  <span
                    className={
                      isPending
                        ? "text-[10px] font-semibold text-orange-800"
                        : "text-[10px] font-semibold text-slate-500"
                    }
                  >
                    {role.title}
                  </span>
                  <Clock
                    size={9}
                    className={
                      isPending ? "ml-2 text-orange-900" : "text-slate-500"
                    }
                  />
                </div>

                <p
                  className={
                    isPending
                      ? "mb-1 text-[10px] font-medium text-orange-400"
                      : "mb-1 text-[10px] text-slate-500"
                  }
                >
                  {role.title}
                </p>

                <div>
                  <span
                    className={
                      isPending
                        ? "mb-1 block text-[10px] font-bold text-orange-900"
                        : "mb-1 block text-[10px] font-bold text-slate-500"
                    }
                  >
                    Access Level:
                  </span>

                  <div
                    className={cn(
                      "rounded border p-2",
                      isPending
                        ? "border-orange-100 bg-orange-50"
                        : "border-slate-100 bg-green-100"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={cn(
                          "text-[10px] font-bold uppercase",
                          isPending ? "text-orange-700" : "text-green-700"
                        )}
                      >
                        {role.accessLevel}
                      </span>

                      <div className="flex items-center gap-2">
                        {isPending && (
                          <span className="flex items-center gap-1 text-[10px] font-medium whitespace-nowrap text-orange-500">
                            <Clock size={10} /> (Pending)
                          </span>
                        )}

                        <button
                          onClick={() => handleDeleteClick(role.id)}
                          className="rounded border border-red-100 bg-red-50 px-2 py-0.5 text-[10px] font-semibold text-red-600 transition-colors hover:bg-red-100"
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    {isPending && (
                      <p className="mt-1.5 border-t border-orange-50 pt-1 text-[10px] font-medium text-orange-400">
                        Will be assigned with {role.accessLevel} access
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </KanbanColumn>
    </>
  );
};
