import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import {
  Breadcrumb,
  TitleHeader,
  type BreadcrumbItem,
  PageWrapper,
} from "../../../components";
import NeumorphicButton from "../../../components/ui/neumorphic-button/neumorphic-button";
import { UserTypeMasterTable } from "./components/table/UserTypeMasterTable";
import { UserTypeForm } from "./components/form/UserTypeMasterForm";
import { useUserTypeMasterForm } from "./components/hooks/useUserTypeMaster";
import { useUserTypeMasterTable } from "./components/hooks/useUserTypeMasterTable";
import type { UserType } from "../../../types/customer-management/user-type";
import {
  MOCK_USER_TYPES,
  generateUserTypeCode,
} from "./constants/UserTypeConstants";

export const UserTypePage: React.FC = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [userTypes, setUserTypes] = useState<UserType[]>(MOCK_USER_TYPES);
  const formRef = useRef<HTMLDivElement | null>(null);

  const existingCodes = userTypes.map(u => u.userTypeCode);

  const form = useUserTypeMasterForm(existingCodes, (saved: UserType) => {
    setUserTypes(prev => {
      const exists = prev.find(
        u => u.userTypeIdentity === saved.userTypeIdentity
      );
      if (exists) {
        return prev.map(u =>
          u.userTypeIdentity === saved.userTypeIdentity ? saved : u
        );
      }
      return [
        ...prev,
        {
          ...saved,
          userTypeCode: generateUserTypeCode(existingCodes),
        },
      ];
    });
    setShowForm(false);
  });

  const table = useUserTypeMasterTable();

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
    { label: "User Type", active: true },
  ];

  const handleAddClick = () => {
    form.onReset();
    setShowForm(true);

    setTimeout(() => {
      formRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 100);
  };

  const handleCancelClick = () => {
    form.onCancel();
    setShowForm(false);
  };

  const onEdit = (data: UserType) => {
    form.handleEdit(data);
    setShowForm(true);

    setTimeout(() => {
      formRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 100);
  };

  const confirmDeleteUserType = () => {
    if (!table.selectedUserTypeId) return;
    setUserTypes(prev =>
      prev.filter(u => u.userTypeIdentity !== table.selectedUserTypeId)
    );
    table.closeDeleteModal();
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
            <TitleHeader title="User Type Master" className="py-4" />

            <NeumorphicButton
              type="button"
              variant="default"
              size="default"
              onClick={handleAddClick}
            >
              <PlusCircle className="mr-1 h-3 w-3" />
              Add User Type
            </NeumorphicButton>
          </div>

          {showForm && (
            <div ref={formRef}>
              <UserTypeForm
                control={form.control}
                register={form.register}
                errors={form.errors}
                isSubmitting={form.isSubmitting}
                isEdit={form.isEdit}
                userTypeCode={form.userTypeCode}
                onSubmit={form.handleSubmit(form.onSubmit)}
                onCancel={handleCancelClick}
                onReset={form.onReset}
              />
            </div>
          )}
        </section>
      </PageWrapper>

      <PageWrapper
        variant="default"
        padding="xl"
        maxWidth="xl"
        contentPadding="sm"
        className="pt-0"
      >
        <section className="p-4 lg:p-8 xl:p-10">
          <TitleHeader className="pb-4" title="List of User Types" />

          <UserTypeMasterTable
            data={userTypes}
            onEdit={onEdit}
            onDelete={table.openDeleteModal}
            showDeleteModal={table.showDeleteModal}
            confirmDelete={confirmDeleteUserType}
            closeDeleteModal={table.closeDeleteModal}
          />
        </section>
      </PageWrapper>
    </div>
  );
};

export default UserTypePage;
