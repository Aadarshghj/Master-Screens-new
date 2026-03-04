import React from "react";
import { useNavigate } from "react-router-dom";
import { Breadcrumb, PageWrapper, type BreadcrumbItem } from "@/components";
import { LoanBusinessRulesForm } from "./components/Form/BusinessRules";
import { LoanBusinessRulesFilterTable } from "./components/Form/BusinessRulesFilter";

export const LoanBusinessRulesPage: React.FC = () => {
  const navigate = useNavigate();

  const breadcrumbItems: BreadcrumbItem[] = [
    {
      label: "Home",
      href: "/",
      onClick: () => navigate("/"),
    },
    {
      label: "Loan Management System",
      href: "/loan",
      onClick: () => navigate("/loan"),
    },
    {
      label: "Loan Products & Scheme",
      href: "/loan/products-scheme",
      onClick: () => navigate("/loan/products-scheme"),
    },
    {
      label: "Business Rules for Loan Processing",
      href: "/loan/products-scheme/business-rules",
      onClick: () => navigate("/loan/products-scheme/business-rules"),
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
          <section>
            <Breadcrumb
              items={breadcrumbItems}
              variant="default"
              size="sm"
              className="mt-4 mb-4 ml-4"
            />
          </section>
          <LoanBusinessRulesForm />
        </PageWrapper>
        <PageWrapper
          variant="default"
          padding="xl"
          maxWidth="xl"
          contentPadding="sm"
          className="m-0 min-h-fit"
        >
          <LoanBusinessRulesFilterTable />
        </PageWrapper>
      </div>
    </>
  );
};
