import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import {
  Breadcrumb,
  TitleHeader,
  type BreadcrumbItem,
  PageWrapper,
  
} from "@/components";
import { UserRegForm } from "./components/Form/UserRegForm";
import { UserRegTable } from "./components/Table/UserRegTable";
import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button";
import { useUserRegForm } from "./components/hooks/useUserRegForm";
import type { UserRegType } from "@/types/customer-management/user-reg";
import { useLazyGetUserByIdQuery } from "@/global/service/end-points/customer-management/user-reg";
export const UserRegPage: React.FC = () => {
  const navigate = useNavigate();
   const [showForm, setShowForm] = useState(false);
   const [triggerGetUserById] = useLazyGetUserByIdQuery();

   const [selectedUser, setSelectedUser] =
  useState<UserRegType | null>(null);
const [editingUser, setEditingUser] =
  useState<UserRegType | null>(null);
const handleResetClick = () => {
  onReset();        
  setEditingUser(null);
  setSelectedUser(null);
};
const isEditMode = Boolean(selectedUser);



  const {
     control,
    register,
    handleSubmit,
    errors,
    isSubmitting,
    onSubmit,
    onCancel,
    onReset,
    userTypeOptions,
    reset,
    setError
  } = useUserRegForm();

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
    { label: "User Registration", active: true },
  ];
  const handleAddClick = () => {
    setSelectedUser(null);
    setShowForm(true);
  };

  const handleCancelClick = () => {
    onCancel();
    setShowForm(false);
  };

  const onEdit = async (data: UserRegType) => {
  try {
    setShowForm(true);

    const response = await triggerGetUserById(
      data.id!
    ).unwrap();

    setEditingUser(response);
    setSelectedUser(response);

    reset(response);
  } catch (error) {
    console.error("Failed to fetch user", error);
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
            <TitleHeader title="User Registration" className="py-4" />

            <NeumorphicButton
              type="button"
              variant="default"
              size="default"
              onClick={handleAddClick}
            >
              <PlusCircle width={13} />
              Add User
            </NeumorphicButton>
          </div>

          {showForm && (
            <UserRegForm
              control={control}
              register={register}
              handleSubmit={handleSubmit}
              errors={errors}
              isSubmitting={isSubmitting}
              onSubmit={onSubmit}
              onCancel={handleCancelClick}
              onReset={handleResetClick}
              userTypeOptions={userTypeOptions}
              isEditMode={isEditMode}
              editingUser={editingUser}
              setError={setError}
              

            />
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
          <TitleHeader className="pb-4" title="List of Users" />

          <UserRegTable onEdit={onEdit}/>
        </section>
      </PageWrapper>
    </div>
  );
}