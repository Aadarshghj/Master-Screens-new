import React, { useState } from "react";
import { Shield, Plus } from "lucide-react";
import { KanbanColumn } from "@/components/ui/kanban/KanbanColumn";
import { cn } from "@/utils";
import type {
  AvailableRole,
  AccessType,
} from "@/types/user-role-mapping/user-mapping";

export interface AccessOption {
  label: string;
  value: string;
  code: string;
}

interface Props {
  roles: AvailableRole[];
  searchQuery: string;
  tempAccessTypes: Record<string, AccessType>;
  accessOptions: AccessOption[];
  onSearchChange: (q: string) => void;
  onSetAccess: (id: string, type: AccessType) => void;
  onMove: (role: AvailableRole) => void;
  isDisabled?: boolean; 
}

export const AvailableColumn: React.FC<Props> = ({
  roles,
  searchQuery,
  tempAccessTypes,
  accessOptions = [],
  onSearchChange,
  onSetAccess,
  onMove,
  isDisabled,
}) => {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    if (isDisabled) return;

    setExpandedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <KanbanColumn
      title="Available Roles"
      icon={<Shield size={18} className="text-slate-400" />}
      count={roles.length}
    >
      <input
        type="text"
        placeholder="Search available roles..."
        value={searchQuery}
        onChange={e => onSearchChange(e.target.value)}
        className="mb-3 w-full rounded border border-slate-200 bg-white p-2 text-xs"
      />

      {roles.map(role => {
        const isExpanded = expandedIds.has(role.id);

        const defaultAccess =
          accessOptions.length > 0 ? accessOptions[0].value : "";
        const currentAccess = tempAccessTypes[role.id] || defaultAccess;

        return (
          <div
            key={role.id}
            onClick={() => toggleExpand(role.id)}
            className={cn(
              "group mb-2 rounded-lg border p-3 transition-all",
              isDisabled
                ? "cursor-not-allowed border-slate-100 bg-slate-50 opacity-60"
                : "cursor-pointer border-slate-100 bg-white hover:border-blue-400 hover:shadow-md"
            )}
          >
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={isExpanded}
                disabled={isDisabled} // 👈 Disable checkbox
                onClick={e => e.stopPropagation()}
                onChange={() => toggleExpand(role.id)}
                className={cn(
                  "mt-1",
                  isDisabled ? "cursor-not-allowed" : "cursor-pointer"
                )}
              />

              <div className="min-w-0 flex-1">
                <div className="mb-0.5 flex items-center gap-2">
                  <Shield size={14} className="shrink-0 text-gray-400" />
                  <h4
                    className={cn(
                      "truncate text-[10px] font-bold transition-colors",
                      isDisabled
                        ? "text-slate-500"
                        : "text-slate-700 group-hover:text-blue-700"
                    )}
                  >
                    {role.title}
                  </h4>
                </div>

                <p className="truncate text-[10px] leading-tight text-slate-400">
                  {role.subtitle || role.title}
                </p>

                {isExpanded && !isDisabled && (
                  <div
                    className="animate-in slide-in-from-top-2 mt-3 duration-200"
                    onClick={e => e.stopPropagation()}
                  >
                    <label className="mb-2 block text-[9px] font-bold tracking-wider text-slate-400 uppercase">
                      Select Access
                    </label>

                    <div className="flex flex-wrap gap-2">
                      {accessOptions.map((option: AccessOption) => (
                        <button
                          key={option.value}
                          disabled={isDisabled} // 👈 Disable access buttons
                          onClick={e => {
                            e.stopPropagation();
                            onSetAccess(role.id, option.value);
                          }}
                          className={cn(
                            "rounded border px-2.5 py-1 text-[9px] font-medium transition-all",
                            currentAccess === option.value
                              ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                              : "border-slate-200 bg-white text-slate-500 hover:border-blue-300 hover:text-blue-600"
                          )}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button
                disabled={isDisabled} // 👈 Disable Add button
                onClick={e => {
                  e.stopPropagation();
                  onMove(role);
                }}
                className={cn(
                  "flex items-center gap-1 rounded-md border px-2 py-1 text-[10px] font-bold whitespace-nowrap shadow-sm transition-all",
                  // 👇 Grays out the button if disabled
                  isDisabled
                    ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
                    : "border-slate-200 bg-slate-50 text-slate-600 hover:border-blue-600 hover:bg-blue-600 hover:text-white"
                )}
              >
                <Plus size={10} strokeWidth={3} />
                Add
              </button>
            </div>
          </div>
        );
      })}
    </KanbanColumn>
  );
};
