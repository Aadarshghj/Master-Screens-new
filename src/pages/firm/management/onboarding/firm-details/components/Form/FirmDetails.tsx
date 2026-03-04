import React, { useState, useEffect, useRef, useCallback } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useLocation, useParams } from "react-router-dom";
import { Flex } from "@/components/ui/flex";
import { FormContainer } from "@/components/ui/form-container";
import { Save } from "lucide-react";

import { logger } from "@/global/service";
import { useAppDispatch, useAppSelector } from "@/hooks/store";
import {
  setCustomerId,
  setFirmId,
  setCurrentStepSaved,
  setFirmOnboardState,
  setFirmStatus,
} from "@/global/reducers/firm/firmOnboarding.reducer";
import { ProfileDetail } from "./ProfileDetails";
import { FirmDetailsTable } from "../Table/FirmDetailsTable";
import { AssociatedPersonInfoSection } from "./AssociatedPersonInfoSection";
import { firmProfileDefaultValues } from "../../constants/form.constants";
import type {
  FirmProfile,
  ConfigOption,
  RoleInFirm,
  AssociatedPersonFormInputs,
} from "@/types/firm/firm-details.types";

import {
  DURATION_WITH_COMPANY_OPTIONS,
  DurationWithCompany,
} from "@/types/firm/firm-details.types";

import { firmDetailsValidationSchema } from "@/global/validation/firm/firmDetails-schema";
import {
  useGetFirmTypesQuery,
  useGetFirmRolesQuery,
  useGetIndustryCategoriesQuery,
  useGetFirmCanvassedTypesQuery,
  useSearchCustomerByCodeMutation,
  type FirmTypeResponse,
  type FirmRoleResponse,
  type IndustryCategoryResponse,
  type CanvassedTypeResponse,
} from "@/global/service/end-points/master/firm-master";
import {
  useCreateFirmMutation,
  useGetFirmByIdQuery,
  useUpdateFirmMutation,
} from "@/global/service/end-points/Firm/firmDetails";
import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button";
import { CustomerOnboardingModal } from "../Modal/CustomerOnboardingModal";
import { useFormDirtyState } from "@/hooks/useFormDirtyState";
import { ConfirmationModal } from "@/components";

interface FirmDetailsFormProps {
  readonly?: boolean;
  onFormSubmit?: () => void;
  firmId?: string;
  firmIdentity?: string;
  onSaveSuccess?: () => void;
  onUnsavedChanges?: (dirty: boolean) => void;
}

