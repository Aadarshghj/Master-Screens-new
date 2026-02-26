import React from "react";
import { LeadAssignment } from "./components/Form/LeadAssignment";
import { useNavigate } from "react-router-dom";
import { Breadcrumb, type BreadcrumbItem } from "@/components";

export const LeadAssignmentPage: React.FC = () => {
  const navigate = useNavigate();

  const breadcrumbItems: BreadcrumbItem[] = [
    {
      label: "Home",
      href: "/",
      onClick: () => navigate("/"),
    },
    {
      label: "Customer Management System",
      href: "/customer",
      onClick: () => navigate("/customer"),
    },
    {
      label: "Lead and Sales Management",
      href: "/customer/lead-sales",
      onClick: () => navigate("/customer/lead-sales"),
    },
    {
      label: "Lead Assignment ",
      href: "/customer/lead-sales/assignment",
      onClick: () => navigate("/customer/lead-sales/assignment"),
    },
  ];

  return (
    <div className="space-y-6">
      <section>
        <Breadcrumb
          items={breadcrumbItems}
          variant="default"
          size="sm"
          className="mb-1"
        />
      </section>

      <LeadAssignment />
    </div>
  );
};

export default LeadAssignmentPage;
