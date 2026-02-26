import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Flex } from "@/components/ui/flex";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { HeaderWrapper } from "@/components/ui/header-wrapper/HeaderWrapper";
import { TitleHeader } from "@/components/ui/title-header/TitleHeader";
import { useAppDispatch, useAppSelector } from "@/hooks/store";
import {
  setIsReady,
  setEditMode,
  resetLeadState,
} from "@/global/reducers/lead/lead-details.reducer";
import {
  useSaveLeadDetailsMutation,
  useUpdateLeadDetailsMutation,
  useLazyGetAdditionalReferenceByProductQuery,
} from "@/global/service/end-points/lead/lead-details";
import {
  useGetAllGendersQuery,
  useGetLeadSourceQuery,
  useGetLeadStageQuery,
  useGetLeadStatusQuery,
  useGetProductsQuery,
  useGetAllAddressTypesQuery,
  useGetAllAddressProofTypesQuery,
  useGetUsersQuery,
} from "@/global/service/end-points/master/lead-master";
import { createLeadDetailsValidationSchema } from "@/global/validation/lead/leadDetails-schema";
import {
  logger,
  useGetCanvassedTypesQuery,
  useSearchCanvasserQuery,
} from "@/global/service";
import type {
  LeadDetailsFormData,
  LeadDetailsFormProps,
  SaveLeadDetailsPayload,
  UpdateLeadDetailsPayload,
  LeadSearchData,
  ConfigOption,
  AdditionalReferenceConfig,
  LeadCreationSuccessResponse,
} from "@/types/lead/lead-details.types";
import {
  Eye,
  FileText,
  RefreshCw,
  Save,
  Search,
  Upload,
  Download,
} from "lucide-react";
import { FormContainer } from "@/components/ui/form-container";
import { leadDetailsDefaultFormValues } from "../../constants/form.constants";
import { AddressDetailsSection } from "./AddressDetailsSection";
import { AdditionalReferenceSection } from "./AdditionalReferenceSection";
import { LeadSearch } from "../Modal/LeadSearch";
import { LeadSuccessModal } from "../Modal/LeadSuccess";
import { ImportHistoryModal } from "../Modal/ImportHistory";
import { useLeadTemplateDownload } from "@/hooks/useLeadTemplateDownload";
import { LeadImportModal } from "../Modal/LeadImport";
import CapsuleButton from "@/components/ui/capsule-button/capsule-button";
import {
  DatePicker,
  InputWithSearch,
  Label,
  Switch,
  Textarea,
} from "@/components";

