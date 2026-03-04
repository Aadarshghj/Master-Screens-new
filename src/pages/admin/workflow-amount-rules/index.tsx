import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { Breadcrumb, type BreadcrumbItem } from "@/components";

import type {
  WorkflowAmountRules,
  WorkflowAmountRulesRow,
} from "@/types/admin/amountrules";
import { ApprovalFlowSetup } from "./components/Form/WorkflowAmountRules";
import { approvalFlowSchema } from "@/global/validation/admin/workflow-amount-rules";
import { WorkflowAmountRulesTable } from "./components/Table/WorkflowAmountRulesTable";
import { useGetWorkflowDefinitionsQuery } from "@/global/service/end-points/workflow/workflow-master-api";
import { WORKFLOW_AMOUNT_RULES_DEFAULT_VALUES } from "./constants/amountrule-defaultvalues";
import { WORKFLOW_AMOUNT_RULES_MOCK_DATA } from "@/mocks/admin/workflowAmountRules";
import { ApprovalFlowOptions } from "@/mocks/admin/approverFlowOptions";

export const WorkflowAmountRulesPage: React.FC = () => {
  const navigate = useNavigate();

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<WorkflowAmountRules>({
    resolver: yupResolver(
      approvalFlowSchema
    ) as unknown as Resolver<WorkflowAmountRules>,
    defaultValues: WORKFLOW_AMOUNT_RULES_DEFAULT_VALUES,
  });

  const { data: workflowData = [] } = useGetWorkflowDefinitionsQuery();

  const workflowOptions = useMemo(
    () =>
      workflowData.map(item => ({
        label: item.workflowName,
        value: item.identity,
      })),
    [workflowData]
  );

  const onSubmit = (data: WorkflowAmountRules) => {
    console.log("Workflow Amount Rules payload", data);
  };

  const handleCancel = () => {
    navigate("/admin/approve-workflow");
  };

  const handleReset = () => {
    reset();
  };

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Home", href: "/", onClick: () => navigate("/") },
    {
      label: "Administration",
      href: "/admin",
      onClick: () => navigate("/admin"),
    },
    {
      label: "Approve Workflow Management",
      href: "/admin/approve-workflow",
      onClick: () => navigate("/admin/approve-workflow"),
    },
    { label: "Workflow Amount Rules", active: true },
  ];

  const [tableData, setTableData] = useState<WorkflowAmountRulesRow[]>(
    WORKFLOW_AMOUNT_RULES_MOCK_DATA
  );

  const handleEditRule = (row: WorkflowAmountRulesRow) => {
    console.log("Edit workflow amount rule", row);
  };

  const handleDeleteRule = (id: string) => {
    setTableData(prev => prev.filter(item => item.id !== id));
  };

  return (
    <main>
      <div className="space-y-6">
        <section>
          <Breadcrumb items={breadcrumbItems} variant="default" size="sm" />
        </section>

        <section>
          <ApprovalFlowSetup
            control={control}
            register={register}
            errors={errors}
            isSubmitting={isSubmitting}
            workflowOptions={workflowOptions}
            approvalFlowOptions={ApprovalFlowOptions}
            onSubmit={handleSubmit(onSubmit)}
            onCancel={handleCancel}
            onReset={handleReset}
          />
        </section>

        <section>
          <WorkflowAmountRulesTable
            data={tableData}
            onEdit={handleEditRule}
            onDelete={handleDeleteRule}
          />
        </section>
      </div>
    </main>
  );
};
