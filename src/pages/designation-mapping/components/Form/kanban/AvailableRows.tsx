import React, { useState } from "react";
import { Shield, Plus } from "lucide-react";
import { KanbanColumn } from "@/components/ui/kanban/KanbanColumn";
import { cn } from "@/utils";
import type { AvailableRole, AccessType } from "../../../constants";

interface Props {
  roles: AvailableRole[];
  searchQuery: string;
  tempAccessTypes: Record<string, AccessType>;
  onSearchChange: (q: string) => void;
  onSetAccess: (id: string, type: AccessType) => void;
  onMove: (role: AvailableRole) => void;
  selectedDesignationId: string;
}

export const AvailableColumn: React.FC<Props> = ({
  roles,
  searchQuery,
  tempAccessTypes,
  onSearchChange,
  onSetAccess,
  onMove,
  selectedDesignationId,
}) => {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [selectedRoles, setSelectedRoles] = useState<
    Record<string, AvailableRole>
  >({});

  const handleCardClick = (role: AvailableRole) => {
    setSelectedRoles(prev => {
      const copy = { ...prev };
      if (copy[role.id]) {
        delete copy[role.id];
      } else {
        copy[role.id] = role;
      }
      return copy;
    });

    setExpandedIds(prev => {
      const copy = new Set(prev);
      if (copy.has(role.id)) {
        copy.delete(role.id);
      } else {
        copy.add(role.id);
      }
      return copy;
    });
  };

  const toggleSelect = (role: AvailableRole) => {
    setSelectedRoles(prev => {
      const copy = { ...prev };
      const isAlreadySelected = !!copy[role.id];

      if (isAlreadySelected) {
        delete copy[role.id];
      } else {
        copy[role.id] = role;
      }

      return copy;
    });

    setExpandedIds(prev => {
      const copy = new Set(prev);
      const isAlreadyExpanded = copy.has(role.id);

      if (isAlreadyExpanded) {
        copy.delete(role.id);
      } else {
        copy.add(role.id);
      }

      return copy;
    });
  };

  const handleBulkAdd = () => {
    Object.values(selectedRoles).forEach(role => {
      onMove(role);
    });
    setSelectedRoles({});
  };

  const handleClearSelection = () => {
    setSelectedRoles({});
  };

  const selectedCount = Object.keys(selectedRoles).length;

  return (
    <KanbanColumn
      title="Available Roles"
      icon={<Shield size={18} className="text-slate-400" />}
      count={roles.length}
    >
      <div className="flex h-full flex-col">
        <input
          type="text"
          placeholder="Search available roles..."
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
          className="mb-3 w-full rounded border border-slate-200 bg-white p-2 text-xs"
        />

        <div className="flex-1 overflow-y-auto pr-1">
          {roles.map(role => {
            const isExpanded = expandedIds.has(role.id);
            const isSelected = !!selectedRoles[role.id];
            const currentAccess = tempAccessTypes[role.id] || "Read";

            return (
              <div
                key={role.id}
                onClick={() => handleCardClick(role)}
                className={cn(
                  "group mb-2 cursor-pointer rounded-lg border bg-white p-3 transition-all",
                  isSelected
                    ? "border-blue-500 shadow-md"
                    : "border-slate-100 hover:border-blue-400 hover:shadow-md"
                )}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onClick={e => e.stopPropagation()}
                    onChange={() => toggleSelect(role)}
                    className="mt-1 cursor-pointer"
                  />

                  <div className="min-w-0 flex-1">
                    <div className="mb-0.5 flex items-center gap-2">
                      <Shield size={14} className="text-gray-400" />
                      <h4 className="truncate text-[10px] font-bold text-slate-700 group-hover:text-blue-700">
                        {role.title}
                      </h4>
                    </div>

                    <p className="truncate text-[10px] text-slate-400">
                      {role.subtitle || role.title}
                    </p>

                    {isExpanded && (
                      <div className="mt-3" onClick={e => e.stopPropagation()}>
                        <label className="mb-2 block text-[9px] font-bold text-slate-400 uppercase">
                          Select Access
                        </label>

                        <div className="flex flex-wrap gap-2">
                          {(["Read", "Write", "Full"] as AccessType[]).map(
                            type => (
                              <button
                                key={type}
                                onClick={e => {
                                  e.stopPropagation();
                                  onSetAccess(role.id, type);
                                }}
                                className={cn(
                                  "rounded-md border px-2.5 py-1 text-[10px] font-semibold transition-all",
                                  currentAccess === type
                                    ? "border-blue-600 bg-blue-600 text-white"
                                    : "border-slate-200 bg-white text-slate-500 hover:border-blue-300 hover:text-blue-600"
                                )}
                              >
                                {type}
                              </button>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    disabled={!selectedDesignationId}
                    onClick={e => {
                      e.stopPropagation();
                      onMove(role);
                    }}
                    className={cn(
                      "flex items-center gap-1 rounded-md border px-2 py-1 text-[10px] font-bold transition-all",
                      selectedDesignationId
                        ? "border-slate-200 bg-slate-50 text-slate-600 hover:border-blue-600 hover:bg-blue-600 hover:text-white"
                        : "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
                    )}
                  >
                    <Plus size={10} strokeWidth={3} />
                    Add
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {selectedCount > 0 && (
          <div className="border-t border-slate-200 bg-white p-3 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600">
                {selectedCount} role(s) selected
              </span>

              <div className="flex gap-2">
                <button
                  onClick={handleClearSelection}
                  className="rounded-md border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100"
                >
                  Clear
                </button>

                <button
                  onClick={handleBulkAdd}
                  disabled={!selectedDesignationId}
                  className={cn(
                    "rounded-md px-3 py-1 text-xs font-semibold text-white",
                    selectedDesignationId
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "cursor-not-allowed bg-slate-300"
                  )}
                >
                  Add All
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </KanbanColumn>
  );
};
