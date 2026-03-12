import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Breadcrumb,
  TitleHeader,
  type BreadcrumbItem,
  PageWrapper,
  // ConfirmationModal,
} from "@/components";
// import {  } from "./components/Hooks/useQuotationRegForm";
// import { BankConfigForm } from "./components/Form/CoLendingBankConfigForm";
 import { QuotationFilterForm } from "./components/Form/QuotationRegFilter";
import { QuotationRegistrationTable } from "./components/Table/QuotationRegistrationTable";
import { useForm } from "react-hook-form";
import type { QuotationFilter } from "@/types/asset-management/quotation-registration-type";
// import {BANK_TABLE_DATA} from "@/mocks/bank/bank-config";            Mock data

export const QuotationRegPage: React.FC = () => {
  const navigate = useNavigate();
 const {
    control,
    // handleSubmit,
    formState:{errors},
  } = useForm<QuotationFilter>({
    defaultValues:{
      reqId:"ALL",
      status:"ALL",
    }
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
      {/* <ConfirmationModal
        // isOpen={showDeleteModal}
        // onConfirm={handleConfirmDelete}
        // onCancel={handleCancelDelete}
        title="Delete"
        message="Are you Sure you want to delete Quotation ?"
        confirmText="Delete"
        cancelText="Cancel"
        type="error"
        size="compact"
      /> */}
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
            <TitleHeader
              title="Quotation Request List"
              className="py-4"
            />
          </div>
          {/* {showForm && ( */}
          <div className="rounded-lg border bg-secondary p-2 shadow-sm">
            <QuotationFilterForm 
              control={control}
            //   register={register}
              errors={errors}
            //   isSubmitting={isSubmitting}
              // onSubmit={handleSubmit(onSubmit)}
            //   onCancel={handleHideForm}
              // onReset={onReset}
            />
          {/* )} */}
          </div>
        </section>

        <section className="p-4 lg:p-8 xl:p-10">
          <QuotationRegistrationTable
            data={[]}
            isLoading={false}
            currentPage={1}
            totalPages={3}
            // onPageChange={}
            // handleDelete={handle}
          />
        </section>
      </PageWrapper>
    </div>
  );
};
