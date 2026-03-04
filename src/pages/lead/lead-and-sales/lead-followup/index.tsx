import React from "react";
import { LeadFollowupDetails } from "./components/Form/LeadFollowupDetails";
import { useNavigate } from "react-router-dom";
import { Breadcrumb, type BreadcrumbItem } from "@/components";

export const LeadFollowupPage: React.FC = () => {
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
      label: "Lead follow-up details",
      href: "/customer/lead-sales/followup",
      onClick: () => navigate("/customer/lead-sales/followup"),
    },
  ];

  return (
    <>
      <div className="space-y-6">
        <section>
          <Breadcrumb
            items={breadcrumbItems}
            variant="default"
            size="sm"
            className="mt-4 mb-4 ml-2"
          />
        </section>
        <LeadFollowupDetails />
      </div>
    </>
  );
};
