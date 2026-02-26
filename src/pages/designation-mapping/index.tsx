import React from "react";
import { useNavigate } from "react-router-dom";
import { Breadcrumb, type BreadcrumbItem } from "@/components";

import { DesignationRoleMappingContainer } from "./components/Form/DesignationRoleMappingContainer";

export const DesignationRoleMappingPage: React.FC = () => {
  const navigate = useNavigate();

  const breadcrumbItems: BreadcrumbItem[] = [
    {
      label: "Home",
      href: "/",
      onClick: () => navigate("/"),
    },
    {
      label: "Customer Management",
      href: "/customer-management",
      onClick: () => navigate("/customer-management"),
    },
    {
      label: "Master",
      href: "/customer-management/master",
      onClick: () => navigate("/customer-management/master"),
    },
    {
      label: "Designation Role Mapping",
      href: "/customer-management/master/designation-role-mapping",
      onClick: () =>
        navigate("/customer/user-mapping/designation-role-mapping"),
    },
  ];

  return (
    <div className="space-y-6">
      <section className="space-y-6 px-6 pt-12">
        <Breadcrumb
          items={breadcrumbItems}
          variant="default"
          size="sm"
          className="mb-1"
        />
      </section>
      <DesignationRoleMappingContainer />
    </div>
  );
};

export default DesignationRoleMappingPage;
