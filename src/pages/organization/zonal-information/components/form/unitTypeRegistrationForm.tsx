import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Breadcrumb,
  TitleHeader,
  type BreadcrumbItem,
  PageWrapper,
} from "@/components";
import { useUnitTypeManager } from "../hooks/useUnitTypeManager";
import { AdminUnitRegistrationForm } from "./AdminUnitRegistrationForm";
import { AdminUnitTable } from "../table/adminUnitTable";
import type { AdminUnitDetails } from "@/types/organisation/admin-unit";
import type { UnitTypeCode } from "../hooks/useAdminUnitManagerBase";
import {
  BREADCRUMB,
  TABLE_LABELS,
} from "../../constants/ZoneInformationConstants";

interface UnitTypeRegistrationPageProps {
  unitTypeCode: UnitTypeCode;
  unitLabel: string;
  pagePath: string;
}

export const UnitTypeRegistrationPage: React.FC<
  UnitTypeRegistrationPageProps
> = ({ unitTypeCode, unitLabel, pagePath }) => {
  const navigate = useNavigate();
  const [editIdentity, setEditIdentity] = useState<string | undefined>();
  const formRef = useRef<HTMLDivElement>(null);

  const {
    control,
    register,
    errors,
    isSubmitting,
    onReset,
    watch,
    trigger,
    handleSubmit,
    onSubmit,
    isBranch,
    selectedStatus,
    selectedUnitType,
    isUnitTypeLocked,
    onPincodeSearch,
    onPostOfficeSelect,
    branchTypeOptions,
    mergedToOptions,
    postOfficeOptions,
    showPostOfficeDropdown,
    setShowPostOfficeDropdown,
    postOfficeLoading,
    postOfficeError,
    adminUnitTypeOptions,
    statusOptions,
    categoryOptions,
    parentOptions,
    timezoneOptions,
    setValue,
    languageOptions,
  } = useUnitTypeManager(unitTypeCode, editIdentity);

  const handleFormSubmit = async (data: AdminUnitDetails) => {
    await onSubmit(data);
    setEditIdentity(undefined);
  };

  const handleFormError = (validationErrors: object) => {
    console.error("Form validation failed:", validationErrors);
  };

  const handleEdit = (identity: string) => {
    setEditIdentity(identity);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const handleReset = () => {
    onReset();
    setEditIdentity(undefined);
  };

  const breadcrumbItems: BreadcrumbItem[] = [
    {
      label: BREADCRUMB.HOME,
      href: BREADCRUMB.HOME_PATH,
      onClick: () => navigate(BREADCRUMB.HOME_PATH),
    },
    {
      label: BREADCRUMB.ORG_MGMT,
      href: BREADCRUMB.ORG_PATH,
      onClick: () => navigate(BREADCRUMB.ORG_PATH),
    },
    {
      label: `${unitLabel} Registration`,
      href: pagePath,
      onClick: () => navigate(pagePath),
    },
    {
      label: editIdentity ? `Edit ${unitLabel}` : `${unitLabel} Registration`,
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
        className="m-0 min-h-fit pb-6"
      >
        <section className="p-4 lg:p-8 xl:p-10">
          <Breadcrumb items={breadcrumbItems} variant="default" size="sm" />

          <div className="flex items-center justify-between" ref={formRef}>
            <TitleHeader
              title={
                editIdentity ? `Edit ${unitLabel}` : `${unitLabel} Registration`
              }
              className="py-4"
            />
            {editIdentity && (
              <span className="text-muted-foreground text-xs">
                {TABLE_LABELS.EDITING_HINT}
              </span>
            )}
          </div>

          <AdminUnitRegistrationForm
            control={control}
            register={register}
            errors={errors}
            isSubmitting={isSubmitting}
            watch={watch}
            onReset={handleReset}
            trigger={trigger}
            onSubmit={handleSubmit(handleFormSubmit, handleFormError)}
            isBranch={isBranch}
            selectedStatus={selectedStatus}
            isUnitTypeLocked={isUnitTypeLocked}
            onPincodeSearch={onPincodeSearch}
            onPostOfficeSelect={onPostOfficeSelect}
            branchTypeOptions={branchTypeOptions}
            mergedToOptions={mergedToOptions}
            postOfficeOptions={postOfficeOptions}
            showPostOfficeDropdown={showPostOfficeDropdown}
            setShowPostOfficeDropdown={setShowPostOfficeDropdown}
            postOfficeLoading={postOfficeLoading}
            postOfficeError={postOfficeError}
            setValue={setValue}
            adminUnitTypeOptions={adminUnitTypeOptions}
            statusOptions={statusOptions}
            categoryOptions={categoryOptions}
            parentOptions={parentOptions}
            timezoneOptions={timezoneOptions}
            languageOptions={languageOptions}
          />

          <section className="bg-card mt-10 rounded-xl border p-6 shadow-sm">
            <div className="mb-4">
              <TitleHeader title={`${unitLabel} List`} className="py-0" />
            </div>
            <AdminUnitTable
              onEdit={handleEdit}
              externalUnitType={selectedUnitType}
            />
          </section>
        </section>
      </PageWrapper>
    </div>
  );
};
