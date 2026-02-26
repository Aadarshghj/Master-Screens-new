import React from "react";
import { useNavigate } from "react-router-dom";
import { Breadcrumb, PageWrapper, type BreadcrumbItem } from "@/components";
import { LoanSchemeAttributesForm } from "./components/Form/LoanSchemeAttributes";
import { LoanSchemeAttributesFilterTable } from "./components/Form/LoanSchemeAttributeFilter";

export const LoanSchemeAttributesPage: React.FC = () => {
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
      label: "Loan Scheme Attributes Master",
      href: "/loan/products-scheme/scheme-attributes",
      onClick: () => navigate("/loan/products-scheme/scheme-attributes"),
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
          <LoanSchemeAttributesForm />
        </PageWrapper>
        <PageWrapper
          variant="default"
          padding="xl"
          maxWidth="xl"
          contentPadding="sm"
          className="m-0 min-h-fit "
        >
          <LoanSchemeAttributesFilterTable />
        </PageWrapper>
      </div>
    </>
  );
};
