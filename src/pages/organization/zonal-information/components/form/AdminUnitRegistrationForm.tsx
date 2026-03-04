import {
  DatePicker,
  Flex,
  FormContainer,
  Input,
  InputWithSearch,
  TitleHeader,
} from "@/components";
import type { DropdownOption } from "@/components/ui/input-with-search/input-with-search";
import { Form, Select, Switch, Label } from "@/components";
import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button";
import type { Option } from "@/types/customer-management/designation";
import type { AdminUnitDetails } from "@/types/organisation/admin-unit";
import type { UseFormWatch, UseFormSetValue } from "react-hook-form";
import { RotateCcw, Save } from "lucide-react";
import {
  Controller,
  type Control,
  type FieldErrors,
  type UseFormRegister,
} from "react-hook-form";
import type { UseFormTrigger } from "react-hook-form";

interface AdminUnitRegistrationProps {
  control: Control<AdminUnitDetails>;
  errors: FieldErrors<AdminUnitDetails>;
  register: UseFormRegister<AdminUnitDetails>;
  isSubmitting: boolean;
  isBranch: boolean;
  selectedStatus?: string;
  isUnitTypeLocked?: boolean;
  onSubmit: () => void;
  onReset: () => void;
  onPincodeSearch: () => Promise<void>;
  onPostOfficeSelect: (option: DropdownOption) => void;
  adminUnitTypeOptions: Option[];
  statusOptions: Option[];
  branchTypeOptions: Option[];
  categoryOptions: Option[];
  parentOptions: Option[];
  mergedToOptions: Option[];
  timezoneOptions: Option[];
  languageOptions: Option[];
  watch: UseFormWatch<AdminUnitDetails>;
  setValue: UseFormSetValue<AdminUnitDetails>;
  trigger: UseFormTrigger<AdminUnitDetails>;
  postOfficeOptions: DropdownOption[];
  showPostOfficeDropdown: boolean;
  setShowPostOfficeDropdown: (value: boolean) => void;
  postOfficeLoading: boolean;
  postOfficeError?: string;
}

export const AdminUnitRegistrationForm: React.FC<
  AdminUnitRegistrationProps
