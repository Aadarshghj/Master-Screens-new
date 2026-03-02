import React from "react";
import { Users, Check } from "lucide-react";
import { KanbanColumn } from "@/components/ui/kanban/KanbanColumn";
import { cn } from "@/utils";
import type {
  UserProfile,
  AssignedRole,
} from "@/types/user-role-mapping/user-mapping";

interface Props {
  users: UserProfile[];
  assignments: Record<string, AssignedRole[]>;
  selectedUserId: string;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onUserSelect: (id: string) => void;
}

export const UsersColumn: React.FC<Props> = ({
  users,
  assignments,
  selectedUserId,
  searchQuery,
  onSearchChange,
  onUserSelect,
}) => {
  console.log(users);

  return (
    <KanbanColumn
      title="Users"
      icon={<Users size={18} className="text-blue-600" />}
      count={users.length}
    >
      <input
        type="text"
        placeholder="Search user..."
        value={searchQuery}
        onChange={e => onSearchChange(e.target.value)}
        className="mb-3 w-full rounded border border-slate-200 bg-white p-2 text-xs"
      />

      {users.map(user => {
        const userRoles = assignments?.[user.id] ?? [];
        const activeCount = userRoles.filter(r => r.status === "Active").length;
        const pendingCount = userRoles.filter(
          r => r.status === "Pending"
        ).length;

        const isSelected = selectedUserId === user.id;

        return (
          <div
            key={user.id}
            onClick={() => onUserSelect(user.id)}
            className={cn(
              "group relative mb-1.5 cursor-pointer rounded-lg border p-2 transition-all hover:shadow-sm",
              isSelected
                ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500/20"
                : "border-slate-200 bg-white hover:border-blue-300"
            )}
          >
            <div className="flex items-center gap-2.5">
              {/* Avatar */}
              <div className="relative shrink-0">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-bold text-white shadow-sm",
                    user.color
                  )}
                >
                  {user.initial}
                </div>

                {activeCount > 0 && (
                  <div className="absolute -top-1 -left-1 flex h-3.5 w-3.5 items-center justify-center rounded-full border border-white bg-green-500 text-[8px] font-bold text-white">
                    {activeCount}
                  </div>
                )}

                {pendingCount > 0 && (
                  <div className="absolute top-3 -left-1 flex h-3.5 w-3.5 items-center justify-center rounded-full border border-white bg-orange-500 text-[8px] font-bold text-white">
                    {pendingCount}
                  </div>
                )}
              </div>

              {/* Text */}
              <div className="min-w-0 flex-1">
                <h4 className="truncate text-xs font-medium text-slate-800">
                  {" "}
                  {user.name}
                </h4>
                <p className="truncate text-[10px] text-slate-400">
                  {user.empId || "No Department"}
                </p>
              </div>

              {isSelected && (
                <div className="text-blue-600">
                  <Check size={14} strokeWidth={3} />
                </div>
              )}
            </div>
          </div>
        );
      })}
    </KanbanColumn>
  );
};
