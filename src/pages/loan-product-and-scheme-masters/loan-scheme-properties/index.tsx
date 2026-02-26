import React from "react";
import { useNavigate } from "react-router-dom";
import { Breadcrumb, PageWrapper, type BreadcrumbItem } from "@/components";
import { LoanSchemePropertiesForm } from "./components/Form/LoanSchemeProperties";
import { LoanSchemePropertiesFilterTable } from "./components/Form/LoanSchemePropertiesFilter";

export const LoanSchemePropertiesPage: React.FC = () => {
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
      label: "Loan Scheme Properties Master",
      href: "/loan/products-scheme/scheme-properties",
      onClick: () => navigate("/loan/products-scheme/scheme-properties"),
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
          <LoanSchemePropertiesForm />
        </PageWrapper>
        <PageWrapper
          variant="default"
          padding="xl"
          maxWidth="xl"
          contentPadding="sm"
          className="m-0 min-h-fit"
        >
          <LoanSchemePropertiesFilterTable />
        </PageWrapper>
      </div>
    </>
  );
};
