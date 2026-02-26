import React from "react";
import { Controller } from "react-hook-form";
import { Flex } from "@/components/ui/flex";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { HeaderWrapper } from "@/components/ui/header-wrapper/HeaderWrapper";
import { TitleHeader } from "@/components/ui/title-header/TitleHeader";
import type { ApproverRoleMappingFormProps } from "@/types/approval-workflow/approver-role-mapping.types";
import { RefreshCw, Save, Plus, ChevronDown, X } from "lucide-react";
import { FormContainer } from "@/components/ui/form-container";
import { Label, Switch, Input } from "@/components";
import { InputWithSearch } from "@/components/ui/input-with-search";
import { useApproverRoleMappingForm } from "../../hooks/useApproverRoleMappingForm";

export const ApproverRoleMappingForm: React.FC<
  ApproverRoleMappingFormProps
> = ({ readonly = false }) => {
  const {
    form,
    isFormOpen,
    isEditMode,
    isLoading,
    roleCodeState,
    userCodeState,
    branchCodeState,
    regionCodeState,
    clusterCodeState,
    stateCodeState,
    isSearchingRoleCode,
    isSearchingUserCode,
    isSearchingBranchCode,
    isSearchingRegionCode,
    isSearchingClusterCode,
    isSearchingStateCode,
    handleRoleCodeSearch,
    handleRoleCodeSearchClick,
    handleRoleCodeSelect,
    handleClearRoleCode,
    setRoleCodeState,
    handleUserCodeSearch,
    handleUserCodeSearchClick,
    handleUserCodeSelect,
    handleClearUserCode,
    setUserCodeState,
    handleBranchCodeSearch,
    handleBranchCodeSearchClick,
    handleBranchCodeSelect,
    handleClearBranchCode,
    setBranchCodeState,
    handleRegionCodeSearch,
    handleRegionCodeSearchClick,
    handleRegionCodeSelect,
    handleClearRegionCode,
    setRegionCodeState,
    handleClusterCodeSearch,
    handleClusterCodeSearchClick,
    handleClusterCodeSelect,
    handleClearClusterCode,
    setClusterCodeState,
    handleStateCodeSearch,
    handleStateCodeSearchClick,
    handleStateCodeSelect,
    handleClearStateCode,
    setStateCodeState,
    onSubmit,
    handleCancel,
    handleReset,
    handleToggleForm,
    handleCancelEdit,
  } = useApproverRoleMappingForm(readonly);

  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
    setValue,
    trigger,
    watch,
  } = form;

  // Watch for selections to enable/disable fields
  const hasBranchCode = !!branchCodeState.selected;
  const hasRegionCode = !!regionCodeState.selected;
  const hasClusterCode = !!clusterCodeState.selected;
  const hasStateCode = !!stateCodeState.selected;

  return (
    <article className="approver-role-mapping-form-container">
      <FormContainer>
        <Flex justify="between" align="center" className="mb-6 w-full">
          <HeaderWrapper>
            <TitleHeader title="Approver Role Mapping" />
          </HeaderWrapper>
          {!isEditMode ? (
            <Button
              variant="resetPrimary"
              size="compactWhite"
              onClick={handleToggleForm}
              disabled={isLoading}
            >
              <div className="mr-2 flex h-4 w-4 items-center justify-center rounded-full bg-white">
                <Plus className="text-primary h-3 w-3" />
              </div>
              Add Approver Role Mapping
              <ChevronDown
                className={`ml-2 h-4 w-4 transition-transform ${isFormOpen ? "rotate-180" : ""}`}
              />
            </Button>
          ) : (
            <Button
              variant="resetPrimary"
              size="compactWhite"
              onClick={handleCancelEdit}
              disabled={isLoading}
            >
              <Plus className="mr-2 h-3 w-3" />
              Add New Mapping
            </Button>
          )}
        </Flex>

        {(isFormOpen || isEditMode) && (
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Row>
              <Form.Col lg={3} md={6} span={12}>
                <Form.Field label="Role Code" required error={errors.roleCode}>
                  <InputWithSearch
                    placeholder="Search Role Code"
                    size="form"
                    variant="form"
                    value={
                      roleCodeState.selected
                        ? `${roleCodeState.selected.roleName} - ${roleCodeState.selected.roleCode}`
                        : roleCodeState.searchTerm
                    }
                    onChange={e => {
                      const value = e.target.value;
                      const expectedValue = roleCodeState.selected
                        ? `${roleCodeState.selected.roleName} - ${roleCodeState.selected.roleCode}`
                        : "";
                      if (roleCodeState.selected && value !== expectedValue) {
                        setRoleCodeState(prev => ({
                          ...prev,
                          selected: null,
                        }));
                        setValue("roleCode", "");
                        void trigger("roleCode");
                      }
                      handleRoleCodeSearch(value);
                    }}
                    onDoubleClick={() => {
                      if (roleCodeState.selected) {
                        handleClearRoleCode();
                      }
                    }}
                    onKeyDown={e => {
                      if (e.key === "Escape" && roleCodeState.selected) {
                        handleClearRoleCode();
                      }
                    }}
                    onSearch={handleRoleCodeSearchClick}
                    isSearching={isSearchingRoleCode}
                    showDropdown={roleCodeState.showResults}
                    onClose={() =>
                      setRoleCodeState(prev => ({
                        ...prev,
                        showResults: false,
                      }))
                    }
                    dropdownOptions={roleCodeState.results.map(code => ({
                      value: code.identity,
                      label: `${code.roleName} - ${code.roleCode}`,
                      code: code.roleCode,
                      name: code.roleName,
                    }))}
                    onOptionSelect={
                      handleRoleCodeSelect as (option: unknown) => void
                    }
                    dropdownLoading={isSearchingRoleCode}
                    disabled={isLoading || readonly}
                  />
                </Form.Field>
              </Form.Col>

              <Form.Col lg={3} md={6} span={12}>
                <Form.Field label="User Code" required error={errors.userCode}>
                  <InputWithSearch
                    placeholder="Search User Code"
                    size="form"
                    variant="form"
                    value={
                      userCodeState.selected
                        ? `${userCodeState.selected.userName} - ${userCodeState.selected.userCode}`
                        : userCodeState.searchTerm
                    }
                    onChange={e => {
                      const value = e.target.value;
                      const expectedValue = userCodeState.selected
                        ? `${userCodeState.selected.userName} - ${userCodeState.selected.userCode}`
                        : "";
                      if (userCodeState.selected && value !== expectedValue) {
                        setUserCodeState(prev => ({
                          ...prev,
                          selected: null,
                        }));
                        setValue("userCode", "");
                        void trigger("userCode");
                      }
                      handleUserCodeSearch(value);
                    }}
                    onDoubleClick={() => {
                      if (userCodeState.selected) {
                        handleClearUserCode();
                      }
                    }}
                    onKeyDown={e => {
                      if (e.key === "Escape" && userCodeState.selected) {
                        handleClearUserCode();
                      }
                    }}
                    onSearch={handleUserCodeSearchClick}
                    isSearching={isSearchingUserCode}
                    showDropdown={userCodeState.showResults}
                    onClose={() =>
                      setUserCodeState(prev => ({
                        ...prev,
                        showResults: false,
                      }))
                    }
                    dropdownOptions={userCodeState.results.map(code => ({
                      value: code.identity,
                      label: `${code.userName} - ${code.userCode}`,
                      code: code.userCode,
                      name: code.userName,
                    }))}
                    onOptionSelect={
                      handleUserCodeSelect as (option: unknown) => void
                    }
                    dropdownLoading={isSearchingUserCode}
                    disabled={isLoading || readonly}
                  />
                </Form.Field>
              </Form.Col>

              <Form.Col lg={2} md={6} span={12}>
                <Form.Field label="Branch Code" error={errors.branchCode}>
                  <InputWithSearch
                    placeholder="Search Branch Code"
                    size="form"
                    variant="form"
                    value={
                      branchCodeState.selected
                        ? `${branchCodeState.selected.branchName} - ${branchCodeState.selected.branchCode}`
                        : branchCodeState.searchTerm
                    }
                    onChange={e => {
                      const value = e.target.value;
                      const expectedValue = branchCodeState.selected
                        ? `${branchCodeState.selected.branchName} - ${branchCodeState.selected.branchCode}`
                        : "";
                      if (branchCodeState.selected && value !== expectedValue) {
                        setBranchCodeState(prev => ({
                          ...prev,
                          selected: null,
                        }));
                        setValue("branchCode", "");
                        void trigger("branchCode");
                      }
                      handleBranchCodeSearch(value);
                    }}
                    onDoubleClick={() => {
                      if (branchCodeState.selected) {
                        handleClearBranchCode();
                      }
                    }}
                    onKeyDown={e => {
                      if (e.key === "Escape" && branchCodeState.selected) {
                        handleClearBranchCode();
                      }
                    }}
                    onSearch={handleBranchCodeSearchClick}
                    isSearching={isSearchingBranchCode}
                    showDropdown={branchCodeState.showResults}
                    onClose={() =>
                      setBranchCodeState(prev => ({
                        ...prev,
                        showResults: false,
                      }))
                    }
                    dropdownOptions={branchCodeState.results.map(code => ({
                      value: code.identity,
                      label: `${code.branchName} - ${code.branchCode}`,
                      code: code.branchCode,
                      name: code.branchName,
                    }))}
                    onOptionSelect={
                      handleBranchCodeSelect as (option: unknown) => void
                    }
                    dropdownLoading={isSearchingBranchCode}
                    disabled={
                      isLoading ||
                      readonly ||
                      hasRegionCode ||
                      hasClusterCode ||
                      hasStateCode
                    }
                  />
                </Form.Field>
              </Form.Col>

              <Form.Col lg={2} md={6} span={12}>
                <Form.Field label="Region Code" error={errors.regionCode}>
                  <InputWithSearch
                    placeholder="Search Region Code"
                    size="form"
                    variant="form"
                    value={
                      regionCodeState.selected
                        ? `${regionCodeState.selected.regionName} - ${regionCodeState.selected.regionCode}`
                        : regionCodeState.searchTerm
                    }
                    onChange={e => {
                      const value = e.target.value;
                      const expectedValue = regionCodeState.selected
                        ? `${regionCodeState.selected.regionName} - ${regionCodeState.selected.regionCode}`
                        : "";
                      if (regionCodeState.selected && value !== expectedValue) {
                        setRegionCodeState(prev => ({
                          ...prev,
                          selected: null,
                        }));
                        setValue("regionCode", "");
                        void trigger("regionCode");
                      }
                      handleRegionCodeSearch(value);
                    }}
                    onDoubleClick={() => {
                      if (regionCodeState.selected) {
                        handleClearRegionCode();
                      }
                    }}
                    onKeyDown={e => {
                      if (e.key === "Escape" && regionCodeState.selected) {
                        handleClearRegionCode();
                      }
                    }}
                    onSearch={handleRegionCodeSearchClick}
                    isSearching={isSearchingRegionCode}
                    showDropdown={regionCodeState.showResults}
                    onClose={() =>
                      setRegionCodeState(prev => ({
                        ...prev,
                        showResults: false,
                      }))
                    }
                    dropdownOptions={regionCodeState.results.map(code => ({
                      value: code.identity,
                      label: `${code.regionName} - ${code.regionCode}`,
                      code: code.regionCode,
                      name: code.regionName,
                    }))}
                    onOptionSelect={
                      handleRegionCodeSelect as (option: unknown) => void
                    }
                    dropdownLoading={isSearchingRegionCode}
                    disabled={
                      isLoading ||
                      readonly ||
                      hasBranchCode ||
                      hasClusterCode ||
                      hasStateCode
                    }
                  />
                </Form.Field>
              </Form.Col>

              <Form.Col lg={2} md={6} span={12}>
                <Form.Field label="Cluster Code" error={errors.clusterCode}>
                  <InputWithSearch
                    placeholder="Search Cluster Code"
                    size="form"
                    variant="form"
                    value={
                      clusterCodeState.selected
                        ? `${clusterCodeState.selected.clusterName} - ${clusterCodeState.selected.clusterCode}`
                        : clusterCodeState.searchTerm
                    }
                    onChange={e => {
                      const value = e.target.value;
                      const expectedValue = clusterCodeState.selected
                        ? `${clusterCodeState.selected.clusterName} - ${clusterCodeState.selected.clusterCode}`
                        : "";
                      if (
                        clusterCodeState.selected &&
                        value !== expectedValue
                      ) {
                        setClusterCodeState(prev => ({
                          ...prev,
                          selected: null,
                        }));
                        setValue("clusterCode", "");
                        void trigger("clusterCode");
                      }
                      handleClusterCodeSearch(value);
                    }}
                    onDoubleClick={() => {
                      if (clusterCodeState.selected) {
                        handleClearClusterCode();
                      }
                    }}
                    onKeyDown={e => {
                      if (e.key === "Escape" && clusterCodeState.selected) {
                        handleClearClusterCode();
                      }
                    }}
                    onSearch={handleClusterCodeSearchClick}
                    isSearching={isSearchingClusterCode}
                    showDropdown={clusterCodeState.showResults}
                    onClose={() =>
                      setClusterCodeState(prev => ({
                        ...prev,
                        showResults: false,
                      }))
                    }
                    dropdownOptions={clusterCodeState.results.map(code => ({
                      value: code.identity,
                      label: `${code.clusterName} - ${code.clusterCode}`,
                      code: code.clusterCode,
                      name: code.clusterName,
                    }))}
                    onOptionSelect={
                      handleClusterCodeSelect as (option: unknown) => void
                    }
                    dropdownLoading={isSearchingClusterCode}
                    disabled={
                      isLoading ||
                      readonly ||
                      hasBranchCode ||
                      hasRegionCode ||
                      hasStateCode
                    }
                  />
                </Form.Field>
              </Form.Col>
            </Form.Row>

            <Form.Row className="mt-4">
              <Form.Col lg={2} md={6} span={12}>
                <Form.Field label="State Code" error={errors.stateCode}>
                  <InputWithSearch
                    placeholder="Search State Code"
                    size="form"
                    variant="form"
                    value={
                      stateCodeState.selected
                        ? `${stateCodeState.selected.state} - ${stateCodeState.selected.stateId}`
                        : stateCodeState.searchTerm
                    }
                    onChange={e => {
                      const value = e.target.value;
                      const expectedValue = stateCodeState.selected
                        ? `${stateCodeState.selected.state} - ${stateCodeState.selected.stateId}`
                        : "";

                      if (stateCodeState.selected && value !== expectedValue) {
                        setStateCodeState(prev => ({
                          ...prev,
                          selected: null,
                        }));
                        setValue("stateCode", "");
                        void trigger("stateCode");
                      }
                      handleStateCodeSearch(value);
                    }}
                    onDoubleClick={() => {
                      if (stateCodeState.selected) {
                        handleClearStateCode();
                      }
                    }}
                    onKeyDown={e => {
                      if (e.key === "Escape" && stateCodeState.selected) {
                        handleClearStateCode();
                      }
                    }}
                    onSearch={handleStateCodeSearchClick}
                    isSearching={isSearchingStateCode}
                    showDropdown={stateCodeState.showResults}
                    onClose={() =>
                      setStateCodeState(prev => ({
                        ...prev,
                        showResults: false,
                      }))
                    }
                    dropdownOptions={stateCodeState.results.map(code => ({
                      value: code.identity,
                      label: `${code.state} - ${code.stateId}`,
                      stateId: code.stateId,
                      state: code.state,
                    }))}
                    onOptionSelect={
                      handleStateCodeSelect as (option: unknown) => void
                    }
                    dropdownLoading={isSearchingStateCode}
                    disabled={
                      isLoading ||
                      readonly ||
                      hasBranchCode ||
                      hasRegionCode ||
                      hasClusterCode
                    }
                  />
                </Form.Field>
              </Form.Col>
              <Form.Col lg={2} md={6} span={12}>
                <Form.Field
                  label="Effective From"
                  required
                  error={errors.effectiveFrom}
                >
                  <Input
                    type="date"
                    size="form"
                    variant="form"
                    {...register("effectiveFrom")}
                    disabled={isLoading || readonly}
                    max={new Date().toISOString().split("T")[0]}
                  />
                </Form.Field>
              </Form.Col>

              <Form.Col lg={2} md={6} span={12}>
                <Form.Field label="Effective To" error={errors.effectiveTo}>
                  <Input
                    type="date"
                    size="form"
                    variant="form"
                    {...register("effectiveTo")}
                    disabled={isLoading || readonly}
                    min={watch("effectiveFrom") || undefined}
                  />
                </Form.Field>
              </Form.Col>

              <Form.Col lg={2} md={6} span={12}>
                <Flex align="center" gap={2} className="mt-5 h-full">
                  <Controller
                    name="isActive"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        id="isActive"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isLoading || readonly}
                      />
                    )}
                  />
                  <Label htmlFor="isActive" className="text-xs font-medium">
                    Active
                  </Label>
                </Flex>
              </Form.Col>
            </Form.Row>

            <div className="mt-4">
              <Flex.ActionGroup>
                <Button
                  type="button"
                  variant="resetCompact"
                  size="compactWhite"
                  onClick={handleCancel}
                  disabled={isLoading || readonly}
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="resetCompact"
                  size="compactWhite"
                  onClick={handleReset}
                  disabled={isLoading || readonly}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
                <Button
                  type="submit"
                  variant="resetPrimary"
                  size="compactWhite"
                  disabled={isLoading || readonly}
                >
                  <Save className="mr-2 h-4 w-4" />
                  {isLoading
                    ? "Processing..."
                    : isEditMode
                      ? "Update Mapping"
                      : "Save Mapping"}
                </Button>
              </Flex.ActionGroup>
            </div>
          </Form>
        )}
      </FormContainer>
    </article>
  );
};
