import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Breadcrumb,
  PageWrapper,
  TitleHeader,
  type BreadcrumbItem,
} from "@/components";
import { useTenant } from "./components/Hooks/useTenant";
import { TenantForm } from "./components/Form/TenantForm";
import { PlusCircle } from "lucide-react";
import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button";
import { TenantTable } from "./components/Table/TenantTable";
import type { TenantType } from "@/types/customer-management/tenant";
import { useLazyGetMasterTenantsQuery } from "@/global/service/end-points/customer-management/tenant";

export const TenantPage: React.FC = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const formRef = useRef<HTMLDivElement | null>(null);
  const [fetchTenants, { data = [] }] = useLazyGetMasterTenantsQuery();

  useEffect(() => {
    fetchTenants();
  }, [fetchTenants]);

  const tenantHook = useTenant();
  const handleDeletedTenant = (deletedId: string) => {
  if (tenantHook.editId === deletedId) {
    tenantHook.onReset();
    setShowForm(true);    
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
    { label: "Tenant", active: true },
  ];

  const handleAddClick = () => {
    setShowForm(true);
  };

  const handleCancelClick = () => {
    tenantHook.onCancel();
    setShowForm(false);
  };

  const handleEdit = (data: TenantType) => {
    setShowForm(true);
    tenantHook.onEdit(data);

    setTimeout(() => {
      formRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }, 150);
  };

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
            <TitleHeader title="Tenant" className="py-4" />
            <NeumorphicButton
              type="button"
              variant="default"
              size="default"
              onClick={handleAddClick}
            >
              <PlusCircle className="mr-1 h-3 w-3" />
              Add Tenant
            </NeumorphicButton>
          </div>

          {showForm && (
            <div ref={formRef}>
              <TenantForm
                control={tenantHook.control}
                register={tenantHook.register}
                errors={tenantHook.errors}
                isSubmitting={tenantHook.isSubmitting}
                onSubmit={tenantHook.handleSubmit(tenantHook.onSubmit)}
                onCancel={handleCancelClick}
                onReset={tenantHook.onReset}
                editId={tenantHook.editId}
              />
            </div>
          )}
        </section>
      </PageWrapper>

      <PageWrapper
        variant="default"
        padding="xl"
        maxWidth="xl"
        contentPadding="sm"
        className="pt-0 md:pt-0 lg:pt-0"
      >
        <section className="p-4 lg:p-8 xl:p-10">
          <TitleHeader className="pb-4" title="List of Tenants" />
          <TenantTable
            data={data}
            isLoading={false}
            refetchTenants={fetchTenants}
            onEdit={handleEdit}
            onDeleted={handleDeletedTenant}
          />
        </section>
      </PageWrapper>
    </div>
  );
};
