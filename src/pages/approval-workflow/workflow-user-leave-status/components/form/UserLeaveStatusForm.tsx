import {
  ConfirmationModal,
  DatePicker,
  Flex,
  Form,
  HeaderWrapper,
  InputWithSearch,
  Select,
  Textarea,
  TitleHeader,
} from "@/components";
import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button";
import {
  CircleX,
  Download,
  Eye,
  PlusCircle,
  RefreshCw,
  Save,
  Upload,
} from "lucide-react";
import { Controller } from "react-hook-form";

import { LeaveStatusImportModal } from "../modal/LeaveStatusImportModal";
import { LeaveStatusHistoryModal } from "../modal/LeaveStatusHistoryModal";
import type { FC } from "react";
import type { useUserLeaveStatusForm } from "../../hooks/useUserLeaveStatusForm";
interface UserLeaveStatusFormProps {
  formController: ReturnType<typeof useUserLeaveStatusForm>;
}
const UserLeaveStatusForm: FC<UserLeaveStatusFormProps> = ({
  formController,
}) => {
  const {
    control,
    register,
    handleSubmit,
    setValue,
    trigger,
    watch,
    errors,
    showAddForm,
    editUserLeaveStatus,
    showDeleteModal,
    isImportModalOpen,
    isImportHistoryModalOpen,
    isDownloading,
    showBranchDropdown,
    showUserDropdown,
    showDelegateDropdown,
    statusData,
    branchOptions,
    userOptions,
    delegateOptions,
    isBranchLoading,
    isUserLoading,
    isDelegateLoading,
    userError,
    delegateError,
    onSubmit,
    handleShowAddForm,
    handleResetForm,
    handleConfirmDelete,
    handleCancelDelete,
    handleDownloadTemplate,
    handleOpenHistoryModal,
    handleCloseHistoryModal,
    handleRefetchData,
    setIsImportModalOpen,
    handleBranchSelect,
    handleUserSelect,
    handleDelegateSelect,
    setBranchSearch,
    setUserSearch,
    setDelegateSearch,
    setShowBranchDropdown,
    setShowUserDropdown,
    setShowDelegateDropdown,
  } = formController;

  return (
    <section>
      <LeaveStatusHistoryModal
        isOpen={isImportHistoryModalOpen}
        onClose={handleCloseHistoryModal}
      />
      <LeaveStatusImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        handleRefetchData={handleRefetchData}
      />
      <ConfirmationModal
        isOpen={showDeleteModal}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        title="Delete"
        message="Are you Sure you want to delete leave status."
        confirmText="Delete"
        cancelText="Cancel"
        type="error"
        size="compact"
      />

      <div>
        <div className="mb-5 sm:flex">
          <Flex justify="between" align="center" className="mb-1 w-full">
            <HeaderWrapper>
              <TitleHeader title="User Leave Status" className="w-fit" />
            </HeaderWrapper>
          </Flex>

          {!showAddForm && (
            <div className="mb-1 flex w-full gap-2 sm:justify-end">
              <NeumorphicButton
                type="button"
                variant="default"
                size="default"
                onClick={handleOpenHistoryModal}
                className="bg-cyan-1000"
                disabled={isDownloading}
              >
                <Eye width={12} />
                Import History
              </NeumorphicButton>
              <NeumorphicButton
                type="button"
                variant="default"
                size="default"
                onClick={handleDownloadTemplate}
                disabled={isDownloading}
              >
                <Download width={12} />
                {isDownloading ? "Downloading..." : "Download Format"}
              </NeumorphicButton>
              <NeumorphicButton
                onClick={() => setIsImportModalOpen(true)}
                type="button"
                variant="default"
                size="default"
              >
                <Upload width={12} />
                Import
              </NeumorphicButton>
              <NeumorphicButton
                type="button"
                variant="default"
                size="default"
                onClick={handleShowAddForm}
              >
                <PlusCircle width={12} /> Add user leave status
              </NeumorphicButton>
            </div>
          )}
        </div>

        {showAddForm && (
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Row className="mt-5">
              <Form.Col lg={3} md={6} span={12}>
                <Form.Field
                  label="Branch Code"
                  required
                  error={errors.branchIdentity}
                >
                  <Controller
                    name="branchIdentity"
                    control={control}
                    render={({ field }) => <input type="hidden" {...field} />}
                  />
                  <Controller
                    name="branchCode"
                    control={control}
                    render={({ field }) => (
                      <InputWithSearch
                        placeholder="eg: BR001"
                        size="form"
                        variant="form"
                        className="uppercase"
                        value={field.value || ""}
                        onChange={e => {
                          const value = e.target.value.toUpperCase();
                          field.onChange(value);
                          setBranchSearch(value);
                          setShowBranchDropdown(true);
                          setValue("branchIdentity", "");
                        }}
                        showDropdown={
                          showBranchDropdown && branchOptions.length > 0
                        }
                        dropdownOptions={branchOptions}
                        onOptionSelect={handleBranchSelect}
                        isSearching={isBranchLoading}
                        dropdownLoading={isBranchLoading}
                        noResultsText="No branch code found"
                      />
                    )}
                  />
                </Form.Field>
              </Form.Col>

              <Form.Col lg={3} md={6} span={12}>
                <Form.Field
                  label="User Code"
                  required
                  error={errors.userIdentity}
                >
                  <input type="hidden" {...register("userIdentity")} />
                  <Controller
                    name="userCode"
                    control={control}
                    render={({ field }) => (
                      <InputWithSearch
                        placeholder="eg: USR001"
                        size="form"
                        variant="form"
                        className="uppercase"
                        value={watch("userCode") || ""}
                        onChange={e => {
                          const value = e.target.value.toUpperCase();
                          field.onChange(value);
                          setUserSearch(value);
                          setShowUserDropdown(true);
                          setValue("userIdentity", "");
                        }}
                        showDropdown={
                          showUserDropdown && userOptions.length > 0
                        }
                        dropdownOptions={userOptions}
                        onOptionSelect={handleUserSelect}
                        isSearching={isUserLoading}
                        dropdownLoading={isUserLoading}
                        dropdownError={
                          userError ? "Failed to load users" : undefined
                        }
                        noResultsText="No user found"
                      />
                    )}
                  />
                </Form.Field>
              </Form.Col>

              <Form.Col lg={2} md={6} span={12}>
                <Form.Field
                  label="Leave From"
                  error={errors.leaveFrom}
                  required
                >
                  <Controller
                    name="leaveFrom"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        value={field.value || undefined}
                        onChange={(value: string) => {
                          field.onChange(value);
                          trigger?.("leaveFrom");
                        }}
                        onBlur={() => field.onBlur()}
                        placeholder="dd/mm/yyyy"
                        allowManualEntry={true}
                        size="form"
                        variant="form"
                        disableFutureDates={false}
                      />
                    )}
                  />
                </Form.Field>
              </Form.Col>

              <Form.Col lg={2} md={6} span={12}>
                <Form.Field label="Leave To" error={errors.leaveTo} required>
                  <Controller
                    name="leaveTo"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        value={field.value || undefined}
                        onChange={(value: string) => {
                          field.onChange(value);
                          trigger?.("leaveTo");
                        }}
                        onBlur={() => field.onBlur()}
                        placeholder="dd/mm/yyyy"
                        allowManualEntry={true}
                        size="form"
                        variant="form"
                        disableFutureDates={false}
                      />
                    )}
                  />
                </Form.Field>
              </Form.Col>

              <Form.Col lg={2} md={6} span={12}>
                <Form.Field label="Status" error={errors.status} required>
                  <input type="hidden" {...register("statusIdentity")} />
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={value => {
                          field.onChange(value);
                          setValue("statusIdentity", value);
                        }}
                        placeholder="Select"
                        size="form"
                        variant="form"
                        fullWidth={true}
                        itemVariant="form"
                        options={statusData ?? []}
                        onBlur={() => field.onBlur()}
                      />
                    )}
                  />
                </Form.Field>
              </Form.Col>
            </Form.Row>

            <Form.Row className="mt-5">
              <Form.Col lg={3} md={6} span={12}>
                <Form.Field label="Delegate User" error={errors.branchIdentity}>
                  <input type="hidden" {...register("delegateUserIdentity")} />
                  <Controller
                    name="delegateUserCode"
                    control={control}
                    render={({ field }) => (
                      <InputWithSearch
                        placeholder="User delegate to"
                        size="form"
                        variant="form"
                        className="uppercase"
                        value={watch("delegateUserCode") || ""}
                        onChange={e => {
                          const value = e.target.value.toUpperCase();
                          field.onChange(value);
                          setDelegateSearch(value);
                          setShowDelegateDropdown(true);
                          setValue("delegateUserIdentity", "");
                        }}
                        showDropdown={
                          showDelegateDropdown && delegateOptions.length > 0
                        }
                        dropdownOptions={delegateOptions}
                        onOptionSelect={handleDelegateSelect}
                        isSearching={isDelegateLoading}
                        dropdownLoading={isDelegateLoading}
                        dropdownError={
                          delegateError ? "Failed to load users" : undefined
                        }
                        noResultsText="No user found"
                      />
                    )}
                  />
                </Form.Field>
              </Form.Col>

              <Form.Col lg={4} md={12} span={12}>
                <Form.Field error={errors.remarks} label="Remarks">
                  <Textarea
                    {...register("remarks")}
                    placeholder=""
                    rows={3}
                    size="form"
                    variant="form"
                  />
                </Form.Field>
              </Form.Col>
            </Form.Row>

            <div className="sm:flex">
              <div className="mb-5 flex w-full gap-2 sm:justify-end">
                <NeumorphicButton
                  type="button"
                  variant="grey"
                  size="default"
                  onClick={handleShowAddForm}
                >
                  <CircleX width={13} />
                  Cancel
                </NeumorphicButton>
                <NeumorphicButton
                  type="button"
                  variant="secondary"
                  size="secondary"
                  onClick={handleResetForm}
                >
                  <RefreshCw width={12} />
                  Reset
                </NeumorphicButton>
                <NeumorphicButton
                  type="submit"
                  variant="default"
                  size="default"
                >
                  <Save width={12} />
                  {editUserLeaveStatus
                    ? "Update user leave status"
                    : "Save user leave status"}
                </NeumorphicButton>
              </div>
            </div>
          </Form>
        )}
      </div>
    </section>
  );
};

export default UserLeaveStatusForm;
