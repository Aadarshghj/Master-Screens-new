import React, { useState, useCallback, useEffect } from "react";
import {
  type Control,
  type FieldErrors,
  type UseFormRegister,
  type UseFormSetValue,
  type UseFormWatch,
} from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { TitleHeader } from "@/components/ui/title-header/TitleHeader";
import { InputWithSearch } from "@/components/ui/input-with-search";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Plus, SearchIcon, RefreshCcw } from "lucide-react";
import type {
  FirmProfile,
  AssociatedPerson,
  AssociatedPersonFormInputs,
  ConfigOption,
  RoleInFirm,
} from "@/types/firm/firm-details.types";
import { DurationWithCompany } from "@/types/firm/firm-details.types";
import { logger } from "@/global/service";
import { useSearchCustomerByCodeMutation } from "@/global/service/end-points/master/firm-master";
import { CustomerSearchAssociate } from "../Modal/AssosiateSearch";
import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button";

interface AssociatedPersonInfoSectionProps {
  control: Control<FirmProfile>;
  errors: FieldErrors<FirmProfile>;
  register: UseFormRegister<FirmProfile>;
  isLoading: boolean;
  readonly: boolean;
  roleInFirmOptions: ConfigOption[];
  durationOptions: ConfigOption[];
  isLoadingRoles: boolean;
  isLoadingDurations: boolean;
  setValue: UseFormSetValue<FirmProfile>;
  watch: UseFormWatch<FirmProfile>;
  onSearchAssociate?: (query: string) => Promise<void>;
  isSearching?: boolean;
  onResetForm?: () => void;
  handleOpenOnboardingModal: () => void;
  handleInputChange: (
    field: keyof AssociatedPersonFormInputs,
    value: unknown
  ) => void;
  setFormInputs: (
    value: React.SetStateAction<AssociatedPersonFormInputs>
  ) => void;
  formInputs: AssociatedPersonFormInputs;
  onResetRequest: () => void;
}

export const AssociatedPersonInfoSection: React.FC<
  AssociatedPersonInfoSectionProps
