import React, { useState, useRef } from "react";
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
import { OrnamentNameTables } from "./components/Table/OrnamentNameTable";
import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button";
import type { OrnamentNameData } from "@/types/customer-management/ornament-name";
import { useLazyGetOrnamentNameByIdQuery } from "@/global/service/end-points/customer-management/ornament-name.api";

export const OrnamentNamePage: React.FC = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [ selectedRow, setSelectedRow ] = useState<OrnamentNameData | null>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const [ fetchOrnamentNameById ] = useLazyGetOrnamentNameByIdQuery();

  const {
    control,
    reset,
    onSubmit,
    handleSubmit,
    onReset,
    onCancel,
    register,
    errors,
    oTypesOption,
    isSubmitting,
  } = useOrnamentNameForm(selectedRow ?? undefined);

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
    setSelectedRow(null);
    setShowForm(true);
  };

  const handleHideForm = () => {
    onCancel();
    setSelectedRow(null);
    setShowForm(false);
  };

  const onEdit = async (identity: string) => {
    try {
      const res = await fetchOrnamentNameById(identity). unwrap();
      setSelectedRow(res);
      reset(res);
      setShowForm(true);
      setSelectedRow(res);

      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior:"smooth", block: "end" })
      }, 50);
    } catch (error) {
      console.error("Failed to fetch Ornament Name by ID", error);
    }
  };

  return (
    <div className="space-y-6">
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
            <TitleHeader title="Ornament Name" className="py-4" />
            <NeumorphicButton 
            type="button" 
            variant="default" 
            size="default" 
            onClick={handleShowForm}
            >
              <PlusCircle width={13} />
              Add Ornament Name
            </NeumorphicButton>
          </div>

          {showForm && (
              <div ref = {formRef}>
              <OrnamentNameForm
                control={control}
                register={register}
                errors={errors}
                oTypesOption={oTypesOption}
                isEdit={!!selectedRow}
                isSubmitting={isSubmitting}
                onSubmit={handleSubmit(onSubmit)}
                onCancel={handleHideForm}
                onReset={onReset}
              />
             </div>
          )}
        </section>
      </PageWrapper>

      <PageWrapper variant ="default" padding="xl" maxWidth="xl" contentPadding="sm" className="pt-0 md:pt-0 lg:pt-0">
        <section className="p-4 lg:p-8 xl:p-10">
          <TitleHeader className="pb-4" title="List of Ornament Name" />
          <OrnamentNameTables 
            onEdit={onEdit}
          />
        </section>
      </PageWrapper>
    </div>
  );
};