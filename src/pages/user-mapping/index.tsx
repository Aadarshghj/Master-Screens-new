import React from "react";
import { useNavigate } from "react-router-dom";
import { Breadcrumb, type BreadcrumbItem } from "@/components";

import { UserRoleMappingContainer } from "./components/Form/UserRoleMappingContainer";

export const UserRoleMappingPage: React.FC = () => {
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
      label: "User Role Mapping Master",
      href: "/customer-management/master/user-role-mapping",
      onClick: () => navigate("/customer-management/master/user-role-mapping"),
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
      <UserRoleMappingContainer />
    </div>
  );
};

export default UserRoleMappingPage;
