import React from "react";
import { useNavigate } from "react-router-dom";
import { Breadcrumb, type BreadcrumbItem } from "@/components";
import { GLAccountTypesForm } from "./components/Form/GlAccountTypes";

export const GLAccountTypesPage: React.FC = () => {
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
      label: "GL Account Types for Loan Scheme Posting",
      href: "/loan/products-scheme/gl-account-types",
      onClick: () => navigate("/loan/products-scheme/gl-account-types"),
    },
  ];

  return (
    <div className="space-y-6">
      <section>
        <Breadcrumb
          items={breadcrumbItems}
          variant="default"
          size="sm"
          className="mt-4 mb-4 ml-4"
        />
      </section>
      <GLAccountTypesForm />
    </div>
  );
};
