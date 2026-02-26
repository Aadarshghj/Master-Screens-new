import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import {
  Breadcrumb,
  TitleHeader,
  type BreadcrumbItem,
  PageWrapper,
} from "@/components";
import { RoleManagementForm } from "./components/Form/RoleManagementForm";
import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button";
import { RoleManagementTable } from "./components/Table/RoleManagementTable";
import { useRoleManagement } from "./components/Hooks/useRoleManagement";
import { useLazyGetRoleByIdQuery } from "@/global/service/end-points/customer-management/role-management";
import type { RoleManagementType } from "@/types/customer-management/role-management";

export const RoleManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const [showForm, setShowform] = useState(false);
  const formRef = useRef<HTMLDivElement | null>(null);
  const [selectedRow, setSelectedRow] = useState<RoleManagementType | null>(
    null
  );

  const [fetchRoleById] = useLazyGetRoleByIdQuery();

  const {
    control,
    register,
    handleSubmit,
    errors,
    isSubmitting,
    onSubmit,
    onReset,
    onCancel,
    reset,
  } = useRoleManagement(selectedRow ?? undefined);

  const handleShowForm = () => {
    setSelectedRow(null);
    reset();
    setShowform(true);
  };
  const handleCancelClick = () => {
    onCancel();
    setSelectedRow(null);
    setShowform(false);
  };

  const onEdit = async (data: RoleManagementType) => {
    try {
      const response = await fetchRoleById(data.identity).unwrap();

      // If API returns array, extract first item
      const result = Array.isArray(response) ? response[0] : response;

      if (!result) {
        console.error("No record found");
        return;
      }

      setSelectedRow(result);
      setShowform(true);
      reset(result);

      requestAnimationFrame(() => {
        formRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      });
    } catch (error) {
      console.error("Failed to fetch record:", error);
    }
  };

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Home", href: "/", onClick: () => navigate("/") },
    {
      label: "Customer Management System",
      href: "/customer",
      onClick: () => navigate("/customer"),
    },
    {
      label: "Master",
      href: "/customer/master",
      onClick: () => navigate("/customer/master"),
    },
    { label: "Role Management", active: true },
  ];

  return (
    <div className="space-y-6">
      <PageWrapper
        variant="default"
        padding="xl"
        maxWidth="xl"
        contentPadding="sm"
        className="m-0 min-h-fit pb-4"
      >
        <section className="p-4 lg:p-8 xl:p-10">
          <Breadcrumb items={breadcrumbItems} variant="default" size="sm" />

          <div className="flex items-center justify-between">
            <TitleHeader title="Role Management" className="py-4" />

            <NeumorphicButton
              type="button"
              variant="default"
              size="default"
              onClick={handleShowForm}
            >
              <PlusCircle width={13} />
              Add User Role
            </NeumorphicButton>
          </div>

          {showForm && (
            <RoleManagementForm
              control={control}
              register={register}
              errors={errors}
              isSubmitting={isSubmitting}
              onSubmit={handleSubmit(onSubmit)}
              onCancel={handleCancelClick}
              onReset={onReset}
              isEdit={!!selectedRow}
            />
          )}
        </section>
      </PageWrapper>

      <PageWrapper
        variant="default"
        padding="xl"
        maxWidth="xl"
        contentPadding="sm"
        className="pt-0"
      >
        <section className="p-4 lg:p-8 xl:p-10">
          <TitleHeader className="pb-4" title="List of Roles" />

          <RoleManagementTable onEdit={onEdit} />
        </section>
      </PageWrapper>
    </div>
  );
};
