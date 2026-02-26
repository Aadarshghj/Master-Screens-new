import React from "react";
import { LeadDetailsForm } from "./components/Form/LeadDetails";
import { useNavigate } from "react-router-dom";
import { Breadcrumb, type BreadcrumbItem } from "@/components";

export const LeadDetailsPage: React.FC = () => {
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
      label: "Lead Details",
      href: "/customer/lead-sales/lead-details",
      onClick: () => navigate("/customer/lead-sales/lead-details"),
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
      <LeadDetailsForm />
    </div>
  );
};
