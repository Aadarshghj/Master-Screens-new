import React, { useState } from "react";
import { PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Breadcrumb,
  TitleHeader,
  type BreadcrumbItem,
  PageWrapper,
} from "@/components";
import { useOrnamentNameForm } from "./components/Hooks/useOrnamentNameForm";
import { OrnamentNameForm } from "./components/Form/OrnamentNameForm";
import { OrnamentNameTable } from "./components/Table/OrnamentNameTable";
import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button";

export const OrnamentNamePage: React.FC = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);

  const {
    control,
    onSubmit,
    handleSubmit,
    onReset,
    onCancel,
    register,
    errors,
    isSubmitting,
  } = useOrnamentNameForm();

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Home", href: "/", onClick: () => navigate("/") },
    {
      label: "Customer Management System",
      href: "/customer",
      onClick: () => navigate("/customer"),
    },
    {
      label: "Master",
      href: "/customer/master",
      onClick: () => navigate("/customer/master"),
    },    
    {
      label: "Ornament Name",
      active: true,
    },
  ];

  const handleShowForm = () => {
    setShowForm(true);
  };

  const handleHideForm = () => {
    onCancel();
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <PageWrapper variant="default" padding="xl" maxWidth="xl" contentPadding="sm" className="m-0 min-h-fit pb-4">
        <section className="p-4 lg:p-8 xl:p-10">
          <Breadcrumb items={breadcrumbItems} variant="default" size="sm" />
          <div className="flex items-center justify-between">
            <TitleHeader title="Ornament Name" className="py-4" />
            <NeumorphicButton type="button" variant="default" size="default" onClick={handleShowForm}>
              <PlusCircle width={13} />
              Add Ornament Name
            </NeumorphicButton>
          </div>

          {showForm && (
            // <div className="mb-6 rounded-lg border bg-white p-6 shadow-sm">
              <OrnamentNameForm
                control={control}
                register={register}
                errors={errors}
                isSubmitting={isSubmitting}
                onSubmit={handleSubmit(onSubmit)}
                onCancel={handleHideForm}
                onReset={onReset}
              />
            // </div>
          )}
        </section>
</PageWrapper>

<PageWrapper>
        <section className="pt-2 pb-2">
          <TitleHeader className="pb-4" title="List of Ornament Name" />
          <OrnamentNameTable />
        </section>
      </PageWrapper>
    </div>
  );
};