import { useCallback, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAppDispatch, useAppSelector } from "@/hooks/store";
import {
  setIsReady,
  resetApproverRoleMappingState,
} from "@/global/reducers/approval-workflow/approver-role-mapping.reducer";
import {
  useSaveApproverRoleMappingMutation,
  useUpdateApproverRoleMappingMutation,
  useLazyGetApproverRoleMappingByIdQuery,
  useLazySearchRoleCodesQuery,
  useLazySearchUserCodesQuery,
  useLazySearchBranchCodesQuery,
  useLazySearchRegionCodesQuery,
  useLazySearchClusterCodesQuery,
  useLazySearchStateCodesQuery,
} from "@/global/service/end-points/approval-workflow/approver-role-mapping";
import { logger } from "@/global/service";
import type {
  ApproverRoleMappingFormData,
  SaveApproverRoleMappingPayload,
  UpdateApproverRoleMappingPayload,
  BranchOption,
  RoleOption,
  UserOption,
  RegionOption,
  ClusterOption,
  StateOption,
} from "@/types/approval-workflow/approver-role-mapping.types";
import { approverRoleMappingDefaultFormValues } from "../constants/form.constants";
import { approverRoleMappingValidationSchema } from "@/global/validation/approval-workflow/approverRoleMapping-schema";

interface SearchState<T> {
  selected: T | null;
  searchTerm: string;
  results: T[];
  showResults: boolean;
}