> = ({
  isLoading,
  readonly,
  roleInFirmOptions,
  durationOptions,
  isLoadingRoles,
  isLoadingDurations,
  setValue,
  watch,
  isSearching = false,
  handleOpenOnboardingModal,
  handleInputChange,
  setFormInputs,
  formInputs,
  onResetRequest,
}) => {
  const [searchCustomer] = useSearchCustomerByCodeMutation();
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const handleSearchModal = useCallback(() => {
    setIsSearchModalOpen(true);
  }, []);

  const handleCloseSearchModal = useCallback(() => {
    setIsSearchModalOpen(false);
  }, []);

  const handleSelectAssociate = useCallback(
    (
      customer:
        | Record<string, unknown>
        | {
            custId?: string;
            customerCode?: string;
            customerName?: string;
            customerIdentity?: string;
          }
    ) => {
      setFormInputs(prev => ({
        ...prev,
        customerCode: String(customer.custId || customer.customerCode),
        customerName: String(customer.customerName),
        customerIdentity: String(customer.customerIdentity || ""),
      }));
      setIsSearchModalOpen(false);
      logger.info("Customer selected successfully", { toast: true });
    },
    []
  );

  const handleDirectSearch = useCallback(async () => {
    if (!formInputs.customerCode) return;

    try {
      const result = await searchCustomer({
        customerCode: formInputs.customerCode,
      }).unwrap();
      if (!result || (Array.isArray(result) && result.length === 0)) {
        logger.error("Customer not found", { toast: true });

        setFormInputs(prev => ({
          ...prev,
          customerName: "",
          customerIdentity: "",
        }));

        return;
      }
      const customer = Array.isArray(result) ? result[0] : result;
      const firstName = String(
        customer?.firstname ||
          customer?.firstName ||
          customer?.customerName ||
          customer?.name ||
          ""
      );
      setFormInputs(prev => ({
        ...prev,
        customerName: firstName,
        customerIdentity: String(customer?.identity || ""),
      }));
      logger.info("Customer found successfully", { toast: true });
    } catch (error: unknown) {
      // Show API response message in toast
      const errorData = error as Record<string, unknown>;
      const errorMessage = String(
        (errorData?.data as Record<string, unknown>)?.message ||
          errorData?.message ||
          "Customer not found"
      );
      logger.error(errorMessage, { toast: true });
    }
  }, [formInputs.customerCode, searchCustomer]);

  const handleAddAssociate = useCallback(() => {
    try {
      if (!formInputs.customerCode) {
        logger.error("Customer Code is required", {
          toast: true,
          pushLog: false,
        });
        return;
      }

      if (!formInputs.customerName) {
        logger.error("Customer Name is required", {
          toast: true,
          pushLog: false,
        });
        return;
      }

      if (!formInputs.roleInFirm) {
        logger.error("Role in Firm is required", {
          toast: true,
          pushLog: false,
        });
        return;
      }

      if (!formInputs.durationWithCompany) {
        logger.error("Duration with Company is required", {
          toast: true,
          pushLog: false,
        });
        return;
      }

      // Get the latest value directly from watch to avoid stale closure
      const currentAssociatedPersons = watch("associatedPersons") || [];

      const exists = currentAssociatedPersons.some(
        person => person.customerCode === formInputs.customerCode
      );

      if (exists) {
        logger.error("This associate is already added", {
          toast: true,
          pushLog: false,
        });
        return;
      }

      const newPerson: AssociatedPerson = {
        customerCode: formInputs.customerCode,
        customerName: formInputs.customerName,
        roleInFirm: formInputs.roleInFirm,
        authorizedSignatory: formInputs.authorizedSignatory,
        durationWithCompany: mapToDurationLabel(formInputs.durationWithCompany),
        customerIdentity: formInputs.customerIdentity,
      };

      // Use the current value from watch, not from useMemo
      setValue("associatedPersons", [...currentAssociatedPersons, newPerson], {
        shouldValidate: true,
        shouldDirty: true,
      });

      setFormInputs({
        customerCode: "",
        customerName: "",
        roleInFirm: null,
        authorizedSignatory: false,
        durationWithCompany: null,
        customerIdentity: "",
      });

      logger.info("Associate added successfully", {
        toast: true,
        pushLog: false,
      });
    } catch (error) {
      logger.error(error, { toast: true });
    }
  }, [formInputs, setValue, watch]);

  // Set default values when options load
  useEffect(() => {
    if (roleInFirmOptions.length > 0 && !formInputs.roleInFirm) {
      setFormInputs(prev => ({
        ...prev,
        roleInFirm: roleInFirmOptions[0].value as RoleInFirm,
      }));
    }
  }, [roleInFirmOptions, formInputs.roleInFirm]);

  const mapToDurationLabel = (val: unknown): DurationWithCompany => {
    const s = val === null || val === undefined ? "" : String(val).trim();
    const labels = Object.values(DurationWithCompany) as string[];
    if (labels.includes(s)) return s as DurationWithCompany;

    const n = Number(s);
    if (!isNaN(n)) {
      if (n <= 1) return DurationWithCompany.LESS_THAN_1_YEAR;
      if (n <= 3) return DurationWithCompany.ONE_TO_THREE_YEARS;
      if (n <= 5) return DurationWithCompany.THREE_TO_FIVE_YEARS;
      if (n <= 10) return DurationWithCompany.FIVE_TO_TEN_YEARS;
      return DurationWithCompany.MORE_THAN_TEN_YEARS;
    }

    const rangeMatch = s.match(/(\d+)\s*-\s*(\d+)/);
    if (rangeMatch) {
      const high = Number(rangeMatch[2]);
      if (high <= 1) return DurationWithCompany.LESS_THAN_1_YEAR;
      if (high <= 3) return DurationWithCompany.ONE_TO_THREE_YEARS;
      if (high <= 5) return DurationWithCompany.THREE_TO_FIVE_YEARS;
      if (high <= 10) return DurationWithCompany.FIVE_TO_TEN_YEARS;
      return DurationWithCompany.MORE_THAN_TEN_YEARS;
    }
    const gtMatch = s.match(/>\s*(\d+)/);
    if (gtMatch) {
      const v = Number(gtMatch[1]);
      if (!isNaN(v) && v > 10) return DurationWithCompany.MORE_THAN_TEN_YEARS;
      if (!isNaN(v) && v <= 1) return DurationWithCompany.LESS_THAN_1_YEAR;
      if (!isNaN(v) && v <= 3) return DurationWithCompany.ONE_TO_THREE_YEARS;
      if (!isNaN(v) && v <= 5) return DurationWithCompany.THREE_TO_FIVE_YEARS;
      if (!isNaN(v) && v <= 10) return DurationWithCompany.FIVE_TO_TEN_YEARS;
    }

    const ltMatch = s.match(/<\s*(\d+)/);
    if (ltMatch) {
      const v = Number(ltMatch[1]);
      if (!isNaN(v) && v < 1) return DurationWithCompany.LESS_THAN_1_YEAR;
      if (!isNaN(v) && v <= 1) return DurationWithCompany.LESS_THAN_1_YEAR;
    }

    return (
      (durationOptions[0]?.value as DurationWithCompany) ||
      DurationWithCompany.LESS_THAN_1_YEAR
    );
  };

  useEffect(() => {
    // If durationOptions loaded and current value is missing, set default
    if (durationOptions.length > 0 && !formInputs.durationWithCompany) {
      setFormInputs(prev => ({
        ...prev,
        durationWithCompany: durationOptions[0].value as DurationWithCompany,
      }));
      return;
    }

    // If current value is present but not a valid label (e.g., numeric from backend), normalize it
    if (formInputs.durationWithCompany) {
      const labels = Object.values(DurationWithCompany) as string[];
      if (!labels.includes(String(formInputs.durationWithCompany))) {
        setFormInputs(prev => ({
          ...prev,
          durationWithCompany: mapToDurationLabel(prev.durationWithCompany),
        }));
      }
    }
  }, [durationOptions, formInputs.durationWithCompany]);

  const handleReset = () => {
    onResetRequest();
  };

  return (
    <div className="mt-11">
      <div className="flex items-center justify-between">
        <TitleHeader title="Associated Persons Information" />
        <div className="flex gap-2">
          <NeumorphicButton
            type="button"
            variant="default"
            size="secondary"
            onClick={handleSearchModal}
            disabled={isLoading || readonly || isSearching}
          >
            {" "}
            <SearchIcon className="mr-1 h-4 w-4" />
            {isSearching ? "Searching..." : "Search Associate"}
          </NeumorphicButton>
          <NeumorphicButton
            type="button"
            variant="default"
            size="secondary"
            onClick={handleOpenOnboardingModal}
            disabled={isLoading || readonly}
          >
            <Plus className="mr-1 h-4 w-4" />
            Create Associate
          </NeumorphicButton>
        </div>
      </div>

      <div className="mt-4">
        <Form.Row className="mt-8">
          <Form.Col lg={3} md={6} span={12}>
            <Form.Field label="Customer Code" required>
              <InputWithSearch
                value={formInputs.customerCode}
                onChange={e => {
                  const value = e.target.value
                    .toUpperCase()
                    .replace(/[^A-Z0-9]/g, "")
                    .slice(0, 20);
                  handleInputChange("customerCode", value);
                }}
                type="text"
                placeholder="Enter customer code and search"
                size="form"
                variant="form"
                onSearch={handleDirectSearch}
                isSearching={isSearching}
                disabled={isLoading || readonly}
              />
            </Form.Field>
          </Form.Col>

          <Form.Col lg={3} md={6} span={12}>
            <Form.Field label="Customer Name" required>
              <Input
                value={formInputs.customerName}
                placeholder="Auto-filled from customer code search"
                size="form"
                variant="form"
                disabled={true}
                readOnly={true}
              />
            </Form.Field>
          </Form.Col>

          <Form.Col lg={3} md={6} span={12}>
            <Form.Field label="Role in firm" required>
              <Select
                value={
                  formInputs.roleInFirm?.toString() ||
                  (roleInFirmOptions.length > 0
                    ? roleInFirmOptions[0].value.toString()
                    : "")
                }
                onValueChange={value => handleInputChange("roleInFirm", value)}
                disabled={isLoading || readonly || isLoadingRoles}
                placeholder="Select Role"
                size="form"
                variant="form"
                fullWidth={true}
                itemVariant="form"
                options={roleInFirmOptions}
                loading={isLoadingRoles}
              />
            </Form.Field>
          </Form.Col>

          <Form.Col lg={3} md={6} span={12}>
            <div className="flex h-[60px] items-center gap-2">
              <Switch
                checked={formInputs.authorizedSignatory}
                onCheckedChange={checked =>
                  handleInputChange("authorizedSignatory", checked)
                }
                disabled={isLoading || readonly}
              />
              <Label className="text-xxs font-medium">
                Authorized Signatory
              </Label>
            </div>
          </Form.Col>
        </Form.Row>

        <Form.Row className="mt-4">
          <Form.Col lg={3} md={6} span={12}>
            <Form.Field label="Duration with Company" required>
              <Select
                value={
                  formInputs.durationWithCompany?.toString() ||
                  (durationOptions.length > 0
                    ? durationOptions[0].value.toString()
                    : "")
                }
                onValueChange={value =>
                  handleInputChange(
                    "durationWithCompany",
                    mapToDurationLabel(value)
                  )
                }
                disabled={isLoading || readonly || isLoadingDurations}
                placeholder="< 1 Year"
                size="form"
                variant="form"
                fullWidth={true}
                itemVariant="form"
                options={durationOptions}
                loading={isLoadingDurations}
              />
            </Form.Field>
          </Form.Col>

          <Form.Col lg={9} md={6} span={12} className="mt-20">
            <div className="flex h-full items-end justify-end gap-2 pb-1 ">
              <NeumorphicButton
                className="bg-slate-500"
                type="button"
                variant="default"
                size="secondary"
                onClick={handleReset}
                disabled={isLoading || readonly}
              >
                <RefreshCcw className="mr-1 h-4 w-4 " />
                Reset
              </NeumorphicButton>
              <NeumorphicButton
                type="button"
                variant="default"
                size="secondary"
                onClick={handleAddAssociate}
                disabled={isLoading || readonly}
              >
                <Plus className="mr-1 h-4 w-4" />
                Add Associate
              </NeumorphicButton>
            </div>
          </Form.Col>
        </Form.Row>
      </div>

      {/* Customer Search Modal */}
      <CustomerSearchAssociate
        isOpen={isSearchModalOpen}
        onClose={handleCloseSearchModal}
        onSelectCustomer={handleSelectAssociate}
      />
    </div>
  );
};
