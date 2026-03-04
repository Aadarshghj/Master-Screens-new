import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button";

const WORKFLOW_ROUTES = [
  {
    path: "/loan-management/Approval-workflow/definition",
    label: "Workflow Definitions",
  },
  {
    path: "/loan-management/Approval-workflow/workflow-stages-setup",
    label: "Workflow Stage Setup",
  },
  {
    path: "/loan-management/Approval-workflow/workflow-amountrules",
    label: "Amount Rules",
  },
  {
    path: "/loan-management/Approval-workflow/workflow-rolemapping",
    label: "Role Mapping",
  },
  {
    path: "/loan-management/Approval-workflow/actions",
    label: "Workflow Actions",
  },
  {
    path: "/loan-management/Approval-workflow/workflow-manageuserdelegation",
    label: "User Delegation",
  },
  {
    path: "/loan-management/approval-workflow/workflow-user-leave-status",
    label: "Leave Status",
  },
  {
    path: "/loan-management/approval-workflow/workflow-approval-queue",
    label: "Approval Queue",
  },
];

export const WorkflowNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const currentIndex = WORKFLOW_ROUTES.findIndex(
    r => r.path === location.pathname
  );
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < WORKFLOW_ROUTES.length - 1;
  const previous = hasPrevious ? WORKFLOW_ROUTES[currentIndex - 1] : null;
  const next = hasNext ? WORKFLOW_ROUTES[currentIndex + 1] : null;

  return (
    <div className="flex items-center justify-between gap-4">
      {previous ? (
        <NeumorphicButton
          onClick={() => navigate(previous.path)}
          variant="secondary"
          size="default"
          className="bg-slate-700 text-white hover:bg-slate-800"
        >
          <ChevronLeft className="h-3 w-3" />
          {previous.label}
        </NeumorphicButton>
      ) : (
        <div />
      )}

      {next ? (
        <NeumorphicButton
          onClick={() => navigate(next.path)}
          variant="secondary"
          size="default"
          className="bg-slate-700 text-white hover:bg-slate-800"
        >
          {next.label}
          <ChevronRight className="h-3 w-3" />
        </NeumorphicButton>
      ) : (
        <div />
      )}
    </div>
  );
};