export const useApproverRoleMappingForm = (readonly = false) => {
  const dispatch = useAppDispatch();
  const { isEditMode, currentMappingId } = useAppSelector(
    state => state.approverRoleMapping
  );

  const [isFormOpen, setIsFormOpen] = useState(false);

  // Search states
  const [roleCodeState, setRoleCodeState] = useState<SearchState<RoleOption>>({
    selected: null,
    searchTerm: "",
    results: [],
    showResults: false,
  });

  const [userCodeState, setUserCodeState] = useState<SearchState<UserOption>>({
    selected: null,
    searchTerm: "",
    results: [],
    showResults: false,
  });

  const [branchCodeState, setBranchCodeState] = useState<
    SearchState<BranchOption>
  >({
    selected: null,
    searchTerm: "",
    results: [],
    showResults: false,
  });

  const [regionCodeState, setRegionCodeState] = useState<
    SearchState<RegionOption>
  >({
    selected: null,
    searchTerm: "",
    results: [],
    showResults: false,
  });

  const [clusterCodeState, setClusterCodeState] = useState<
    SearchState<ClusterOption>
  >({
    selected: null,
    searchTerm: "",
    results: [],
    showResults: false,
  });

  const [stateCodeState, setStateCodeState] = useState<
    SearchState<StateOption>
  >({
    selected: null,
    searchTerm: "",
    results: [],
    showResults: false,
  });

  // API mutations and queries
  const [saveMapping, { isLoading: isSaving }] =
    useSaveApproverRoleMappingMutation();
  const [updateMapping, { isLoading: isUpdating }] =
    useUpdateApproverRoleMappingMutation();
  const [triggerGetById, { isLoading: isLoadingById }] =
    useLazyGetApproverRoleMappingByIdQuery();

  const [triggerRoleCodeSearch, { isLoading: isSearchingRoleCode }] =
    useLazySearchRoleCodesQuery();
  const [triggerUserCodeSearch, { isLoading: isSearchingUserCode }] =
    useLazySearchUserCodesQuery();
  const [triggerBranchCodeSearch, { isLoading: isSearchingBranchCode }] =
    useLazySearchBranchCodesQuery();
  const [triggerRegionCodeSearch, { isLoading: isSearchingRegionCode }] =
    useLazySearchRegionCodesQuery();
  const [triggerClusterCodeSearch, { isLoading: isSearchingClusterCode }] =
    useLazySearchClusterCodesQuery();
  const [triggerStateCodeSearch, { isLoading: isSearchingStateCode }] =
    useLazySearchStateCodesQuery();

  const isLoading = isSaving || isUpdating || isLoadingById;

  const form = useForm<ApproverRoleMappingFormData>({
    resolver: yupResolver(approverRoleMappingValidationSchema),
    mode: "onBlur",
    defaultValues: approverRoleMappingDefaultFormValues,
  });

  const { setValue, trigger, reset } = form;

  // Load data for edit mode
  useEffect(() => {
    if (isEditMode && currentMappingId) {
      setIsFormOpen(true);

      triggerGetById(currentMappingId)
        .unwrap()
        .then(mappingData => {
          // Role Code
          if (mappingData.roleIdentity && mappingData.roleCode) {
            setRoleCodeState(prev => ({
              ...prev,
              selected: {
                identity: mappingData.roleIdentity,
                roleCode: mappingData.roleCode,
                roleName: mappingData.roleCode,
              },
            }));
            setValue("roleCode", mappingData.roleIdentity);
          }

          // User Code
          if (mappingData.userIdentity && mappingData.userCode) {
            setUserCodeState(prev => ({
              ...prev,
              selected: {
                identity: mappingData.userIdentity,
                userCode: mappingData.userCode,
                userName: mappingData.userCode,
              },
            }));
            setValue("userCode", mappingData.userIdentity);
          }

          // Branch Code
          if (mappingData.branchIdentity && mappingData.branchCode) {
            const branchIdentity = mappingData.branchIdentity;
            const branchCode = mappingData.branchCode;
            setBranchCodeState(prev => ({
              ...prev,
              selected: {
                identity: branchIdentity,
                branchCode: branchCode,
                branchName: branchCode,
              },
            }));
            setValue("branchCode", branchIdentity);
          }

          // Region Code
          if (mappingData.regionIdentity && mappingData.regionCode) {
            const regionIdentity = mappingData.regionIdentity;
            const regionCode = mappingData.regionCode;
            setRegionCodeState(prev => ({
              ...prev,
              selected: {
                identity: regionIdentity,
                regionCode: regionCode,
                regionName: regionCode,
              },
            }));
            setValue("regionCode", regionIdentity);
          }

          // Cluster Code
          if (mappingData.clusterIdentity && mappingData.clusterCode) {
            const clusterIdentity = mappingData.clusterIdentity;
            const clusterCode = mappingData.clusterCode;
            setClusterCodeState(prev => ({
              ...prev,
              selected: {
                identity: clusterIdentity,
                clusterCode: clusterCode,
                clusterName: clusterCode,
              },
            }));
            setValue("clusterCode", clusterIdentity);
          }

          // State Code
          if (mappingData.stateIdentity && mappingData.stateCode) {
            const stateIdentity = mappingData.stateIdentity;
            const stateCode = mappingData.stateCode;
            setStateCodeState(prev => ({
              ...prev,
              selected: {
                identity: stateIdentity,
                stateId: stateCode,
                state: stateCode,
              },
            }));
            setValue("stateCode", stateIdentity);
          }

          setValue("effectiveFrom", mappingData.effectiveFrom);
          setValue("effectiveTo", mappingData.effectiveTo);
          setValue("isActive", mappingData.active);

          logger.info("Approver role mapping data loaded for editing");
        })
        .catch(error => {
          logger.error(error, { toast: true });
        });
    }
  }, [isEditMode, currentMappingId, triggerGetById, setValue]);

  // Generic search handler factory
  const createSearchHandler = useCallback(
    <T>(
      setState: React.Dispatch<React.SetStateAction<SearchState<T>>>,
      fieldName: keyof ApproverRoleMappingFormData
    ) =>
      (value: string) => {
        setState(prev => ({ ...prev, searchTerm: value }));
        if (value.length < 3) {
          setState(prev => ({ ...prev, selected: null, results: [] }));
          setValue(fieldName, "" as never);
        }
      },
    [setValue]
  );

  // Generic search click handler factory
  const createSearchClickHandler = useCallback(
    <T>(
      state: SearchState<T>,
      setState: React.Dispatch<React.SetStateAction<SearchState<T>>>,
      triggerSearch: (term: string) => Promise<{ data?: T[] }>,
      entityName: string
    ) =>
      async () => {
        const trimmedSearchTerm = state.searchTerm.trim();
        if (!trimmedSearchTerm || trimmedSearchTerm.length < 2) {
          logger.info("Please enter at least 2 characters to search", {
            toast: true,
          });
          return;
        }
        try {
          const response = await triggerSearch(trimmedSearchTerm);
          const results = response.data || [];
          if (results.length > 0) {
            setState(prev => ({
              ...prev,
              results,
              showResults: true,
            }));
          } else {
            setState(prev => ({
              ...prev,
              results: [],
              showResults: true,
            }));
            logger.error(`No ${entityName} found for this search term.`, {
              toast: true,
            });
          }
        } catch (error) {
          logger.error(error, { toast: true });
          setState(prev => ({
            ...prev,
            results: [],
            showResults: false,
          }));
        }
      },
    []
  );

  // Generic clear handler factory
  const createClearHandler = useCallback(
    <T>(
      setState: React.Dispatch<React.SetStateAction<SearchState<T>>>,
      fieldName: keyof ApproverRoleMappingFormData
    ) =>
      () => {
        setState({
          selected: null,
          searchTerm: "",
          results: [],
          showResults: false,
        });
        setValue(fieldName, "" as never);
        void trigger(fieldName);
      },
    [setValue, trigger]
  );

  // Role Code handlers
  const handleRoleCodeSearch = createSearchHandler(
    setRoleCodeState,
    "roleCode"
  );
  const handleRoleCodeSearchClick = createSearchClickHandler(
    roleCodeState,
    setRoleCodeState,
    triggerRoleCodeSearch,
    "role codes"
  );
  const handleRoleCodeSelect = useCallback(
    (option: { value: string; label: string; code: string; name: string }) => {
      if (!option || !option.value) {
        logger.error("Invalid role code data", { toast: true });
        return;
      }
      const selected: RoleOption = {
        identity: option.value,
        roleCode: option.code,
        roleName: option.name,
      };
      setRoleCodeState({
        selected,
        searchTerm: "",
        results: [],
        showResults: false,
      });
      setValue("roleCode", option.value);
      void trigger("roleCode");
    },
    [setValue, trigger]
  );
  const handleClearRoleCode = createClearHandler(setRoleCodeState, "roleCode");

  // User Code handlers
  const handleUserCodeSearch = createSearchHandler(
    setUserCodeState,
    "userCode"
  );
  const handleUserCodeSearchClick = createSearchClickHandler(
    userCodeState,
    setUserCodeState,
    triggerUserCodeSearch,
    "user codes"
  );
  const handleUserCodeSelect = useCallback(
    (option: { value: string; label: string; code: string; name: string }) => {
      if (!option || !option.value) {
        logger.error("Invalid user code data", { toast: true });
        return;
      }
      const selected: UserOption = {
        identity: option.value,
        userCode: option.code,
        userName: option.name,
      };
      setUserCodeState({
        selected,
        searchTerm: "",
        results: [],
        showResults: false,
      });
      setValue("userCode", option.value);
      void trigger("userCode");
    },
    [setValue, trigger]
  );
  const handleClearUserCode = createClearHandler(setUserCodeState, "userCode");

  // Branch Code handlers
  const handleBranchCodeSearch = createSearchHandler(
    setBranchCodeState,
    "branchCode"
  );
  const handleBranchCodeSearchClick = createSearchClickHandler(
    branchCodeState,
    setBranchCodeState,
    triggerBranchCodeSearch,
    "branch codes"
  );
  const handleBranchCodeSelect = useCallback(
    (option: { value: string; label: string; code: string; name: string }) => {
      if (!option || !option.value) {
        logger.error("Invalid branch code data", { toast: true });
        return;
      }
      const selected: BranchOption = {
        identity: option.value,
        branchCode: option.code,
        branchName: option.name,
      };
      setBranchCodeState({
        selected,
        searchTerm: "",
        results: [],
        showResults: false,
      });
      setValue("branchCode", option.value);
      void trigger("branchCode");
    },
    [setValue, trigger]
  );
  const handleClearBranchCode = createClearHandler(
    setBranchCodeState,
    "branchCode"
  );

  // Region Code handlers
  const handleRegionCodeSearch = createSearchHandler(
    setRegionCodeState,
    "regionCode"
  );
  const handleRegionCodeSearchClick = createSearchClickHandler(
    regionCodeState,
    setRegionCodeState,
    triggerRegionCodeSearch,
    "region codes"
  );
  const handleRegionCodeSelect = useCallback(
    (option: { value: string; label: string; code: string; name: string }) => {
      if (!option || !option.value) {
        logger.error("Invalid region code data", { toast: true });
        return;
      }
      const selected: RegionOption = {
        identity: option.value,
        regionCode: option.code,
        regionName: option.name,
      };
      setRegionCodeState({
        selected,
        searchTerm: "",
        results: [],
        showResults: false,
      });
      setValue("regionCode", option.value);
      void trigger("regionCode");
    },
    [setValue, trigger]
  );
  const handleClearRegionCode = createClearHandler(
    setRegionCodeState,
    "regionCode"
  );

  // Cluster Code handlers
  const handleClusterCodeSearch = createSearchHandler(
    setClusterCodeState,
    "clusterCode"
  );
  const handleClusterCodeSearchClick = createSearchClickHandler(
    clusterCodeState,
    setClusterCodeState,
    triggerClusterCodeSearch,
    "cluster codes"
  );
  const handleClusterCodeSelect = useCallback(
    (option: { value: string; label: string; code: string; name: string }) => {
      if (!option || !option.value) {
        logger.error("Invalid cluster code data", { toast: true });
        return;
      }
      const selected: ClusterOption = {
        identity: option.value,
        clusterCode: option.code,
        clusterName: option.name,
      };
      setClusterCodeState({
        selected,
        searchTerm: "",
        results: [],
        showResults: false,
      });
      setValue("clusterCode", option.value);
      void trigger("clusterCode");
    },
    [setValue, trigger]
  );
  const handleClearClusterCode = createClearHandler(
    setClusterCodeState,
    "clusterCode"
  );

  // State Code handlers
  const handleStateCodeSearch = createSearchHandler(
    setStateCodeState,
    "stateCode"
  );
  const handleStateCodeSearchClick = createSearchClickHandler(
    stateCodeState,
    setStateCodeState,
    triggerStateCodeSearch,
    "state codes"
  );

  const handleStateCodeSelect = useCallback(
    (option: {
      value: string;
      label: string;
      stateId: string;
      state: string;
    }) => {
      if (!option || !option.value) {
        logger.error("Invalid state code data", { toast: true });
        return;
      }
      const selected: StateOption = {
        identity: option.value,
        stateId: option.stateId,
        state: option.state,
      };
      setStateCodeState({
        selected,
        searchTerm: "",
        results: [],
        showResults: false,
      });
      setValue("stateCode", option.value);
      void trigger("stateCode");
    },
    [setValue, trigger]
  );
  const handleClearStateCode = createClearHandler(
    setStateCodeState,
    "stateCode"
  );

  // Form submission
  const onSubmit = useCallback(
    async (data: ApproverRoleMappingFormData) => {
      try {
        const basePayload = {
          roleIdentity: data.roleCode,
          userIdentity: data.userCode,
          branchIdentity: data.branchCode || null,
          regionIdentity: data.regionCode || null,
          clusterIdentity: data.clusterCode || null,
          stateIdentity: data.stateCode || null,
          effectiveFrom: data.effectiveFrom,
          effectiveTo: data.effectiveTo || null,
          isActive: data.isActive,
        };

        if (isEditMode && currentMappingId) {
          await updateMapping({
            mappingId: currentMappingId,
            payload: basePayload as UpdateApproverRoleMappingPayload,
          }).unwrap();

          logger.info("Approver role mapping updated successfully", {
            toast: true,
          });
          dispatch(resetApproverRoleMappingState());
        } else {
          await saveMapping(
            basePayload as SaveApproverRoleMappingPayload
          ).unwrap();

          logger.info("Approver role mapping saved successfully", {
            toast: true,
          });
        }

        dispatch(setIsReady(true));
        reset(approverRoleMappingDefaultFormValues);
        setIsFormOpen(false);

        // Clear all search states
        setRoleCodeState({
          selected: null,
          searchTerm: "",
          results: [],
          showResults: false,
        });
        setUserCodeState({
          selected: null,
          searchTerm: "",
          results: [],
          showResults: false,
        });
        setBranchCodeState({
          selected: null,
          searchTerm: "",
          results: [],
          showResults: false,
        });
        setRegionCodeState({
          selected: null,
          searchTerm: "",
          results: [],
          showResults: false,
        });
        setClusterCodeState({
          selected: null,
          searchTerm: "",
          results: [],
          showResults: false,
        });
        setStateCodeState({
          selected: null,
          searchTerm: "",
          results: [],
          showResults: false,
        });

        window.dispatchEvent(new CustomEvent("refreshApproverRoleMappings"));
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
            `Failed to ${isEditMode ? "update" : "save"} approver role mapping`;

          logger.error(errorMessage, { toast: true });
        } else {
          logger.error("An unexpected error occurred", { toast: true });
        }
      }
    },
    [saveMapping, updateMapping, dispatch, reset, currentMappingId, isEditMode]
  );

  // Form reset

  const handleReset = useCallback(() => {
    if (isEditMode) {
      dispatch(resetApproverRoleMappingState());
    }
    setRoleCodeState({
      selected: null,
      searchTerm: "",
      results: [],
      showResults: false,
    });
    setUserCodeState({
      selected: null,
      searchTerm: "",
      results: [],
      showResults: false,
    });
    setBranchCodeState({
      selected: null,
      searchTerm: "",
      results: [],
      showResults: false,
    });
    setRegionCodeState({
      selected: null,
      searchTerm: "",
      results: [],
      showResults: false,
    });
    setClusterCodeState({
      selected: null,
      searchTerm: "",
      results: [],
      showResults: false,
    });
    setStateCodeState({
      selected: null,
      searchTerm: "",
      results: [],
      showResults: false,
    });
    reset(approverRoleMappingDefaultFormValues);
  }, [reset, isEditMode, dispatch]);

  const handleCancel = useCallback(() => {
    if (isEditMode) {
      dispatch(resetApproverRoleMappingState());
    }
    reset(approverRoleMappingDefaultFormValues);

    // Clear all search states
    setRoleCodeState({
      selected: null,
      searchTerm: "",
      results: [],
      showResults: false,
    });
    setUserCodeState({
      selected: null,
      searchTerm: "",
      results: [],
      showResults: false,
    });
    setBranchCodeState({
      selected: null,
      searchTerm: "",
      results: [],
      showResults: false,
    });
    setRegionCodeState({
      selected: null,
      searchTerm: "",
      results: [],
      showResults: false,
    });
    setClusterCodeState({
      selected: null,
      searchTerm: "",
      results: [],
      showResults: false,
    });
    setStateCodeState({
      selected: null,
      searchTerm: "",
      results: [],
      showResults: false,
    });

    if (!isEditMode) {
      setIsFormOpen(false);
    }
  }, [reset, isEditMode, dispatch]);

  const handleToggleForm = useCallback(() => {
    setIsFormOpen(prev => !prev);
  }, []);

  const handleCancelEdit = useCallback(() => {
    dispatch(resetApproverRoleMappingState());
    reset(approverRoleMappingDefaultFormValues);
    setIsFormOpen(false);
    setRoleCodeState({
      selected: null,
      searchTerm: "",
      results: [],
      showResults: false,
    });
    setUserCodeState({
      selected: null,
      searchTerm: "",
      results: [],
      showResults: false,
    });
    setBranchCodeState({
      selected: null,
      searchTerm: "",
      results: [],
      showResults: false,
    });
    setRegionCodeState({
      selected: null,
      searchTerm: "",
      results: [],
      showResults: false,
    });
    setClusterCodeState({
      selected: null,
      searchTerm: "",
      results: [],
      showResults: false,
    });
    setStateCodeState({
      selected: null,
      searchTerm: "",
      results: [],
      showResults: false,
    });
  }, [dispatch, reset]);

  return {
    // Form state
    form,
    isFormOpen,
    isEditMode,
    isLoading,
    readonly,

    // Search states
    roleCodeState,
    userCodeState,
    branchCodeState,
    regionCodeState,
    clusterCodeState,
    stateCodeState,

    // Search loading states
    isSearchingRoleCode,
    isSearchingUserCode,
    isSearchingBranchCode,
    isSearchingRegionCode,
    isSearchingClusterCode,
    isSearchingStateCode,

    // Role Code handlers
    handleRoleCodeSearch,
    handleRoleCodeSearchClick,
    handleRoleCodeSelect,
    handleClearRoleCode,
    setRoleCodeState,

    // User Code handlers
    handleUserCodeSearch,
    handleUserCodeSearchClick,
    handleUserCodeSelect,
    handleClearUserCode,
    setUserCodeState,

    // Branch Code handlers
    handleBranchCodeSearch,
    handleBranchCodeSearchClick,
    handleBranchCodeSelect,
    handleClearBranchCode,
    setBranchCodeState,

    // Region Code handlers
    handleRegionCodeSearch,
    handleRegionCodeSearchClick,
    handleRegionCodeSelect,
    handleClearRegionCode,
    setRegionCodeState,

    // Cluster Code handlers
    handleClusterCodeSearch,
    handleClusterCodeSearchClick,
    handleClusterCodeSelect,
    handleClearClusterCode,
    setClusterCodeState,

    // State Code handlers
    handleStateCodeSearch,
    handleStateCodeSearchClick,
    handleStateCodeSelect,
    handleClearStateCode,
    setStateCodeState,

    // Form handlers
    onSubmit,
    handleReset,
    handleToggleForm,
    handleCancelEdit,
    handleCancel,
  };
};