> = ({
  control,
  errors,
  register,
  isSubmitting,
  selectedStatus,
  isUnitTypeLocked = false,
  onSubmit,
  onReset,
  onPincodeSearch,
  onPostOfficeSelect,
  watch,
  adminUnitTypeOptions = [],
  statusOptions,
  branchTypeOptions,
  categoryOptions,
  parentOptions,
  timezoneOptions,
  languageOptions,
  postOfficeOptions,
  postOfficeLoading,
  postOfficeError,
}) => {
  const selectedUnitType = watch("adminUnitTypeIdentity");
  const selectedPostOffice = watch("postOfficeIdentity");

  const selectedUnitLabel =
    adminUnitTypeOptions.find(o => o.value === selectedUnitType)?.label ??
    "Branch";

  const selectedStatusLabel =
    statusOptions.find(o => o.value === selectedStatus)?.label?.toUpperCase() ??
    "";

  const isClosed = selectedStatusLabel === "CLOSED";
  const isShifted = selectedStatusLabel === "SHIFTED";
  const isMerged = selectedStatusLabel === "MERGED";
  const isCreated = selectedStatusLabel === "CREATED";

  const selectedUnitCode =
    (adminUnitTypeOptions as (Option & { code?: string })[]).find(
      o => o.value === selectedUnitType
    )?.code ?? "";
  const isCorporate = selectedUnitCode.toUpperCase() === "CORPORATE";

  const postOfficeSelectOptions: Option[] = postOfficeOptions.map(o => ({
    label: o.label,
    value: o.value,
  }));

  const handlePostOfficeChange = (value: string) => {
    const matched = postOfficeOptions.find(o => o.value === value);
    if (matched) onPostOfficeSelect(matched);
  };

  return (
    <FormContainer className="px-0">
      <Form onSubmit={onSubmit}>
        <div className="mt-2">
          <Form.Row>
            <Form.Col lg={2} md={6} span={12}>
              <Form.Field
                label="Admin Unit Type"
                required
                error={errors.adminUnitTypeIdentity}
              >
                {isUnitTypeLocked ? (
                  <Input
                    value={selectedUnitLabel}
                    size="form"
                    variant="form"
                    className="font-medium uppercase"
                    readOnly
                    disabled
                  />
                ) : (
                  <Controller
                    name="adminUnitTypeIdentity"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value ?? ""}
                        onValueChange={field.onChange}
                        options={adminUnitTypeOptions}
                        size="form"
                        variant="form"
                        fullWidth
                        itemVariant="form"
                      />
                    )}
                  />
                )}
              </Form.Field>
            </Form.Col>

            <Form.Col lg={2} md={6} span={12}>
              <Form.Field
                label={`${selectedUnitLabel} Code`}
                required
                error={errors.branchCode}
              >
                <Input
                  {...register("branchCode")}
                  placeholder={`${selectedUnitLabel} Code`}
                  size="form"
                  variant="form"
                  className="uppercase"
                  maxLength={10}
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={3} md={6} span={12}>
              <Form.Field
                label={`${selectedUnitLabel} Name`}
                required
                error={errors.branchName}
              >
                <Input
                  {...register("branchName")}
                  placeholder={`Enter ${selectedUnitLabel} Name`}
                  size="form"
                  variant="form"
                  className="uppercase"
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={3} md={6} span={12}>
              <Form.Field
                label={`${selectedUnitLabel} Short Name`}
                error={errors.branchShortName}
              >
                <Input
                  {...register("branchShortName")}
                  placeholder={`Enter ${selectedUnitLabel} Short Name`}
                  size="form"
                  variant="form"
                  className="uppercase"
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={2} md={6} span={12}>
              <Form.Field
                label="Status"
                required
                error={errors.branchStatusIdentity}
              >
                <Controller
                  name="branchStatusIdentity"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value ?? ""}
                      onValueChange={field.onChange}
                      options={statusOptions}
                      placeholder="Select Status"
                      size="form"
                      variant="form"
                      fullWidth
                      itemVariant="form"
                    />
                  )}
                />
              </Form.Field>
            </Form.Col>

            {!isCreated && !isCorporate && (
              <Form.Col lg={2} md={6} span={12}>
                <Form.Field
                  label={`Parent ${selectedUnitLabel}`}
                  error={errors.parentBranchIdentity}
                >
                  <Controller
                    name="parentBranchIdentity"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value ?? ""}
                        onValueChange={val => {
                          if (val.startsWith("__divider__")) return;
                          field.onChange(val);
                        }}
                        options={parentOptions}
                        placeholder={
                          parentOptions.length === 0
                            ? "No parent units registered yet"
                            : "Select parent unit"
                        }
                        disabled={parentOptions.length === 0}
                        size="form"
                        variant="form"
                        fullWidth
                        itemVariant="form"
                      />
                    )}
                  />
                </Form.Field>
              </Form.Col>
            )}

            <Form.Col lg={2} md={6} span={12}>
              <Form.Field
                label={`${selectedUnitLabel} Type`}
                required
                error={errors.branchTypeIdentity}
              >
                <Controller
                  name="branchTypeIdentity"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value ?? ""}
                      onValueChange={field.onChange}
                      options={branchTypeOptions}
                      placeholder="Select option"
                      size="form"
                      variant="form"
                      fullWidth
                      itemVariant="form"
                    />
                  )}
                />
              </Form.Field>
            </Form.Col>

            {!isCreated && (
              <Form.Col lg={2} md={6} span={12}>
                <Form.Field
                  label={`${selectedUnitLabel} Category`}
                  required
                  error={errors.branchCategoryIdentity}
                >
                  <Controller
                    name="branchCategoryIdentity"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value ?? ""}
                        onValueChange={field.onChange}
                        options={categoryOptions}
                        placeholder="Select option"
                        size="form"
                        variant="form"
                        fullWidth
                        itemVariant="form"
                      />
                    )}
                  />
                </Form.Field>
              </Form.Col>
            )}

            <Form.Col lg={2} md={6} span={12}>
              <Form.Field label="Registration Date" required>
                <Controller
                  name="registrationDate"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      value={field.value ?? undefined}
                      onChange={(value: string) => field.onChange(value)}
                      onBlur={() => field.onBlur()}
                      placeholder="dd/mm/yyyy"
                      allowManualEntry={true}
                      size="form"
                      variant="form"
                      disableFutureDates={true}
                    />
                  )}
                />
                <Form.Error error={errors.registrationDate} />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={2} md={6} span={12}>
              <Form.Field label="Opening Date" required>
                <Controller
                  name="openingDate"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      value={field.value ?? undefined}
                      onChange={(value: string) => field.onChange(value)}
                      onBlur={() => field.onBlur()}
                      placeholder="dd/mm/yyyy"
                      allowManualEntry={true}
                      size="form"
                      variant="form"
                      disableFutureDates={true}
                    />
                  )}
                />
                <Form.Error error={errors.openingDate} />
              </Form.Field>
            </Form.Col>

            {isClosed && (
              <Form.Col lg={2} md={6} span={12}>
                <Form.Field label="Closing Date">
                  <Controller
                    name="closingDate"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        value={field.value ?? undefined}
                        onChange={(value: string) => field.onChange(value)}
                        onBlur={() => field.onBlur()}
                        placeholder="//Auto Fetch"
                        allowManualEntry={true}
                        size="form"
                        variant="form"
                        disabled
                      />
                    )}
                  />
                  <Form.Error error={errors.closingDate} />
                </Form.Field>
              </Form.Col>
            )}

            {isShifted && (
              <Form.Col lg={2} md={6} span={12}>
                <Form.Field label="Date of Shift">
                  <Controller
                    name="dateOfShift"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        value={field.value ?? undefined}
                        onChange={(value: string) => field.onChange(value)}
                        onBlur={() => field.onBlur()}
                        placeholder="//Auto Fetch"
                        allowManualEntry={true}
                        size="form"
                        variant="form"
                        disabled
                      />
                    )}
                  />
                  <Form.Error error={errors.dateOfShift} />
                </Form.Field>
              </Form.Col>
            )}

            {isMerged && (
              <>
                <Form.Col lg={2} md={6} span={12}>
                  <Form.Field label="Merged On">
                    <Controller
                      name="mergedOn"
                      control={control}
                      render={({ field }) => (
                        <DatePicker
                          value={field.value ?? undefined}
                          onChange={(value: string) => field.onChange(value)}
                          onBlur={() => field.onBlur()}
                          placeholder="//Auto Fetch"
                          allowManualEntry={true}
                          size="form"
                          variant="form"
                          disabled
                        />
                      )}
                    />
                    <Form.Error error={errors.mergedOn} />
                  </Form.Field>
                </Form.Col>

                <Form.Col lg={2} md={6} span={12}>
                  <Form.Field
                    label="Merged To"
                    error={errors.mergedToBranchIdentity}
                  >
                    <Controller
                      name="mergedToBranchIdentity"
                      control={control}
                      render={({ field }) => (
                        <Input
                          value={field.value ?? ""}
                          placeholder="Auto Fetch"
                          size="form"
                          variant="form"
                          disabled
                        />
                      )}
                    />
                  </Form.Field>
                </Form.Col>
              </>
            )}

            <Form.Col lg={2} md={6} span={12}>
              <Form.Field label="Language" error={errors.language}>
                <Controller
                  name="language"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value ?? ""}
                      onValueChange={field.onChange}
                      options={languageOptions}
                      placeholder="Select Language"
                      size="form"
                      variant="form"
                      fullWidth
                      itemVariant="form"
                    />
                  )}
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={2} md={6} span={12}>
              <Flex
                direction="col"
                gap={2}
                style={{ marginLeft: "25px", marginTop: "20px" }}
              >
                <Flex align="center" gap={2}>
                  <Controller
                    control={control}
                    name="isMainBranchInLocation"
                    render={({ field }) => (
                      <Switch
                        checked={!!field.value}
                        onCheckedChange={field.onChange}
                        size="lg"
                      />
                    )}
                  />
                  <Label>Main {selectedUnitLabel}</Label>
                </Flex>
              </Flex>
            </Form.Col>
          </Form.Row>
        </div>

        <section>
          <div className="flex items-center justify-between">
            <TitleHeader title="Address" className="py-4" />
          </div>

          <div className="mt-2">
            <Form.Row>
              <Form.Col lg={2} md={6} span={12}>
                <Form.Field
                  label="Door Number"
                  error={errors.doorNumber}
                  required
                >
                  <Input
                    {...register("doorNumber")}
                    placeholder="Enter door no."
                    size="form"
                    variant="form"
                    className="uppercase"
                  />
                </Form.Field>
              </Form.Col>

              <Form.Col lg={4} md={6} span={12}>
                <Form.Field
                  label="Address Line 1"
                  error={errors.addressLine1}
                  required
                >
                  <Input
                    {...register("addressLine1")}
                    placeholder="Enter Address Line 1"
                    size="form"
                    variant="form"
                    className="uppercase"
                  />
                </Form.Field>
              </Form.Col>

              <Form.Col lg={3} md={6} span={12}>
                <Form.Field label="Address Line 2" error={errors.addressLine2}>
                  <Input
                    {...register("addressLine2")}
                    placeholder="Enter Address Line 2"
                    size="form"
                    variant="form"
                    className="uppercase"
                  />
                </Form.Field>
              </Form.Col>

              <Form.Col lg={3} md={6} span={12}>
                <Form.Field label="Landmark" error={errors.landmark}>
                  <Input
                    {...register("landmark")}
                    placeholder="Enter Landmark"
                    size="form"
                    variant="form"
                    className="uppercase"
                  />
                </Form.Field>
              </Form.Col>

              <Form.Col lg={4} md={6} span={12}>
                <Form.Field label="Place Name" error={errors.placeName}>
                  <Input
                    {...register("placeName")}
                    placeholder="Street / Land Name"
                    size="form"
                    variant="form"
                    className="uppercase"
                  />
                </Form.Field>
              </Form.Col>

              <Form.Col lg={2} md={6} span={12}>
                <Form.Field label="PIN Code" error={errors.pincode} required>
                  <InputWithSearch
                    {...register("pincode")}
                    placeholder="e.g. 600001"
                    size="form"
                    variant="form"
                    restriction="numeric"
                    maxLength={6}
                    onSearch={onPincodeSearch}
                    showDropdown={false}
                    dropdownOptions={[]}
                    dropdownLoading={postOfficeLoading}
                    noResultsText="No post offices found"
                    onOptionSelect={() => {}}
                    onClose={() => {}}
                  />
                  {postOfficeError && (
                    <p className="text-destructive mt-1 text-xs">
                      {postOfficeError}
                    </p>
                  )}
                </Form.Field>
              </Form.Col>

              <Form.Col lg={3} md={6} span={12}>
                <Form.Field
                  label="Post Office"
                  error={errors.postOffice}
                  required
                >
                  <Select
                    value={selectedPostOffice ?? ""}
                    onValueChange={handlePostOfficeChange}
                    options={postOfficeSelectOptions}
                    placeholder={
                      postOfficeLoading
                        ? "Searching..."
                        : postOfficeSelectOptions.length === 0
                          ? "Search PIN code first"
                          : "Select Post Office"
                    }
                    size="form"
                    variant="form"
                    fullWidth
                    itemVariant="form"
                    disabled={
                      postOfficeSelectOptions.length === 0 || postOfficeLoading
                    }
                  />
                </Form.Field>
              </Form.Col>

              <Form.Col lg={3} md={6} span={12}>
                <Form.Field
                  label="District"
                  error={errors.districtName}
                  required
                >
                  <Input
                    {...register("districtName")}
                    placeholder="District"
                    size="form"
                    variant="form"
                    className="uppercase"
                    disabled
                  />
                </Form.Field>
              </Form.Col>

              <Form.Col lg={3} md={6} span={12}>
                <Form.Field label="State" error={errors.stateName} required>
                  <Input
                    {...register("stateName")}
                    placeholder="State"
                    size="form"
                    variant="form"
                    className="uppercase"
                    disabled
                  />
                </Form.Field>
              </Form.Col>

              <Form.Col lg={2} md={6} span={12}>
                <Form.Field label="Country" error={errors.countryName}>
                  <Input
                    {...register("countryName")}
                    value="INDIA"
                    size="form"
                    variant="form"
                    className="uppercase"
                    readOnly
                    disabled
                  />
                </Form.Field>
              </Form.Col>

              <Form.Col lg={2} md={6} span={12}>
                <Form.Field label="Timezone" error={errors.timezone}>
                  <Controller
                    name="timezone"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value ?? "Asia/Kolkata"}
                        onValueChange={field.onChange}
                        options={timezoneOptions}
                        placeholder="Asia/Kolkata"
                        size="form"
                        variant="form"
                        fullWidth
                        itemVariant="form"
                      />
                    )}
                  />
                </Form.Field>
              </Form.Col>
            </Form.Row>

            <Flex.ActionGroup className="mt-2 justify-end gap-4">
              <NeumorphicButton
                type="button"
                variant="secondary"
                size="secondary"
                onClick={onReset}
                disabled={isSubmitting}
              >
                <RotateCcw className="h-3 w-3" />
                Reset
              </NeumorphicButton>

              <NeumorphicButton
                type="submit"
                variant="default"
                size="default"
                disabled={isSubmitting}
              >
                <Save className="h-3 w-3" />
                {isSubmitting ? "Saving..." : "Save"}
              </NeumorphicButton>
            </Flex.ActionGroup>
          </div>
        </section>
      </Form>
    </FormContainer>
  );
};
