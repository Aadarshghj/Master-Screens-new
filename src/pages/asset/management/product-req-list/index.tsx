import React from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import {
  Breadcrumb,
  PageWrapper,
  TitleHeader,
  type BreadcrumbItem,
} from "../../../../components";
import NeumorphicButton from "../../../../components/ui/neumorphic-button/neumorphic-button";
import { ProductReqListForm } from "./components/Form/ProductReqListForm";
import { useProductReqListForm } from "./components/Hooks/useProductReqListForm";

export const ProductReqListPage: React.FC = () => {
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    errors,
    isSubmitting,
    onSubmit,
    onReset,
  } = useProductReqListForm();

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Home", href: "/", onClick: () => navigate("/") },
    {
      label: "Asset Management System",
      href: "/customer/asset-mgmt",
      onClick: () => navigate("/customer/asset-mgmt"),
    },
    { label: "Product Request List", active: true },
  ];

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

        <div className="flex items-center justify-between">
          <TitleHeader
            title="Product Request List"
            className="text-xl font-medium py-4"
          />

          <NeumorphicButton
            type="button"
            variant="default"
            size="default"
          >
            <PlusCircle className="mr-1 h-3 w-4" />
            New Request
          </NeumorphicButton>
        </div>

        <div className="rounded-lg border bg-secondary p-2 shadow-sm">
          <ProductReqListForm
            control={control}
            errors={errors}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit(onSubmit)}
            onReset={onReset}
          />
        </div>
      </section>

      <section className="px-4 lg:px-8 xl:px-10 pt-0 pb-6">
        {/* Table goes here */}
      </section>
    </PageWrapper>
  );
};