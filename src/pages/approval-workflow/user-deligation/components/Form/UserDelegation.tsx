import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Flex } from "@/components/ui/flex";
import { Form } from "@/components/ui/form";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { HeaderWrapper } from "@/components/ui/header-wrapper/HeaderWrapper";
import { TitleHeader } from "@/components/ui/title-header/TitleHeader";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { InputWithSearch } from "@/components/ui/input-with-search";
import { Save, RefreshCw, Filter, Plus, ChevronDown } from "lucide-react";
import { useUserDelegation } from "../hooks";
import type { UseUserDelegationProps } from "../hooks/useUserDelegation";
import { UserDelegationTable } from "../Table/UserDelegation";
import {
  Breadcrumb,
  PageWrapper,
  type BreadcrumbItem,
  Input,
} from "@/components";
import { WorkflowNavigation } from "../../../components/WorkflowNavigation";

export const ManageUserDelegations: React.FC = () => {
  const navigate = useNavigate();
  const [fromUserInput, setFromUserInput] = useState("");
  const [toUserInput, setToUserInput] = useState("");

  const breadcrumbItems: BreadcrumbItem[] = [
    {
      label: "Home",
      href: "/",
      onClick: () => navigate("/"),
    },
    {
      label: "Loan Management System",
      href: "/loan-management",
      onClick: () => navigate("/loan-management"),
    },
    {
      label: "Approval Workflow",
      href: "/loan-management/Approval-workflow",
      onClick: () => navigate("/loan-management/Approval-workflow"),
    },
    {
      label: "User Delegations",
      href: "/loan-management/Approval-workflow/user-delegations",
      onClick: () =>
        navigate("/loan-management/Approval-workflow/user-delegations"),
    },
  ];

  // Helper function to extract error message
  const getErrorMessage = (
    error: { message?: string | { message?: string } } | undefined
  ): string | undefined => {
    if (!error) return undefined;
    if (typeof error.message === "string") return error.message;
    if (typeof error.message === "object" && error.message?.message)
      return error.message.message;
    return "Validation error";
  };

  const {
    // Form
    handleSubmit,
    register,
    reset,
    errors,
    activeValue,
    onSubmit,
    handleEdit,
    handleDeleteLocal,
    handleReset,
    handleCancel,
    setValue,
    watch,

    // UI State
    isFormOpen,
    setIsFormOpen,
    showFromUserDropdown,
    setShowFromUserDropdown,
    showToUserDropdown,
    setShowToUserDropdown,
    editingDelegation,
    setEditingDelegation,
    filterFromUser,
    setFilterFromUser,
    filterToUser,
    setFilterToUser,
    fromUserDisplayValue,
    toUserDisplayValue,
    showDeleteModal,
    confirmDelete,
    cancelDelete,

    // Data
    data: delegationsResponse,
    users: userOptions,
    filterUsers,
    modules: moduleOptions,
    handleUserSearch,

    isLoading: isLoadingDelegations,
    isLoadingUsers,
    isLoadingAllUsers,
    isLoadingModules,
    isCreating,
    isUpdating,
  } = useUserDelegation({});

  // Update local state when editing delegation changes
  useEffect(() => {
    if (editingDelegation) {
      // Use display values from the hook if available
      if (fromUserDisplayValue) {
        setFromUserInput(fromUserDisplayValue);
      }
      if (toUserDisplayValue) {
        setToUserInput(toUserDisplayValue);
      }
    } else {
      setFromUserInput("");
      setToUserInput("");
    }
  }, [editingDelegation, fromUserDisplayValue, toUserDisplayValue]);

  return (
    <>
      <div className="space-y-6">
        <PageWrapper
          variant="default"
          padding="xl"
          maxWidth="xl"
          contentPadding="sm"
          className="m-0 min-h-fit"
        >
          <div className="mb-6 px-4 pt-4">
            <WorkflowNavigation />
          </div>
          <section>
            <Breadcrumb
              items={breadcrumbItems}
              variant="default"
              size="sm"
              className="mt-4 mb-4 ml-4"
            />
          </section>
          <Flex justify="between" align="center" className="mb-6">
            <HeaderWrapper>
              <TitleHeader title="User Delegations" />
            </HeaderWrapper>
            {!editingDelegation ? (
              <Button
                variant="resetPrimary"
                size="compactWhite"
                onClick={() => setIsFormOpen(!isFormOpen)}
                disabled={isCreating || isUpdating}
              >
                <div className="mr-2 flex h-4 w-4 items-center justify-center rounded-full bg-white">
                  <Plus className="text-primary h-3 w-3" />
                </div>
                Add User Delegation
                <ChevronDown
                  className={`ml-2 h-4 w-4 transition-transform ${isFormOpen ? "rotate-180" : ""}`}
                />
              </Button>
            ) : (
              <Button
                variant="resetPrimary"
                size="compactWhite"
                onClick={() => {
                  setEditingDelegation(null);
                  reset();
                  setIsFormOpen(false);
                }}
                disabled={isCreating || isUpdating}
              >
                <Plus className="mr-2 h-3 w-3" />
                Add New Delegation
              </Button>
            )}
          </Flex>

          {(isFormOpen || editingDelegation) && (
            <Form
              onSubmit={handleSubmit(data =>
                onSubmit({
                  ...data,
                  module: data.module || undefined,
                  reason: data.reason || "",
                })
              )}
            >
              <Form.Row>
                <Form.Col lg={3} md={6} span={12}>
                  <Form.Field label="From User" required>
                    <InputWithSearch
                      value={fromUserInput}
                      onChange={e => {
                        const inputValue = e.target.value.toUpperCase();
                        setFromUserInput(inputValue);
                        handleUserSearch(inputValue);
                        setShowFromUserDropdown(inputValue.length > 0);
                      }}
                      placeholder="original user (eg: john doe)"
                      size="form"
                      className="uppercase"
                      showDropdown={
                        showFromUserDropdown && userOptions.length > 0
                      }
                      dropdownOptions={userOptions}
                      onOptionSelect={option => {
                        setValue("fromUser", option.value);
                        setFromUserInput(option.label);
                        setShowFromUserDropdown(false);
                      }}
                      dropdownLoading={isLoadingUsers}
                      noResultsText="No users found"
                    />
                    <Form.Error
                      error={
                        errors.fromUser
                          ? {
                              message: getErrorMessage(errors.fromUser),
                              type: "validation",
                            }
                          : undefined
                      }
                    />
                  </Form.Field>
                </Form.Col>

                <Form.Col lg={3} md={6} span={12}>
                  <Form.Field label="To User" required>
                    <InputWithSearch
                      value={toUserInput}
                      onChange={e => {
                        const inputValue = e.target.value.toUpperCase();
                        setToUserInput(inputValue);
                        handleUserSearch(inputValue);
                        setShowToUserDropdown(inputValue.length > 0);
                      }}
                      placeholder="delegate user (eg: jane smith)"
                      size="form"
                      className="uppercase"
                      showDropdown={
                        showToUserDropdown && userOptions.length > 0
                      }
                      dropdownOptions={userOptions}
                      onOptionSelect={option => {
                        setValue("toUser", option.value);
                        setToUserInput(option.label);
                        setShowToUserDropdown(false);
                      }}
                      dropdownLoading={isLoadingUsers}
                      noResultsText="No users found"
                    />
                    <Form.Error
                      error={
                        errors.toUser
                          ? {
                              message: getErrorMessage(errors.toUser),
                              type: "validation",
                            }
                          : undefined
                      }
                    />
                  </Form.Field>
                </Form.Col>

                <Form.Col lg={2} md={6} span={12}>
                  <Form.Field label="Start Date" required>
                    <Input
                      type="date"
                      size="form"
                      variant="form"
                      placeholder="dd-mm-yyyy"
                      {...register("startDate")}
                    />
                    <Form.Error
                      error={
                        errors.startDate
                          ? {
                              message: getErrorMessage(errors.startDate),
                              type: "validation",
                            }
                          : undefined
                      }
                    />
                  </Form.Field>
                </Form.Col>

                <Form.Col lg={2} md={6} span={12}>
                  <Form.Field label="End Date" required>
                    <Input
                      type="date"
                      size="form"
                      variant="form"
                      placeholder="dd-mm-yyyy"
                      {...register("endDate")}
                    />
                    <Form.Error
                      error={
                        errors.endDate
                          ? {
                              message: getErrorMessage(errors.endDate),
                              type: "validation",
                            }
                          : undefined
                      }
                    />
                  </Form.Field>
                </Form.Col>

                <Form.Col lg={2} md={6} span={12}>
                  <Form.Field label="Module">
                    <Select
                      value={watch("module") || ""}
                      onValueChange={value => setValue("module", value)}
                      placeholder="Select module"
                      size="form"
                      variant="form"
                      fullWidth={true}
                      itemVariant="form"
                      options={moduleOptions || []}
                      loading={isLoadingModules}
                      disabled={isLoadingModules}
                    />
                    <Form.Error
                      error={
                        errors.module
                          ? {
                              message: getErrorMessage(errors.module),
                              type: "validation",
                            }
                          : undefined
                      }
                    />
                  </Form.Field>
                </Form.Col>
              </Form.Row>

              <Form.Row>
                <Form.Col lg={6} md={12} span={12}>
                  <Form.Field label="Reason">
                    <Textarea
                      {...register("reason")}
                      placeholder="reason for delegation"
                      rows={3}
                      className="resize-none text-[10px]"
                    />
                    <Form.Error
                      error={
                        errors.reason
                          ? {
                              message: getErrorMessage(errors.reason),
                              type: "validation",
                            }
                          : undefined
                      }
                    />
                  </Form.Field>
                </Form.Col>

                <Form.Col lg={3} md={6} span={12}>
                  <Form.Field label="Active">
                    <div className="flex items-center gap-3 pt-2">
                      <Switch
                        checked={watch("active")}
                        onCheckedChange={value => setValue("active", value)}
                      />
                      <span className="text-muted-foreground text-sm">
                        {activeValue ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </Form.Field>
                </Form.Col>
              </Form.Row>

              <div className="mt-6">
                <Flex.ActionGroup>
                  <Button
                    type="button"
                    variant="resetCompact"
                    size="compactWhite"
                    onClick={handleCancel}
                    disabled={isCreating || isUpdating}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    variant="resetCompact"
                    size="compactWhite"
                    onClick={handleReset}
                    disabled={isCreating || isUpdating}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Reset
                  </Button>
                  <Button
                    type="submit"
                    variant="resetPrimary"
                    size="compactWhite"
                    disabled={isCreating || isUpdating}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {isCreating || isUpdating
                      ? "Processing..."
                      : editingDelegation
                        ? "Update User Delegation"
                        : "Save User Delegation"}
                  </Button>
                </Flex.ActionGroup>
              </div>
            </Form>
          )}
        </PageWrapper>
        <PageWrapper
          variant="default"
          padding="xl"
          maxWidth="xl"
          contentPadding="sm"
          className="m-0 min-h-fit"
        >
          <Flex justify="between" align="center" className="mb-6">
            <HeaderWrapper>
              <TitleHeader title="Saved Delegations" />
            </HeaderWrapper>
          </Flex>

          {/* Filter Section */}
          <div className="mb-6 rounded-lg bg-gray-50 p-4">
            <Form.Row>
              <Form.Col lg={3} md={6} span={12}>
                <Form.Field label="From User">
                  <Select
                    value={filterFromUser}
                    onValueChange={setFilterFromUser}
                    placeholder="All"
                    size="form"
                    variant="form"
                    fullWidth={true}
                    itemVariant="form"
                    options={[
                      { value: "all", label: "All" },
                      ...(filterUsers || []),
                    ]}
                    loading={isLoadingAllUsers}
                  />
                </Form.Field>
              </Form.Col>

              <Form.Col lg={3} md={6} span={12}>
                <Form.Field label="To User">
                  <Select
                    value={filterToUser}
                    onValueChange={setFilterToUser}
                    placeholder="All"
                    size="form"
                    variant="form"
                    fullWidth={true}
                    itemVariant="form"
                    options={[
                      { value: "all", label: "All" },
                      ...(filterUsers || []),
                    ]}
                    loading={isLoadingAllUsers}
                  />
                </Form.Field>
              </Form.Col>

              <Form.Col lg={2} md={6} span={12}>
                <div className="flex gap-2 pt-5">
                  <Button
                    type="button"
                    variant="resetCompact"
                    size="compactWhite"
                    onClick={() => {
                      setFilterFromUser("all");
                      setFilterToUser("all");
                    }}
                    className="w-full"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Reset
                  </Button>
                  <Button
                    type="button"
                    variant="resetPrimary"
                    size="compactWhite"
                    onClick={() => {
                      // Filters are applied automatically when values change
                    }}
                    className="w-full"
                  >
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                </div>
              </Form.Col>
            </Form.Row>
          </div>

          {/* Table Section */}
          <UserDelegationTable
            delegations={delegationsResponse?.content || []}
            isLoading={isLoadingDelegations}
            currentPage={delegationsResponse?.number || 0}
            totalPages={delegationsResponse?.totalPages || 0}
            totalElements={delegationsResponse?.totalElements || 0}
            onPageChange={() => {}}
            onEdit={delegation =>
              handleEdit(
                delegation as NonNullable<UseUserDelegationProps["editData"]>
              )
            }
            onDelete={handleDeleteLocal}
            userOptions={userOptions || []}
            moduleOptions={moduleOptions || []}
          />

          {/* Delete Confirmation Modal */}
          <ConfirmationModal
            isOpen={showDeleteModal}
            onConfirm={confirmDelete}
            onCancel={cancelDelete}
            title="Delete User Delegation"
            message="Are you sure you want to delete this user delegation? This action cannot be undone."
            confirmText="Delete"
            cancelText="Cancel"
            type="error"
            size="standard"
          />
        </PageWrapper>
      </div>
    </>
  );
};