export const FirmDetails: React.FC<FirmDetailsFormProps> = ({
  readonly = false,
  onFormSubmit,
  firmId: propFirmId,
  // onUnsavedChanges,
  onSaveSuccess,
}) => {
  const [, setCustomerIdenity] = useState<string | null>(null);
  const onSaveSuccessRef = useRef(onSaveSuccess);
  onSaveSuccessRef.current = onSaveSuccess;
  const { firmId: urlFirmId } = useParams<{ firmId: string }>();
  const reduxState = useAppSelector(state => {
    return state.firmOnboarding;
  });

  const reduxFirmId = reduxState.firmId;
  const localStorageFirmId = localStorage.getItem("firmId");

  const { handleUpdateFormDirtyState, handleResetFormDirtyState } =
    useFormDirtyState({ isView: false });

  // Validate that we have a UUID format (not customer code)
  const isValidUUID = (id: string) => {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
  };

  // Only use valid UUID firm IDs
  const validFirmIds = [
    propFirmId,
    urlFirmId,
    reduxFirmId,
    localStorageFirmId,
  ].filter(id => id && isValidUUID(id));
  const firmId = validFirmIds[0] || null;

  // If no valid UUID found, check if we have a firmCode to resolve
  const firmCode = localStorage.getItem("firmCode");
  const shouldResolveFirmCode = !firmId && firmCode && !isValidUUID(firmCode);
  const dispatch = useAppDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [, setIsSaved] = useState(false);
  const location = useLocation();

  const hasInitializedRef = useRef(false);

  const {
    data: existingFirmData,
    isLoading: isLoadingExistingData,
    refetch: refetchFirm,
  } = useGetFirmByIdQuery(firmId || "", {
    skip: !firmId,
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: false,
    refetchOnFocus: false,
  });
  useEffect(() => {
    if (!existingFirmData?.firmName) {
      dispatch(
        setFirmOnboardState({
          disableNext: true,
          disableReason: "Please complete the Firm Details before continuing.",
          title: "Incomplete Step",
        })
      );
    } else {
      dispatch(
        setFirmOnboardState({
          disableNext: false,
          disableReason: null,
          title: null,
        })
      );
    }
  }, [existingFirmData]);
  useEffect(() => {
    if (firmId) {
      refetchFirm();
    }
  }, [location.pathname, firmId, refetchFirm]);

  // Handle firmCode resolution to identity
  useEffect(() => {
    if (shouldResolveFirmCode && firmCode) {
      dispatch(setFirmId(firmCode));
    }
  }, [shouldResolveFirmCode, firmCode, dispatch]);

  // RTK Query hooks
  const { data: firmTypesData = [], isLoading: isLoadingFirmTypes } =
    useGetFirmTypesQuery();
  const { data: firmRolesData = [], isLoading: isLoadingRoles } =
    useGetFirmRolesQuery();
  const {
    data: industryCategoriesData = [],
    isLoading: isLoadingProductCategories,
  } = useGetIndustryCategoriesQuery();
  const { data: canvassedTypesData = [], isLoading: isLoadingCanvassedTypes } =
    useGetFirmCanvassedTypesQuery();

  const [createFirm, { isLoading: isCreatingFirm }] = useCreateFirmMutation();
  const [updateFirm, { isLoading: isUpdatingFirm }] = useUpdateFirmMutation();

  const isEditMode = !!firmId && !!existingFirmData;

  const [searchCustomer] = useSearchCustomerByCodeMutation();

  const firmTypeOptions: ConfigOption[] = firmTypesData.map(
    (item: FirmTypeResponse) => ({
      value: item.identity,
      label: item.firmType,
      identity: item.identity,
    })
  );

  const canvassedTypeOptions: ConfigOption[] = canvassedTypesData.map(
    (item: CanvassedTypeResponse) => ({
      value: item.identity,
      label: item.name,
      identity: item.identity,
    })
  );

  const roleInFirmOptions: ConfigOption[] = firmRolesData.map(
    (item: FirmRoleResponse) => ({
      value: item.identity,
      label: item.roleName,
      identity: item.identity,
    })
  );

  const durationOptions: ConfigOption[] = DURATION_WITH_COMPANY_OPTIONS.map(
    opt => ({
      value: opt.value,
      label: opt.label,
    })
  );

  const productCategoryOptions: ConfigOption[] = industryCategoriesData.map(
    (item: IndustryCategoryResponse) => ({
      value: item.identity,
      label: item.industryCategoryName,
      identity: item.identity,
    })
  );

  const {
    control,
    reset,
    trigger,
    setValue,
    getValues,
    watch,
    register,
    formState: { errors, isDirty, dirtyFields, touchedFields },
  } = useForm<FirmProfile>({
    resolver: yupResolver(
      firmDetailsValidationSchema
    ) as unknown as Resolver<FirmProfile>,
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: firmProfileDefaultValues,
  });

  useEffect(() => {
    if (
      firmTypeOptions.length &&
      !getValues("typeOfFirm") &&
      existingFirmData?.firmTypeIdentity
    ) {
      setValue("typeOfFirm", existingFirmData.firmTypeIdentity, {
        shouldDirty: false,
        shouldValidate: false,
      });
    }

    if (
      canvassedTypeOptions.length &&
      !getValues("canvassedType") &&
      existingFirmData?.canvassedTypeIdentity
    ) {
      setValue("canvassedType", existingFirmData.canvassedTypeIdentity, {
        shouldDirty: false,
        shouldValidate: false,
      });
    }
  }, [
    firmTypeOptions,
    canvassedTypeOptions,
    existingFirmData,
    getValues,
    setValue,
  ]);

  // // Auto-populate form when existing data loads
  useEffect(() => {
    if (!existingFirmData || hasInitializedRef.current) return;

    hasInitializedRef.current = true;

    const apiData = existingFirmData as unknown as Record<string, unknown>;

    const transformedData: Partial<FirmProfile> = {
      typeOfFirm:
        typeof apiData.firmTypeIdentity === "string"
          ? apiData.firmTypeIdentity
          : undefined,
      firmName: String(apiData.firmName || ""),
      productIndustryCategory: String(apiData.industryCategoryIdentity || ""),
      registrationNo: String(apiData.registrationNo || ""),
      registrationDate: String(apiData.registrationDate || ""),
      canvassedType:
        typeof apiData.canvassedTypeIdentity === "string"
          ? apiData.canvassedTypeIdentity
          : undefined,
      canvasserIdentity: String(apiData.canvasserIdentity || ""),
      associatedPersons:
        (apiData.associatedPersons as unknown[])?.map(person => {
          const personData = person as Record<string, unknown>;
          const durationValue = Number(personData.durationWithCompany);

          const mapCodeToLabel = (code: number): DurationWithCompany => {
            if (isNaN(code))
              return (
                (durationOptions[0]?.value as DurationWithCompany) ||
                DurationWithCompany.LESS_THAN_1_YEAR
              );
            if (code <= 0) return DurationWithCompany.LESS_THAN_1_YEAR;
            if (code <= 2) return DurationWithCompany.ONE_TO_THREE_YEARS;
            if (code <= 5) return DurationWithCompany.THREE_TO_FIVE_YEARS;
            if (code <= 10) return DurationWithCompany.FIVE_TO_TEN_YEARS;
            return DurationWithCompany.MORE_THAN_TEN_YEARS;
          };

          const label = mapCodeToLabel(durationValue);

          const durationOption = durationOptions.find(
            opt => opt.value === label || opt.label === label
          );

          return {
            customerCode: String(personData.customerCode || ""),
            customerName: String(personData.customerName || ""),
            roleInFirm: String(
              personData.roleInFirmIdentity || ""
            ) as RoleInFirm,
            authorizedSignatory: Boolean(personData.authorizedSignatory),
            durationWithCompany: (durationOption?.value ||
              label) as DurationWithCompany,
            customerIdentity: String(personData.customerIdentity || ""),
          };
        }) || [],
    };

    reset(transformedData, {
      keepDirty: false,
      keepTouched: false,
    });

    dispatch(setCurrentStepSaved(true));

    onSaveSuccessRef.current?.();
  }, [existingFirmData, durationOptions, reset, dispatch]);

  const handleRemoveAssociate = (customerCode: string) => {
    const currentAssociates = watch("associatedPersons") || [];
    const updatedAssociates = currentAssociates.filter(
      person => person.customerCode !== customerCode
    );
    setValue("associatedPersons", updatedAssociates, {
      shouldValidate: true,
    });
  };

  const onSearchAssociate = async (searchQuery: string) => {
    if (!searchQuery) return;
    try {
      setIsSearching(true);
      await searchCustomer({ customerCode: searchQuery }).unwrap();
      logger.info("Customer found", { toast: true });
    } catch {
      logger.error("Customer not found", { toast: true });
    } finally {
      setIsSearching(false);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = getValues();
    try {
      setIsLoading(true);

      const currentFirmId = firmId;
      let result;

      if (isEditMode) {
        result = await updateFirm({
          firmId: currentFirmId!,
          data: data as unknown as Record<string, unknown>,
          existingData: existingFirmData as unknown as Record<string, unknown>,
        }).unwrap();
      } else {
        result = await createFirm(data).unwrap();
      }

      const resultData = result as unknown as Record<string, unknown>;

      const firmIdentity = resultData?.firmIdentity as string | undefined;

      if (firmIdentity && isValidUUID(firmIdentity)) {
        localStorage.setItem("firmIdentity", firmIdentity);
      }

      // ACTUAL ID your backend uses
      const customerId = String(
        resultData?.customerIdentity ||
          resultData?.customerId ||
          resultData?.identity ||
          resultData?.id ||
          ""
      );

      // THIS IS THE KEY FIX — use customerIdentity as firmId everywhere
      const resultFirmId = customerId;

      setCustomerIdenity(customerId);

      if (customerId) {
        dispatch(setCustomerId(customerId));
      }

      if (resultFirmId && isValidUUID(resultFirmId)) {
        dispatch(setFirmId(resultFirmId));
        localStorage.setItem("firmId", resultFirmId);
        logger.info(`Firm ID saved: ${resultFirmId}`);
      } else {
        logger.error("Failed to save firm ID - invalid UUID format");
      }

      logger.info(
        isEditMode ? "Firm updated successfully" : "Firm created successfully",
        { toast: true }
      );

      onFormSubmit?.();
      setIsSaved(true);
      dispatch(setCurrentStepSaved(true));
      reset(data, {
        keepDirty: false,
        keepTouched: false,
      });

      handleResetFormDirtyState();
      onSaveSuccess?.();
    } catch (error) {
      setIsSaved(false);
      dispatch(setCurrentStepSaved(false));

      const errorData = error as Record<string, unknown>;
      const backendMessage =
        (errorData?.data as Record<string, unknown>)?.message ||
        (errorData?.error as Record<string, unknown>)?.message ||
        errorData?.message ||
        "Something went wrong. Please try again.";

      const userMessage = String(backendMessage).includes(
        "Missing required fields"
      )
        ? "Please fill in all required details before saving"
        : String(backendMessage);

      logger.error(userMessage, { toast: true });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFirmSelected = (payload?: {
    customerIdentity?: string;
    firmIdentity?: string;
    status?: string;
  }) => {
    if (!payload) return;

    const { customerIdentity, firmIdentity, status } = payload;

    if (customerIdentity) {
      setCustomerIdenity(customerIdentity);
      dispatch(setCustomerId(customerIdentity));
    }
    if (firmIdentity && isValidUUID(firmIdentity) && customerIdentity) {
      dispatch(setFirmId(customerIdentity));
      localStorage.setItem("firmIdentity", firmIdentity);
      localStorage.setItem("firmId", customerIdentity);
    }

    if (status) {
      dispatch(setFirmStatus(status));
      localStorage.setItem("firmStatus", status);
    }
  };

  const firmStatus = useAppSelector(state => state.firmOnboarding.firmStatus);
  const isPendingApproval = firmStatus === "PENDING_APPROVAL";
  const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState(false);
  const [formInputs, setFormInputs] = useState<AssociatedPersonFormInputs>({
    customerCode: "",
    customerName: "",
    roleInFirm: null,
    authorizedSignatory: false,
    durationWithCompany: null,
    customerIdentity: "",
  });

  const [showResetModal, setShowResetModal] = useState(false);

  const handleOpenOnboardingModal = () => {
    setIsOnboardingModalOpen(true);
  };
  const handleCloseOnboardingModal = () => {
    setIsOnboardingModalOpen(false);
  };
  const handleCustomerCreated = useCallback(
    (customerData: Record<string, unknown>) => {
      // Auto-fill the form with the newly created customer data
      setFormInputs(prev => ({
        ...prev,
        customerCode: String(customerData.customerCode || ""),
        customerName: String(customerData.customerName || ""),
        customerIdentity: String(customerData.customerIdentity || ""),
      }));
      logger.info("Customer created and added to form", { toast: true });
    },
    []
  );
  const handleInputChange = useCallback(
    (field: keyof AssociatedPersonFormInputs, value: unknown) => {
      setFormInputs(prev => {
        if (field === "customerCode") {
          return {
            ...prev,
            [field]: String(value),
            customerName: "",
            customerIdentity: "",
          };
        }
        return { ...prev, [field]: value };
      });
    },
    []
  );

  const userTouched = Object.keys(touchedFields || {}).length > 0;
  useEffect(() => {
    if (readonly) return;
    const hasDirtyValues = Object.keys(dirtyFields || {}).length > 0;
    if (isDirty && hasDirtyValues && userTouched) {
      handleUpdateFormDirtyState();
    } else {
      handleResetFormDirtyState();
    }
  }, [isDirty, dirtyFields, userTouched, readonly]);

  const handleOpenResetModal = () => {
    setShowResetModal(true);
  };

  const handleCloseResetModal = () => {
    setShowResetModal(false);
  };

  const handleConfirmReset = () => {
    reset(firmProfileDefaultValues, {
      keepErrors: false,
      keepDirty: false,
      keepTouched: false,
    });
    setFormInputs({
      customerCode: "",
      customerName: "",
      roleInFirm: null,
      authorizedSignatory: false,
      durationWithCompany: null,
      customerIdentity: "",
    });

    handleResetFormDirtyState();
    localStorage.removeItem("firmIdentity");
    localStorage.removeItem("firmId");

    dispatch(
      setFirmOnboardState({
        disableNext: false,
        disableReason: null,
        title: null,
      })
    );

    setShowResetModal(false);

    logger.info("Form reset successfully", { toast: true });
  };

  return (
    <article className="firm-details-form-container">
      <FormContainer>
        <form onSubmit={onSubmit}>
          <ProfileDetail
            control={control}
            errors={errors}
            register={register}
            setValue={setValue}
            getValues={getValues}
            trigger={trigger}
            onFirmSelected={handleFirmSelected}
            isLoading={isLoading || isLoadingExistingData}
            readonly={readonly}
            firmTypeOptions={firmTypeOptions}
            productCategoryOptions={productCategoryOptions}
            canvassedTypeOptions={canvassedTypeOptions}
            isLoadingFirmTypes={isLoadingFirmTypes}
            isLoadingProductCategories={isLoadingProductCategories}
            isLoadingCannelmentTypes={isLoadingCanvassedTypes}
          />

          {!readonly && (
            <AssociatedPersonInfoSection
              control={control}
              errors={errors}
              register={register}
              isLoading={isLoading || isLoadingExistingData}
              readonly={readonly}
              roleInFirmOptions={roleInFirmOptions}
              durationOptions={durationOptions}
              isLoadingRoles={isLoadingRoles}
              isLoadingDurations={false}
              setValue={setValue}
              watch={watch}
              onSearchAssociate={onSearchAssociate}
              isSearching={isSearching}
              handleOpenOnboardingModal={handleOpenOnboardingModal}
              handleInputChange={handleInputChange}
              setFormInputs={setFormInputs}
              formInputs={formInputs}
              onResetRequest={handleOpenResetModal}
            />
          )}

          {/* Associated Persons Table */}
          <div className="mt-8">
            <FirmDetailsTable
              handleRemoveAssociate={handleRemoveAssociate}
              data={(() => {
                const tableData = watch("associatedPersons") || [];

                return tableData;
              })()}
              roleInFirmOptions={roleInFirmOptions}
              readonly={readonly}
            />
          </div>

          {/* Form Actions */}
          <div className="mt-6">
            <Flex.ActionGroup>
              <NeumorphicButton
                type="submit"
                variant="default"
                size="secondary"
                disabled={
                  isLoading ||
                  isPendingApproval ||
                  isCreatingFirm ||
                  isUpdatingFirm ||
                  readonly
                }
              >
                <Save className="mr-1 h-4 w-4" />
                {isLoading || isCreatingFirm || isUpdatingFirm
                  ? "Saving..."
                  : isEditMode
                    ? "Save Firm Profile"
                    : "Save Firm Profile"}
              </NeumorphicButton>
            </Flex.ActionGroup>
          </div>
        </form>
      </FormContainer>
      <CustomerOnboardingModal
        isOpen={isOnboardingModalOpen}
        onClose={handleCloseOnboardingModal}
        onCustomerCreated={handleCustomerCreated}
      />
      <ConfirmationModal
        isOpen={showResetModal}
        onConfirm={handleConfirmReset}
        onCancel={handleCloseResetModal}
        title="Confirm Reset"
        message="This will clear all entered firm and associate details. Do you want to continue?"
        confirmText="Reset"
        type="warning"
        size="compact"
      />
    </article>
  );
};
