import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Breadcrumb, PageWrapper, type BreadcrumbItem } from "@/components";
import type { WorkflowAmountRule } from "@/types/approval-workflow/workflow-amount.types";
import { WorkflowAmountRules } from "./components/Form/AmountRules";
import { AmountRulesFilter } from "./components/Form/AmountRulesFilter";
import { WorkflowNavigation } from "../components/WorkflowNavigation";

export const WorkflowAmountRulesPage: React.FC = () => {
  const navigate = useNavigate();
  const [editingRule, setEditingRule] = useState<WorkflowAmountRule | null>(
    null
  );
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedWorkflow, setSelectedWorkflow] = useState<string>("");

  const handleRuleUpdated = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleEdit = (rule: WorkflowAmountRule) => {
    setEditingRule(rule);
  };

  const handleWorkflowChange = (workflow: string) => {
    setSelectedWorkflow(workflow);
  };

  const breadcrumbItems: BreadcrumbItem[] = [
    {
      label: "Home",
      href: "/",
      onClick: () => navigate("/"),
    },
    {
      label: "Administration",
      href: "/administration",
      onClick: () => navigate("/administration"),
    },
    {
      label: "Approval Workflow Management",
      href: "/administration/workflow",
      onClick: () => navigate("/administration/workflow"),
    },
    {
      label: "Workflow Amount Rules",
      href: "/administration/workflow/amount-rules",
      onClick: () => navigate("/administration/workflow/amount-rules"),
    },
  ];

  return (
    <>
      <div className="space-y-6">
        <PageWrapper
          variant="default"
          padding="xl"
          maxWidth="xl"
          contentPadding="sm"
          className="m-0 min-h-fit"
        >
          <div className="mb-6 px-4 pt-4">
            <WorkflowNavigation />
          </div>
          <section>
            <Breadcrumb
              items={breadcrumbItems}
              variant="default"
              size="sm"
              className="mt-4 mb-4 ml-4"
            />
          </section>
          <WorkflowAmountRules
            editingRule={editingRule}
            setEditingRule={setEditingRule}
            onRuleUpdated={handleRuleUpdated}
            selectedWorkflow={selectedWorkflow}
            onWorkflowChange={handleWorkflowChange}
          />
        </PageWrapper>
        <PageWrapper
          variant="default"
          padding="xl"
          maxWidth="xl"
          contentPadding="sm"
          className="m-0 min-h-fit"
        >
          <AmountRulesFilter
            onEdit={handleEdit}
            selectedWorkflow={selectedWorkflow}
            onWorkflowChange={handleWorkflowChange}
            key={refreshTrigger}
          />
        </PageWrapper>
      </div>
    </>
  );
};

export default WorkflowAmountRulesPage;
