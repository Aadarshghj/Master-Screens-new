import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { Breadcrumb, type BreadcrumbItem } from "@/components";
import type { ApproverRoleMappingForm } from "@/types/admin/approverrolemap";
import { ApprovalRoleMappingSchema } from "@/global/validation/admin/approver-role-map";
import { ApproverRoleMappingSetup } from "./components/Form/ApproverRoleMapSetup";
import { ApproverRoleMappingTable } from "./components/Table/ApproverRoleMapTable";
import { APPROVER_ROLE_MAPPING_DEFAULT_VALUES } from "./constants/approverRoleMap-default";
import { APPROVER_ROLE_MAPPING_MOCK_DATA } from "@/mocks/admin/approverRoleMap";

export const WorkflowApproverRoleMappingPage: React.FC = () => {
  const navigate = useNavigate();

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ApproverRoleMappingForm>({
    resolver: yupResolver(
      ApprovalRoleMappingSchema
    ) as Resolver<ApproverRoleMappingForm>,
    defaultValues: APPROVER_ROLE_MAPPING_DEFAULT_VALUES,
  });

  const onSubmit = (data: ApproverRoleMappingForm) => {
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
    { label: "Approver Role Mapping", active: true },
  ];

  const [tableData, setTableData] = useState<ApproverRoleMappingForm[]>(
    APPROVER_ROLE_MAPPING_MOCK_DATA
  );

  const handleEditRule = (row: ApproverRoleMappingForm) => {
    reset(row);
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
          <ApproverRoleMappingSetup
            control={control}
            register={register}
            errors={errors}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit(onSubmit)}
            onCancel={handleCancel}
            onReset={handleReset}
          />
        </section>
        <section>
          <ApproverRoleMappingTable
            data={tableData}
            onEdit={handleEditRule}
            onDelete={handleDeleteRule}
          />
        </section>
      </div>
    </main>
  );
};