export const LeadDetailsForm: React.FC<LeadDetailsFormProps> = ({
  readonly = false,
  isViewMode = false,
  initialLeadData,
}) => {
  const dispatch = useAppDispatch();
  const { isEditMode, currentLeadId } = useAppSelector(
    state => state.leadDetails
  );

  const [currentUser] = useState("Current User");
  const [currentUserIdentity] = useState(
    "5b671099-483a-404d-a885-0eca2d009ce7"
  );
  const [tenantId] = useState(1);
  const [tenantIdentity] = useState("1563455e-fb89-4049-9cbe-02148017e1e6");
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successData, setSuccessData] =
    useState<LeadCreationSuccessResponse | null>(null);

  const [pendingDynamicRefs, setPendingDynamicRefs] = useState<Record<
    string,
    string
  > | null>(null);

  const [additionalReferenceConfig, setAdditionalReferenceConfig] = useState<
    AdditionalReferenceConfig[]
  >([]);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const { data: genderOptions = [], isLoading: isLoadingGender } =
    useGetAllGendersQuery();
  const { data: leadSourceOptions = [], isLoading: isLoadingLeadSource } =
    useGetLeadSourceQuery();
  const { data: leadStageOptions = [], isLoading: isLoadingLeadStage } =
    useGetLeadStageQuery();
  const { data: leadStatusOptions = [], isLoading: isLoadingLeadStatus } =
    useGetLeadStatusQuery();
  const { data: productsOptions = [], isLoading: isLoadingProducts } =
    useGetProductsQuery();
  const { data: usersOptions = [], isLoading: isLoadingUsers } =
    useGetUsersQuery();
  const { data: addressTypeOptions = [], isLoading: isLoadingAddressTypes } =
    useGetAllAddressTypesQuery();
  const {
    data: addressProofOptions = [],
    isLoading: isLoadingAddressProofTypes,
  } = useGetAllAddressProofTypesQuery();

  const [fetchAdditionalReferences, { isLoading: isLoadingAdditionalRefs }] =
    useLazyGetAdditionalReferenceByProductQuery();

  const {
    data: canvassedTypesOptions = [],
    isLoading: isLoadingCanvassedTypes,
  } = useGetCanvassedTypesQuery();

  const [saveLeadDetails, { isLoading: isSaving }] =
    useSaveLeadDetailsMutation();
  const [updateLeadDetails, { isLoading: isUpdating }] =
    useUpdateLeadDetailsMutation();

  const { downloadTemplate, isDownloading } = useLeadTemplateDownload();

  const isLoading = isSaving || isUpdating;
  const [isAddressExpanded, setIsAddressExpanded] = useState(false);

  const [isImportHistoryModalOpen, setIsImportHistoryModalOpen] =
    useState(false);
  const [resetTrigger, setResetTrigger] = useState(0);

  const {
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    trigger,
    register,
    formState: { errors },
    clearErrors,
  } = useForm<LeadDetailsFormData>({
    resolver: yupResolver(
      createLeadDetailsValidationSchema(additionalReferenceConfig, isEditMode)
    ),

    mode: "onBlur",
    defaultValues: leadDetailsDefaultFormValues,
  });

  const watchedCanvassedType = watch("canvassedTypeIdentity");

  const canvasserIdLabel = useMemo(() => {
    if (!watchedCanvassedType || canvassedTypesOptions.length === 0) {
      return "Canvasser ID";
    }
    const selectedOption = canvassedTypesOptions.find(
      opt => opt.value === watchedCanvassedType
    );
    if (!selectedOption) {
      return "Canvasser ID";
    }
    const labelLC = selectedOption.label.toLowerCase();

    if (labelLC.includes("customer")) return "Customer";
    if (labelLC.includes("agent")) return "Agent";
    if (labelLC.includes("staff")) return "Staff";

    return "Canvasser ID";
  }, [watchedCanvassedType, canvassedTypesOptions]);

  const canvasserIdPlaceholder = useMemo(() => {
    return `Enter ${canvasserIdLabel.toLowerCase()}`;
  }, [canvasserIdLabel]);

  const [canvasserSearchTerm, setCanvasserSearchTerm] = useState<string>("");
  const [showCanvasserResults, setShowCanvasserResults] =
    useState<boolean>(false);
  const [selectedCanvasser, setSelectedCanvasser] = useState<{
    identity: string;
    name: string;
    code?: string;
  } | null>(null);
  const [shouldSearchCanvasser, setShouldSearchCanvasser] =
    useState<boolean>(false);

  const {
    data: canvasserResults,
    isLoading: isSearchingCanvasser,
    error: canvasserSearchError,
  } = useSearchCanvasserQuery(
    {
      canvassedTypeId: watchedCanvassedType || "",
      canvasserName: canvasserSearchTerm,
    },
    {
      skip:
        !shouldSearchCanvasser ||
        !watchedCanvassedType ||
        !canvasserSearchTerm ||
        canvasserSearchTerm.length < 3,
    }
  );

  const handleCanvasserSearch = useCallback((searchTerm: string): void => {
    setCanvasserSearchTerm(searchTerm);
    setShowCanvasserResults(false);
    setShouldSearchCanvasser(false);
    if (searchTerm.length < 3) {
      setSelectedCanvasser(null);
    }
  }, []);

  const handleCanvasserSearchClick = useCallback((): void => {
    if (canvasserSearchTerm.length >= 3 && watchedCanvassedType) {
      setShouldSearchCanvasser(true);
      setShowCanvasserResults(true);
    }
  }, [canvasserSearchTerm, watchedCanvassedType]);

  const handleCanvasserSelect = useCallback(
    (option: {
      canvasserIdentity: string;
      canvasserName: string;
      canvasserCode?: string;
      [key: string]: unknown;
    }): void => {
      if (!option || !option.canvasserIdentity) {
        logger.error("Invalid canvasser data", { toast: true, pushLog: false });
        return;
      }

      const canvasserData = {
        identity: option.canvasserIdentity,
        name: option.canvasserName,
        code: option.canvasserCode,
      };

      setSelectedCanvasser(canvasserData);
      setValue("canvasserIdentity", canvasserData.identity);
      setCanvasserSearchTerm("");
      setShowCanvasserResults(false);
      trigger("canvasserIdentity");
    },
    [setValue, trigger]
  );

  const handleClearCanvasser = useCallback((): void => {
    setSelectedCanvasser(null);
    setCanvasserSearchTerm("");
    setShowCanvasserResults(false);
    setShouldSearchCanvasser(false);
    setValue("canvasserIdentity", "");
    trigger("canvasserIdentity");
  }, [setValue, trigger]);

  const getIdentityFromValue = (
    value: string,
    options: ConfigOption[]
  ): string => {
    const option = options.find(opt => opt.value === value);
    return option?.identity || option?.value || value;
  };

  useEffect(() => {
    if (!isEditMode && leadSourceOptions.length > 0) {
      const walkInOption = leadSourceOptions.find(
        option => option.label?.toLowerCase() === "walk-in"
      );

      if (walkInOption) {
        setValue("leadSource", walkInOption.value);
      }
    }
  }, [leadSourceOptions, isEditMode, setValue]);

  const watchedInterestedProducts = watch("interestedProducts");

  useEffect(() => {
    const fetchReferences = async () => {
      if (watchedInterestedProducts && tenantIdentity) {
        try {
          const result = await fetchAdditionalReferences({
            tenantIdentity: tenantIdentity,
            productServiceIdentity: watchedInterestedProducts,
          }).unwrap();

          setAdditionalReferenceConfig(result);

          if (result.length > 0) {
            const initialAdditionalReferences: Record<string, string> = {};
            result.forEach(field => {
              if (field.isActive) {
                let defaultValue = "";
                if (field.dataType.toUpperCase() === "NUMBER") {
                  defaultValue = "";
                } else if (field.dataType.toUpperCase() === "DATE") {
                  defaultValue = "";
                } else {
                  defaultValue = "";
                }
                initialAdditionalReferences[field.identity] = defaultValue;
              }
            });
            setValue("additionalReferences", initialAdditionalReferences);
          } else {
            setValue("additionalReferences", {});
          }
        } catch (error) {
          logger.error(error, {
            toast: false,
          });
          setAdditionalReferenceConfig([]);
          setValue("additionalReferences", {});
        }
      } else {
        setAdditionalReferenceConfig([]);
        setValue("additionalReferences", {});
      }
    };

    fetchReferences();
  }, [
    watchedInterestedProducts,
    tenantIdentity,
    fetchAdditionalReferences,
    setValue,
  ]);

  useEffect(() => {
    if (!isEditMode && currentUser) {
      setValue("assignTo", currentUser);
    }
  }, [currentUser, setValue, isEditMode]);

  const handleSelectLead = useCallback(
    async (lead: LeadSearchData) => {
      const getIdentityFromLabel = (
        label: string,
        options: ConfigOption[]
      ): string => {
        const option = options.find(opt => opt.label === label);
        return option?.value || option?.identity || label;
      };

      dispatch(setEditMode({ isEdit: true, leadId: lead.leadId }));

      const genderValue =
        lead.originalData?.gender ||
        getIdentityFromLabel(lead.gender, genderOptions);
      const leadSourceValue =
        lead.originalData?.leadSource ||
        getIdentityFromLabel(lead.leadSource, leadSourceOptions);
      const leadStageValue =
        lead.originalData?.leadStage ||
        getIdentityFromLabel(lead.leadStage, leadStageOptions);
      const leadStatusValue =
        lead.originalData?.leadStatus ||
        getIdentityFromLabel(lead.leadStatus, leadStatusOptions);
      const interestedProductsValue =
        lead.originalData?.interestedProducts ||
        getIdentityFromLabel(lead.interestedProducts, productsOptions);

      if (interestedProductsValue && tenantIdentity) {
        try {
          const refsResult = await fetchAdditionalReferences({
            tenantIdentity: tenantIdentity,
            productServiceIdentity: interestedProductsValue,
          }).unwrap();

          setAdditionalReferenceConfig(refsResult);
          if (lead.dynamicReferences && lead.dynamicReferences.length > 0) {
            const refs: Record<string, string> = {};
            lead.dynamicReferences.forEach(ref => {
              refs[ref.referenceConfigIdentity] =
                typeof ref.referenceFieldValue === "boolean"
                  ? String(ref.referenceFieldValue)
                  : ref.referenceFieldValue;
            });
            setPendingDynamicRefs(refs);
          } else {
            setPendingDynamicRefs({});
          }
        } catch (error) {
          logger.error(error, {
            toast: false,
          });
          setAdditionalReferenceConfig([]);
        }
      }

      clearErrors();

      setValue("leadCode", lead.leadCode, { shouldValidate: false });
      setValue("fullName", lead.fullName, { shouldValidate: false });
      setValue("gender", genderValue, { shouldValidate: false });
      setValue("contactNumber", lead.contactNumber, { shouldValidate: false });
      setValue("email", lead.email || "", { shouldValidate: false });
      setValue("leadSource", leadSourceValue, { shouldValidate: false });
      setValue("leadStage", leadStageValue, { shouldValidate: false });
      setValue("leadStatus", leadStatusValue, { shouldValidate: false });
      setValue("assignTo", lead.assignTo || currentUserIdentity, {
        shouldValidate: false,
      });
      setValue("interestedProducts", interestedProductsValue, {
        shouldValidate: false,
      });
      setValue("remarks", lead.remarks || "", { shouldValidate: false });
      setValue("canvassedTypeIdentity", lead.canvassedTypeIdentity || "", {
        shouldValidate: false,
      });

      setValue("canvasserIdentity", lead.canvasserIdentity || "", {
        shouldValidate: false,
      });
      if (lead.canvasserIdentity && lead.canvasserName) {
        setSelectedCanvasser({
          identity: lead.canvasserIdentity,
          name: lead.canvasserName,
          code: lead.canvasserCode,
        });

        //  to display the canvasser info
        const displayText = lead.canvasserCode
          ? `${lead.canvasserName} - ${lead.canvasserCode}`
          : lead.canvasserName;
        setCanvasserSearchTerm(displayText);
      }

      setValue("nextFollowUpDate", lead.nextFollowUpDate || "", {
        shouldValidate: false,
      });
      setValue("preferredTime", lead.preferredTime || "", {
        shouldValidate: false,
      });
      setValue("leadProbability", lead.leadProbability || 0, {
        shouldValidate: false,
      });
      setValue("highPriority", lead.highPriority || false, {
        shouldValidate: false,
      });

      if (lead.addresses && lead.addresses.length > 0) {
        setIsAddressExpanded(true);
        const address = lead.addresses[0];
        setValue("addressType", address.addressTypeIdentity, {
          shouldValidate: false,
        });
        setValue("houseNo", address.houseNo, { shouldValidate: false });
        setValue("streetLane", address.streetName, { shouldValidate: false });
        setValue("placeName", address.placeName, { shouldValidate: false });
        setValue("pincode", address.pincode, { shouldValidate: false });
        setValue("country", address.country, { shouldValidate: false });
        setValue("state", address.state, { shouldValidate: false });
        setValue("district", address.district, { shouldValidate: false });
        setValue("postOfficeId", address.postOfficeIdentity || "", {
          shouldValidate: false,
        });
        setValue("city", address.city, { shouldValidate: false });
        setValue("landmark", address.landmark || "", { shouldValidate: false });
        setValue("addressProofType", address.addressProofType || "", {
          shouldValidate: false,
        });
        setValue(
          "latitude",
          address.latitude ? address.latitude.toString() : "",
          { shouldValidate: false }
        );
        setValue(
          "longitude",
          address.longitude ? address.longitude.toString() : "",
          { shouldValidate: false }
        );
      } else {
        setIsAddressExpanded(false);
      }
    },
    [
      setValue,
      dispatch,
      currentUserIdentity,
      genderOptions,
      leadSourceOptions,
      leadStageOptions,
      leadStatusOptions,
      productsOptions,
      fetchAdditionalReferences,
      tenantIdentity,
      clearErrors,
      setSelectedCanvasser,
      setCanvasserSearchTerm,
    ]
  );

  useEffect(() => {
    if (additionalReferenceConfig.length > 0 && pendingDynamicRefs) {
      const timer = setTimeout(() => {
        const validRefs: Record<string, string> = {};
        additionalReferenceConfig.forEach(field => {
          if (pendingDynamicRefs[field.identity] !== undefined) {
            validRefs[field.identity] = pendingDynamicRefs[field.identity];
          }
        });

        setValue("additionalReferences", validRefs, {
          shouldValidate: false,
          shouldDirty: false,
        });

        additionalReferenceConfig.forEach(field => {
          if (pendingDynamicRefs[field.identity] !== undefined) {
            const fieldPath = `additionalReferences.${field.identity}` as const;
            setValue(fieldPath, pendingDynamicRefs[field.identity], {
              shouldValidate: false,
              shouldDirty: false,
            });
          }
        });

        setPendingDynamicRefs(null);
      }, 200);

      return () => clearTimeout(timer);
    }
  }, [additionalReferenceConfig, pendingDynamicRefs, setValue]);

  useEffect(() => {
    if (isViewMode && initialLeadData) {
      handleSelectLead(initialLeadData);
    }
  }, [isViewMode, initialLeadData]);

  const onSubmit = useCallback(
    async (data: LeadDetailsFormData) => {
      try {
        const dynamicReferences = Object.entries(
          data.additionalReferences || {}
        ).map(([referenceConfigIdentity, referenceFieldValue]) => ({
          referenceConfigIdentity,
          referenceFieldValue: String(referenceFieldValue),
        }));

        const hasAddressData =
          data.addressType ||
          data.houseNo ||
          data.streetLane ||
          data.placeName ||
          data.pincode;

        const addressArray = hasAddressData
          ? [
              {
                addressTypeIdentity: getIdentityFromValue(
                  data.addressType,
                  addressTypeOptions
                ),
                houseNo: data.houseNo || "",
                streetName: data.streetLane || "",
                placeName: data.placeName || "",
                landmark: data.landmark || undefined,
                pincode: data.pincode || "",
                country: data.country || "",
                state: data.state || "",
                district: data.district || "",
                postOfficeIdentity: data.postOfficeId || "",
                city: data.city || "",
                latitude: data.latitude ? parseFloat(data.latitude) : 0,
                longitude: data.longitude ? parseFloat(data.longitude) : 0,
                addressProofTypeIdentity: getIdentityFromValue(
                  data.addressProofType,
                  addressProofOptions
                ),
                digipin: data.digipin || undefined,
              },
            ]
          : [];

        const basePayload = {
          tenantId: tenantId,
          fullName: data.fullName,
          gender: getIdentityFromValue(data.gender, genderOptions),
          contactNumber: data.contactNumber,
          email: data.email || undefined,
          leadSourceIdentity: getIdentityFromValue(
            data.leadSource,
            leadSourceOptions
          ),

          ...(isEditMode && {
            leadStageIdentity: getIdentityFromValue(
              data.leadStage,
              leadStageOptions
            ),
            leadStatusIdentity: getIdentityFromValue(
              data.leadStatus,
              leadStatusOptions
            ),
          }),

          assignTo: isEditMode
            ? getIdentityFromValue(data.assignTo, usersOptions)
            : currentUserIdentity,
          interestedProductIdentity: getIdentityFromValue(
            data.interestedProducts,
            productsOptions
          ),
          remarks: data.remarks,
          canvassedTypeIdentity: (data.canvassedTypeIdentity || null) as
            | string
            | null,
          canvasserIdentity: (data.canvasserIdentity || null) as string | null,
          nextFollowUpDate: data.nextFollowUpDate || undefined,
          preferredTime: data.preferredTime || undefined,
          leadProbability: data.leadProbability || undefined,
          highPriority: data.highPriority || false,
          address: addressArray,
          dynamicReferences: dynamicReferences,
        };

        if (isEditMode && currentLeadId) {
          await updateLeadDetails({
            leadId: currentLeadId,
            payload: basePayload as UpdateLeadDetailsPayload,
          }).unwrap();

          logger.info("Lead updated successfully", { toast: true });
          dispatch(resetLeadState());
          setSelectedCanvasser(null);
          setCanvasserSearchTerm("");
          setShowCanvasserResults(false);
          setShouldSearchCanvasser(false);
        } else {
          const response = await saveLeadDetails(
            basePayload as SaveLeadDetailsPayload
          ).unwrap();

          if (response && response.data) {
            setSuccessData(response.data);
            setShowSuccessModal(true);
          } else {
            setSuccessData(response as unknown as LeadCreationSuccessResponse);
            setShowSuccessModal(true);
          }
        }

        dispatch(setIsReady(true));
        reset(leadDetailsDefaultFormValues);

        setResetTrigger(prev => prev + 1);
        setIsAddressExpanded(false);

        setSelectedCanvasser(null);
        setCanvasserSearchTerm("");
        setShowCanvasserResults(false);
        setShouldSearchCanvasser(false);
      } catch (error) {
        if (typeof error === "object" && error !== null) {
          const apiError = error as {
            status?: number;
            data?: {
              message?: string;
              error?: string;
              errorCode?: string;
              timestamp?: string;
            };
          };

          const errorMessage =
            apiError.data?.message ||
            apiError.data?.error ||
            `Failed to ${isEditMode ? "update" : "save"} lead details`;

          logger.error(errorMessage, { toast: true });

          if (apiError.data?.errorCode) {
            // console.error("Error Code:", apiError.data.errorCode);
          }
          if (apiError.data?.timestamp) {
            // console.error("Error Timestamp:", apiError.data.timestamp);
          }
        } else {
          logger.error("An unexpected error occurred", { toast: true });
        }
      }
    },
    [
      saveLeadDetails,
      updateLeadDetails,
      dispatch,
      reset,
      tenantId,
      currentUserIdentity,
      currentLeadId,
      isEditMode,
      genderOptions,
      leadSourceOptions,
      leadStageOptions,
      leadStatusOptions,
      usersOptions,
      productsOptions,
      addressTypeOptions,
      addressProofOptions,
    ]
  );
  const handleReset = useCallback(() => {
    if (isEditMode) {
      dispatch(resetLeadState());
    }
    reset(leadDetailsDefaultFormValues);
    setAdditionalReferenceConfig([]);
    setResetTrigger(prev => prev + 1);
    setIsAddressExpanded(false);
    setSelectedCanvasser(null);
    setCanvasserSearchTerm("");
    setShowCanvasserResults(false);
    setShouldSearchCanvasser(false);
  }, [reset, isEditMode, dispatch]);

  const handleDownloadTemplate = useCallback(async () => {
    await downloadTemplate();
  }, [downloadTemplate]);

  return (
    <article className="lead-details-form-container">
      <FormContainer>
        {!isViewMode && (
          <Flex justify="between" align="center" className="mb-6 w-full">
            <HeaderWrapper>
              <TitleHeader
                title={isEditMode ? "Edit Lead Details" : "Lead Details"}
              />
            </HeaderWrapper>

            <Flex gap={2}>
              <CapsuleButton
                onClick={() => {
                  clearErrors();
                  setIsSearchModalOpen(true);
                }}
                disabled={isLoading}
                label="Search"
                icon={Search}
              />
            </Flex>
          </Flex>
        )}

        {!isViewMode && !isEditMode && (
          <Flex gap={2}>
            <Button
              type="button"
              variant="resetCompact"
              size="compactWhite"
              onClick={handleDownloadTemplate}
              disabled={isDownloading}
            >
              {isDownloading ? (
                <Download className="mr-2 h-3 w-3 animate-pulse" />
              ) : (
                <FileText className="mr-2 h-3 w-3" />
              )}
              {isDownloading ? "Downloading..." : "Download Format"}
            </Button>

            <Button
              type="button"
              variant="resetPrimary"
              size="compactWhite"
              onClick={() => setIsImportModalOpen(true)}
            >
              <Upload className="mr-2 h-3 w-3" />
              Import Leads
            </Button>
            <Button
              type="button"
              variant="defaultViolet"
              size="compactWhite"
              onClick={() => setIsImportHistoryModalOpen(true)}
              disabled={isLoading}
            >
              <Eye className="mr-2 h-3 w-3" />
              Import History
            </Button>
          </Flex>
        )}

        <Form onSubmit={handleSubmit(onSubmit)}>
          {/* Lead Details Section */}
          <div className="mb-8">
            {!isEditMode ? (
              <>
                <Form.Row>
                  <Form.Col lg={3} md={6} span={12}>
                    <Form.Field
                      label="Full Name"
                      required
                      error={errors.fullName}
                    >
                      <Input
                        {...register("fullName")}
                        onChange={e => {
                          e.target.value = e.target.value.toUpperCase();
                        }}
                        placeholder="Enter Full Name"
                        size="form"
                        variant="form"
                        disabled={isLoading || readonly}
                        textTransform="uppercase"
                        inputType="letters"
                        restriction="alphabetic"
                      />
                    </Form.Field>
                  </Form.Col>

                  <Form.Col lg={3} md={6} span={12}>
                    <Form.Field label="Gender" required error={errors.gender}>
                      <Controller
                        name="gender"
                        control={control}
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                            disabled={isLoading || readonly || isLoadingGender}
                            placeholder="Select Gender"
                            size="form"
                            variant="form"
                            fullWidth={true}
                            itemVariant="form"
                            options={genderOptions}
                            loading={isLoadingGender}
                          />
                        )}
                      />
                    </Form.Field>
                  </Form.Col>

                  <Form.Col lg={3} md={6} span={12}>
                    <Form.Field
                      label="Contact Number"
                      required
                      error={errors.contactNumber}
                    >
                      <Input
                        {...register("contactNumber")}
                        placeholder="Enter Contact Number"
                        size="form"
                        variant="form"
                        disabled={isLoading || readonly}
                        restriction="numeric"
                        maxLength={10}
                      />
                    </Form.Field>
                  </Form.Col>

                  <Form.Col lg={3} md={6} span={12}>
                    <Form.Field label="Email" error={errors.email}>
                      <Input
                        {...register("email")}
                        type="email"
                        placeholder="Enter Email Id"
                        size="form"
                        variant="form"
                        disabled={isLoading || readonly}
                      />
                    </Form.Field>
                  </Form.Col>
                </Form.Row>

                <Form.Row className="mt-4">
                  <Form.Col lg={3} md={6} span={12}>
                    <Form.Field
                      label="Lead Source"
                      required
                      error={errors.leadSource}
                    >
                      <Controller
                        name="leadSource"
                        control={control}
                        render={({ field }) => {
                          return (
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                              disabled={
                                isLoading || readonly || isLoadingLeadSource
                              }
                              placeholder="Select Lead Source"
                              size="form"
                              variant="form"
                              fullWidth={true}
                              itemVariant="form"
                              options={leadSourceOptions}
                              loading={isLoadingLeadSource}
                            />
                          );
                        }}
                      />
                    </Form.Field>
                  </Form.Col>

                  <Form.Col lg={3} md={6} span={12}>
                    <Form.Field
                      label="Interested Product/Services"
                      required
                      error={errors.interestedProducts}
                    >
                      <Controller
                        name="interestedProducts"
                        control={control}
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                            disabled={
                              isLoading || readonly || isLoadingProducts
                            }
                            placeholder="Select Product/Services"
                            size="form"
                            variant="form"
                            fullWidth={true}
                            itemVariant="form"
                            options={productsOptions}
                            loading={isLoadingProducts}
                          />
                        )}
                      />
                    </Form.Field>
                  </Form.Col>

                  <Form.Col lg={3} md={6} span={12}>
                    <Form.Field
                      label="Canvassed Type"
                      error={errors.canvassedTypeIdentity}
                    >
                      <Controller
                        name="canvassedTypeIdentity"
                        control={control}
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                            disabled={
                              isLoading || readonly || isLoadingCanvassedTypes
                            }
                            placeholder="Select"
                            size="form"
                            variant="form"
                            fullWidth={true}
                            itemVariant="form"
                            options={canvassedTypesOptions}
                            onBlur={() => field.onBlur()}
                          />
                        )}
                      />
                    </Form.Field>
                  </Form.Col>

                  <Form.Col lg={3} md={6} span={12}>
                    <Form.Field
                      label={canvasserIdLabel}
                      error={errors.canvasserIdentity}
                    >
                      <Controller
                        name="canvasserIdentity"
                        control={control}
                        render={({ field }) => (
                          <InputWithSearch
                            {...field}
                            placeholder={canvasserIdPlaceholder}
                            size="form"
                            variant="form"
                            disabled={isLoading || readonly}
                            className="uppercase"
                            inputType="alphanumeric"
                            restriction="alphanumeric"
                            value={
                              selectedCanvasser
                                ? selectedCanvasser.code
                                  ? `${selectedCanvasser.name} - ${selectedCanvasser.code}`
                                  : selectedCanvasser.name
                                : canvasserSearchTerm || ""
                            }
                            onChange={e => {
                              const value = e.target.value;
                              const expectedValue = selectedCanvasser
                                ? selectedCanvasser.code
                                  ? `${selectedCanvasser.name} - ${selectedCanvasser.code}`
                                  : selectedCanvasser.name
                                : "";

                              if (
                                selectedCanvasser &&
                                value !== expectedValue
                              ) {
                                setSelectedCanvasser(null);
                                setValue("canvasserIdentity", "");
                                trigger("canvasserIdentity");
                              }
                              handleCanvasserSearch(value);
                              setValue("canvasserIdentity", value);
                              trigger("canvasserIdentity");
                            }}
                            onDoubleClick={() => {
                              if (selectedCanvasser && !readonly) {
                                handleClearCanvasser();
                              }
                            }}
                            onKeyDown={e => {
                              if (
                                e.key === "Escape" &&
                                selectedCanvasser &&
                                !readonly
                              ) {
                                handleClearCanvasser();
                              }
                            }}
                            onBlur={() => {
                              trigger("canvasserIdentity");
                            }}
                            onSearch={handleCanvasserSearchClick}
                            isSearching={isSearchingCanvasser || false}
                            showDropdown={
                              showCanvasserResults &&
                              canvasserSearchTerm.length >= 3
                            }
                            dropdownOptions={(() => {
                              if (!canvasserResults) return [];
                              const results = Array.isArray(canvasserResults)
                                ? canvasserResults
                                : [];
                              return results.map(canvasser => ({
                                value: canvasser.canvasserIdentity,
                                label: `${canvasser.canvasserName} - ${canvasser.canvasserCode}`,
                                canvasserIdentity: canvasser.canvasserIdentity,
                                canvasserName: canvasser.canvasserName,
                                canvasserCode: canvasser.canvasserCode,
                              }));
                            })()}
                            onOptionSelect={
                              handleCanvasserSelect as (option: unknown) => void
                            }
                            dropdownLoading={isSearchingCanvasser}
                            dropdownError={
                              canvasserSearchError
                                ? "Error searching for canvassers. Please try again."
                                : undefined
                            }
                            noResultsText="No canvassers found for this search term."
                          />
                        )}
                      />
                    </Form.Field>
                  </Form.Col>
                </Form.Row>
                <Form.Row className="mt-4">
                  <Form.Col lg={3} md={6} span={12}>
                    <Form.Field
                      label="Follow-up Notes"
                      required
                      error={errors.remarks}
                    >
                      <Textarea
                        {...register("remarks")}
                        placeholder="Enter Follow-up Notes"
                        size="form"
                        variant="form"
                        rows={3}
                        disabled={isLoading || readonly}
                      />
                    </Form.Field>
                  </Form.Col>
                  <Form.Col lg={2} md={6} span={12}>
                    <Form.Field
                      label="Next Follow-Up Date"
                      error={errors.nextFollowUpDate}
                      required
                    >
                      <Controller
                        name="nextFollowUpDate"
                        control={control}
                        render={({ field }) => (
                          <DatePicker
                            value={field.value}
                            onChange={(value: string) => {
                              field.onChange(value);
                              trigger?.("nextFollowUpDate");
                            }}
                            onBlur={() => field.onBlur()}
                            placeholder="dd/mm/yyyy"
                            allowManualEntry={true}
                            size="form"
                            variant="form"
                            disabled={isLoading || readonly}
                            min={new Date().toISOString().split("T")[0]}
                            disableFutureDates={false}
                          />
                        )}
                      />
                    </Form.Field>
                  </Form.Col>

                  <Form.Col lg={2} md={6} span={12}>
                    <Form.Field
                      label="Preferred Time"
                      error={errors.preferredTime}
                      required
                    >
                      <Controller
                        name="preferredTime"
                        control={control}
                        render={({ field }) => (
                          <Input
                            type="time"
                            size="form"
                            variant="form"
                            value={field.value || ""}
                            onChange={field.onChange}
                            disabled={isLoading || readonly}
                          />
                        )}
                      />
                    </Form.Field>
                  </Form.Col>

                  <Form.Col lg={3} md={6} span={12}>
                    <Form.Field
                      label="Lead Probability"
                      error={errors.leadProbability}
                      required
                    >
                      <Controller
                        name="leadProbability"
                        control={control}
                        render={({ field }) => (
                          <div className="inline-flex w-full overflow-hidden rounded-md border border-gray-200">
                            {[25, 50, 75, 100].map((value, index) => (
                              <button
                                key={value}
                                type="button"
                                onClick={() => field.onChange(value)}
                                disabled={isLoading || readonly}
                                className={`flex-1 px-3 py-1.5 text-xs font-medium transition-colors ${
                                  field.value === value
                                    ? "bg-theme-primary text-white"
                                    : "bg-blue-100 text-gray-700 hover:bg-gray-50"
                                } ${
                                  index !== 0 ? "border-l border-gray-200" : ""
                                }`}
                              >
                                {value}%
                              </button>
                            ))}
                          </div>
                        )}
                      />
                    </Form.Field>
                  </Form.Col>

                  <Form.Col lg={2} md={6} span={12}>
                    <Flex align="center" gap={2} className="mt-5 h-full">
                      <Controller
                        name="highPriority"
                        control={control}
                        render={({ field }) => (
                          <Switch
                            id="highPriority"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={isLoading || readonly}
                          />
                        )}
                      />
                      <Label
                        htmlFor="highPriority"
                        className="text-xs font-medium"
                      >
                        High Priority
                      </Label>
                    </Flex>
                  </Form.Col>
                </Form.Row>
              </>
            ) : (
              <>
                <Form.Row>
                  <Form.Col lg={3} md={6} span={12}>
                    <Form.Field label="Lead Code">
                      <Input
                        {...register("leadCode")}
                        placeholder="Lead Code"
                        size="form"
                        variant="form"
                        disabled={true}
                      />
                    </Form.Field>
                  </Form.Col>

                  <Form.Col lg={3} md={6} span={12}>
                    <Form.Field
                      label="Full Name"
                      required
                      error={errors.fullName}
                    >
                      <Input
                        {...register("fullName")}
                        onChange={e => {
                          e.target.value = e.target.value.toUpperCase();
                        }}
                        placeholder="Enter Full Name"
                        size="form"
                        variant="form"
                        disabled={isLoading || readonly}
                        textTransform="uppercase"
                        inputType="letters"
                        restriction="alphabetic"
                      />
                    </Form.Field>
                  </Form.Col>

                  <Form.Col lg={3} md={6} span={12}>
                    <Form.Field label="Gender" required error={errors.gender}>
                      <Controller
                        name="gender"
                        control={control}
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                            disabled={isLoading || readonly || isLoadingGender}
                            placeholder="Select Gender"
                            size="form"
                            variant="form"
                            fullWidth={true}
                            itemVariant="form"
                            options={genderOptions}
                            loading={isLoadingGender}
                          />
                        )}
                      />
                    </Form.Field>
                  </Form.Col>

                  <Form.Col lg={3} md={6} span={12}>
                    <Form.Field
                      label="Contact Number"
                      required
                      error={errors.contactNumber}
                    >
                      <Controller
                        name="contactNumber"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            placeholder="Enter Contact Number"
                            size="form"
                            variant="form"
                            disabled={isLoading || readonly}
                            restriction="numeric"
                            maxLength={10}
                          />
                        )}
                      />
                    </Form.Field>
                  </Form.Col>
                </Form.Row>

                <Form.Row className="mt-4">
                  <Form.Col lg={3} md={6} span={12}>
                    <Form.Field label="Email" error={errors.email}>
                      <Input
                        {...register("email")}
                        type="email"
                        placeholder="Enter Email Id"
                        size="form"
                        variant="form"
                        disabled={isLoading || readonly}
                      />
                    </Form.Field>
                  </Form.Col>

                  <Form.Col lg={3} md={6} span={12}>
                    <Form.Field
                      label="Lead Source"
                      required
                      error={errors.leadSource}
                    >
                      <Controller
                        name="leadSource"
                        control={control}
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                            disabled={
                              isLoading || readonly || isLoadingLeadSource
                            }
                            placeholder="Select Lead Source"
                            size="form"
                            variant="form"
                            fullWidth={true}
                            itemVariant="form"
                            options={leadSourceOptions}
                            loading={isLoadingLeadSource}
                          />
                        )}
                      />
                    </Form.Field>
                  </Form.Col>

                  <Form.Col lg={3} md={6} span={12}>
                    <Form.Field
                      label="Lead Stage"
                      required
                      error={errors.leadStage}
                    >
                      <Controller
                        name="leadStage"
                        control={control}
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                            disabled={
                              isLoading || readonly || isLoadingLeadStage
                            }
                            placeholder="Select Lead Stage"
                            size="form"
                            variant="form"
                            fullWidth={true}
                            itemVariant="form"
                            options={leadStageOptions}
                            loading={isLoadingLeadStage}
                          />
                        )}
                      />
                    </Form.Field>
                  </Form.Col>

                  <Form.Col lg={3} md={6} span={12}>
                    <Form.Field
                      label="Lead Status"
                      required
                      error={errors.leadStatus}
                    >
                      <Controller
                        name="leadStatus"
                        control={control}
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                            disabled={
                              isLoading || readonly || isLoadingLeadStatus
                            }
                            placeholder="Select Lead Status"
                            size="form"
                            variant="form"
                            fullWidth={true}
                            itemVariant="form"
                            options={leadStatusOptions}
                            loading={isLoadingLeadStatus}
                          />
                        )}
                      />
                    </Form.Field>
                  </Form.Col>
                </Form.Row>

                <Form.Row className="mt-4">
                  <Form.Col lg={2} md={6} span={12}>
                    <Form.Field
                      label="Assign To"
                      required
                      error={errors.assignTo}
                    >
                      <Controller
                        name="assignTo"
                        control={control}
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                            disabled={isLoading || readonly || isLoadingUsers}
                            placeholder="Select User"
                            size="form"
                            variant="form"
                            fullWidth={true}
                            itemVariant="form"
                            options={usersOptions}
                            loading={isLoadingUsers}
                          />
                        )}
                      />
                    </Form.Field>
                  </Form.Col>

                  <Form.Col lg={3} md={6} span={12}>
                    <Form.Field
                      label="Canvassed Type"
                      error={errors.canvassedTypeIdentity}
                    >
                      <Controller
                        name="canvassedTypeIdentity"
                        control={control}
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                            disabled={
                              isLoading || readonly || isLoadingCanvassedTypes
                            }
                            placeholder="Select"
                            size="form"
                            variant="form"
                            fullWidth={true}
                            itemVariant="form"
                            options={canvassedTypesOptions}
                            onBlur={() => field.onBlur()}
                          />
                        )}
                      />
                    </Form.Field>
                  </Form.Col>

                  <Form.Col lg={3} md={6} span={12}>
                    <Form.Field
                      label={canvasserIdLabel}
                      error={errors.canvasserIdentity}
                    >
                      <Controller
                        name="canvasserIdentity"
                        control={control}
                        render={({ field }) => (
                          <InputWithSearch
                            {...field}
                            placeholder={canvasserIdPlaceholder}
                            size="form"
                            variant="form"
                            disabled={isLoading || readonly}
                            className="uppercase"
                            inputType="alphanumeric"
                            restriction="alphanumeric"
                            value={
                              selectedCanvasser
                                ? selectedCanvasser.code
                                  ? `${selectedCanvasser.name} - ${selectedCanvasser.code}`
                                  : selectedCanvasser.name
                                : canvasserSearchTerm || ""
                            }
                            onChange={e => {
                              const value = e.target.value;
                              const expectedValue = selectedCanvasser
                                ? selectedCanvasser.code
                                  ? `${selectedCanvasser.name} - ${selectedCanvasser.code}`
                                  : selectedCanvasser.name
                                : "";

                              if (
                                selectedCanvasser &&
                                value !== expectedValue
                              ) {
                                setSelectedCanvasser(null);
                                setValue("canvasserIdentity", "");
                                trigger("canvasserIdentity");
                              }
                              handleCanvasserSearch(value);
                              setValue("canvasserIdentity", value);
                              trigger("canvasserIdentity");
                            }}
                            onDoubleClick={() => {
                              if (selectedCanvasser && !readonly) {
                                handleClearCanvasser();
                              }
                            }}
                            onKeyDown={e => {
                              if (
                                e.key === "Escape" &&
                                selectedCanvasser &&
                                !readonly
                              ) {
                                handleClearCanvasser();
                              }
                            }}
                            onBlur={() => {
                              trigger("canvasserIdentity");
                            }}
                            onSearch={handleCanvasserSearchClick}
                            isSearching={isSearchingCanvasser || false}
                            showDropdown={
                              showCanvasserResults &&
                              canvasserSearchTerm.length >= 3
                            }
                            dropdownOptions={(() => {
                              if (!canvasserResults) return [];
                              const results = Array.isArray(canvasserResults)
                                ? canvasserResults
                                : [];
                              return results.map(canvasser => ({
                                value: canvasser.canvasserIdentity,
                                label: `${canvasser.canvasserName} - ${canvasser.canvasserCode}`,
                                canvasserIdentity: canvasser.canvasserIdentity,
                                canvasserName: canvasser.canvasserName,
                                canvasserCode: canvasser.canvasserCode,
                              }));
                            })()}
                            onOptionSelect={
                              handleCanvasserSelect as (option: unknown) => void
                            }
                            dropdownLoading={isSearchingCanvasser}
                            dropdownError={
                              canvasserSearchError
                                ? "Error searching for canvassers. Please try again."
                                : undefined
                            }
                            noResultsText="No canvassers found for this search term."
                          />
                        )}
                      />
                    </Form.Field>
                  </Form.Col>

                  <Form.Col lg={4} md={6} span={12}>
                    <Form.Field
                      label="Interested Product/Services"
                      required
                      error={errors.interestedProducts}
                    >
                      <Controller
                        name="interestedProducts"
                        control={control}
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                            disabled={
                              isLoading || readonly || isLoadingProducts
                            }
                            placeholder="Select Product/Services"
                            size="form"
                            variant="form"
                            fullWidth={true}
                            itemVariant="form"
                            options={productsOptions}
                            loading={isLoadingProducts}
                          />
                        )}
                      />
                    </Form.Field>
                  </Form.Col>
                </Form.Row>

                <Form.Row className="mt-4">
                  <Form.Col lg={3} md={6} span={12}>
                    <Form.Field
                      label="Follow-up Notes"
                      required
                      error={errors.remarks}
                    >
                      <Textarea
                        {...register("remarks")}
                        placeholder="Enter Follow-up Notes"
                        size="form"
                        variant="form"
                        rows={3}
                        disabled={isLoading || readonly}
                      />
                    </Form.Field>
                  </Form.Col>
                  <Form.Col lg={2} md={6} span={12}>
                    <Form.Field
                      label="Next Follow-Up Date"
                      error={errors.nextFollowUpDate}
                    >
                      <Controller
                        name="nextFollowUpDate"
                        control={control}
                        render={({ field }) => (
                          <DatePicker
                            value={field.value || undefined}
                            onChange={(value: string) => {
                              field.onChange(value);
                              trigger?.("nextFollowUpDate");
                            }}
                            onBlur={() => field.onBlur()}
                            placeholder="dd/mm/yyyy"
                            allowManualEntry={true}
                            size="form"
                            variant="form"
                            min={new Date().toISOString().split("T")[0]}
                            disabled={isLoading || readonly}
                            disableFutureDates={false}
                          />
                        )}
                      />
                    </Form.Field>
                  </Form.Col>
                  <Form.Col lg={2} md={6} span={12}>
                    <Form.Field
                      label="Preferred Time"
                      error={errors.preferredTime}
                    >
                      <Controller
                        name="preferredTime"
                        control={control}
                        render={({ field }) => (
                          <Input
                            type="time"
                            size="form"
                            variant="form"
                            value={field.value || ""}
                            onChange={field.onChange}
                            disabled={isLoading || readonly}
                          />
                        )}
                      />
                    </Form.Field>
                  </Form.Col>

                  <Form.Col lg={3} md={6} span={12}>
                    <Form.Field
                      label="Lead Probability"
                      error={errors.leadProbability}
                    >
                      <Controller
                        name="leadProbability"
                        control={control}
                        render={({ field }) => (
                          <div className="inline-flex w-full overflow-hidden rounded-md border border-gray-200">
                            {[25, 50, 75, 100].map((value, index) => (
                              <button
                                key={value}
                                type="button"
                                onClick={() => field.onChange(value)}
                                disabled={isLoading || readonly}
                                className={`flex-1 px-3 py-1.5 text-xs font-medium transition-colors ${
                                  field.value === value
                                    ? "bg-theme-primary text-white"
                                    : "bg-blue-100 text-gray-700 hover:bg-gray-50"
                                } ${
                                  index !== 0 ? "border-l border-gray-200" : ""
                                }`}
                              >
                                {value}%
                              </button>
                            ))}
                          </div>
                        )}
                      />
                    </Form.Field>
                  </Form.Col>
                  <Form.Col lg={2} md={6} span={12}>
                    <Flex align="center" gap={2} className="mt-5 h-full">
                      <Controller
                        name="highPriority"
                        control={control}
                        render={({ field }) => (
                          <Switch
                            id="highPriority"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={isLoading || readonly}
                          />
                        )}
                      />
                      <Label
                        htmlFor="highPriority"
                        className="text-xs font-medium"
                      >
                        High Priority
                      </Label>
                    </Flex>
                  </Form.Col>
                </Form.Row>
              </>
            )}
          </div>

          {/* Address Details Section */}
          <AddressDetailsSection
            control={control}
            errors={errors}
            register={register}
            isLoading={isLoading}
            readonly={readonly}
            addressTypeOptions={addressTypeOptions}
            addressProofOptions={addressProofOptions}
            isLoadingAddressTypes={isLoadingAddressTypes}
            isLoadingAddressProofTypes={isLoadingAddressProofTypes}
            setValue={setValue}
            watch={watch}
            trigger={trigger}
            isExpanded={isAddressExpanded}
            setIsExpanded={setIsAddressExpanded}
            resetTrigger={resetTrigger}
          />

          {/* Additional Reference Section */}
          {watchedInterestedProducts &&
            additionalReferenceConfig.length > 0 && (
              <AdditionalReferenceSection
                control={control}
                errors={errors}
                register={register}
                additionalReferenceConfig={additionalReferenceConfig}
                isLoading={isLoading}
                readonly={readonly}
                isLoadingConfig={isLoadingAdditionalRefs}
              />
            )}
          {!isViewMode && (
            <div className="mt-6">
              <Flex.ActionGroup>
                <Button
                  type="button"
                  variant="resetCompact"
                  size="compactWhite"
                  onClick={handleReset}
                  disabled={isLoading || readonly}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  {isEditMode ? "Cancel" : "Reset"}
                </Button>
                <Button
                  type="submit"
                  variant="resetPrimary"
                  size="compactWhite"
                  disabled={isLoading || readonly || isLoadingAdditionalRefs}
                >
                  <Save className="mr-2 h-4 w-4" />
                  {isLoading
                    ? "Processing..."
                    : isEditMode
                      ? "Update Lead Details"
                      : "Save Lead Details"}
                </Button>
              </Flex.ActionGroup>
            </div>
          )}
        </Form>
      </FormContainer>

      {/* Lead Search Modal */}
      <LeadSearch
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onSelectLead={handleSelectLead}
      />
      {/* Lead Success Modal */}
      <LeadSuccessModal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          setSuccessData(null);
        }}
        leadData={successData}
        genderOptions={genderOptions}
        productsOptions={productsOptions}
      />

      <ImportHistoryModal
        isOpen={isImportHistoryModalOpen}
        onClose={() => setIsImportHistoryModalOpen(false)}
      />

      <LeadImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
      />
    </article>
  );
};
