import React from "react"
import { useNavigate } from "react-router-dom"

import {
  Breadcrumb,
  TitleHeader,
  type BreadcrumbItem,
  PageWrapper
} from "@/components"

import { SupplierEmpanelmentForm } from "./components/Form/SupplierEmpanelmentForm"
import { useSupplierEmpanelmentForm } from "./components/Hooks/useSupplierEmpanelmentForm"


export const SupplierEmpanelmentPage: React.FC = () => {

  const navigate = useNavigate()

  const {
  control,
  handleSubmit,
  errors,
  isSubmitting,
  onSubmit,
  reset,
  openSearchModal,
  closeSearchModal,
  isSearchModalOpen,
  handleSupplierSelect
} = useSupplierEmpanelmentForm()

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Home", href: "/", onClick: () => navigate("/") },
    {
      label: "Asset Management System",
      href: "/asset-management",
      onClick: () => navigate("/asset-management")
    },
    {
      label: "Supplier Empanelment", active: true ,
      href: "/asset-management/supplier-empanelment",
      onClick: () => navigate("/asset-management/supplier-empanelment")
    },
    // { label: "Supplier Empanelment", active: true }
  ]

  return (
    <PageWrapper
      variant="default"
      padding="xl"
      maxWidth="xl"
      contentPadding="sm"
      className="m-0 min-h-fit pb-4"
    >
      <section className="p-4 lg:p-8 xl:p-10">

        <Breadcrumb items={breadcrumbItems} variant="default" size="sm" />

        <TitleHeader
          title="Supplier Empanelment"
          className="py-4"
        />

         <SupplierEmpanelmentForm
          control={control}
          errors={errors}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit(onSubmit)}
          onReset={reset}
          openSearchModal={openSearchModal}
          closeSearchModal={closeSearchModal}
          isSearchModalOpen={isSearchModalOpen}
          handleSupplierSelect={handleSupplierSelect}
        />

      </section>
    </PageWrapper>
  )
}