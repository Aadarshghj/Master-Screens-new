import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Breadcrumb,
  TitleHeader,
  type BreadcrumbItem,
  PageWrapper,
  // ConfirmationModal,
} from "@/components";
import { useQuotationFilter } from "./components/Hooks/useQuotationRegFilter";
// import { BankConfigForm } from "./components/Form/CoLendingBankConfigForm";
import { QuotationFilterForm } from "./components/Form/QuotationRegFilter";
import { QuotationRegistrationTable } from "./components/Table/QuotationRegistrationTable";
import { useForm } from "react-hook-form";
import type { QuotationFilter } from "@/types/asset-management-system/quotation-registration-type";
import { QUOTATION_MOCK_DATA } from "@/mocks/asset-management-system/quotation-registration";

export const QuotationRegPage: React.FC = () => {
  const navigate = useNavigate();

  const { filteredData, applyFilter } = useQuotationFilter(QUOTATION_MOCK_DATA);
  const handlePageChange = (page: number) => {
  console.log("Page changed:", page);
};

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<QuotationFilter>({
    defaultValues: {
      reqId: "",
      status: "ALL",
    },
  });

  const breadcrumbItems: BreadcrumbItem[] = [
    {
      label: "Home",
      href: "/",
      onClick: () => navigate("/"),
    },
    {
      label: "Asset Management System",
      href: "/loan",
      onClick: () => navigate("/loan"),
    },
    {
      label: "Quotation Request List",
      active: true,
    },
  ];

  return (
    <div className="space-y-6">
      <PageWrapper
        variant="default"
        padding="xl"
        maxWidth="xl"
        contentPadding="sm"
        className="m-0 min-h-fit  pb-4"
      >
        <section className="p-4 lg:p-8 xl:p-10">
          <Breadcrumb items={breadcrumbItems} variant="default" size="sm" />
          <div className="flex items-center justify-between">
            <TitleHeader title="Quotation Request List" className="py-4" />
          </div>
          <div className="bg-secondary rounded-lg border p-2 shadow-sm">
            <QuotationFilterForm
              control={control}
              errors={errors}
              handleSubmit={handleSubmit}
                // isSubmitting={isSubmitting}
              onSubmit={applyFilter}
            />
          </div>
        </section>

        <section className="p-4 lg:p-8 xl:p-10">
          <QuotationRegistrationTable
            data={filteredData}
            isLoading={false}
            currentPage={1}
            totalPages={3}
            onPageChange={handlePageChange}
          />
        </section>
      </PageWrapper>
    </div>
  );
};
