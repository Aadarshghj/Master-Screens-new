import { useForm } from "react-hook-form";
import { useEffect, useCallback, useMemo, useState, useRef } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import type {
  AdminUnitDetails,
  AdminUnitTypeOption,
  BranchCreatePayload,
} from "@/types/organisation/admin-unit";
import { adminUnitRegistrationSchema } from "@/global/validation/organization/admin-unit";
import { useGetAdminUnitTypesQuery } from "@/global/service/end-points/organisation/unit-type.api";
import {
  useSaveBranchMutation,
  useUpdateBranchMutation,
  useGetBranchByIdQuery,
  useGetBranchStatusQuery,
  useGetBranchCategoryQuery,
  useGetBranchTypesQuery,
  useGetMergedToBranchesQuery,
  useGetAllBranchesQuery,
  useGetParentBranchesQuery,
  useGetTimezonesQuery,
  useLazyGetPincodeDetailsQuery,
  useGetLanguagesQuery,
} from "@/global/service/end-points/organisation/branches.api";
import type { PincodeApiResponse } from "@/types/organisation/admin-unit";
import type { DropdownOption } from "@/components/ui/input-with-search/input-with-search";
import { toast } from "react-hot-toast";
import {
  ADMIN_UNIT_CODES,
  DEFAULT_COUNTRY,
  DEFAULT_CURRENCY,
  DEFAULT_TIMEZONE,
} from "../../constants/ZoneInformationConstants";

export const toTitleCase = (str?: string): string => {
  if (!str) return "";
  return str
    .toLowerCase()
    .split(/[\s_]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const toUpperCasePayload = <T extends Record<string, unknown>>(obj: T): T =>
  Object.fromEntries(
    Object.entries(obj).map(([key, val]) => [
      key,
      typeof val === "string" ? val.toUpperCase() : val,
    ])
  ) as T;

const UNIT_CODE_CONFIG: Record<string, { prefix: string; pad: number }> = {
  CORPORATE: { prefix: "CO", pad: 4 },
  STATE: { prefix: "ST", pad: 4 },
  REGION: { prefix: "RG", pad: 4 },
  AREA: { prefix: "AR", pad: 4 },
  BRANCH: { prefix: "BR", pad: 4 },
};

const DEFAULT_CODE_CONFIG = { prefix: "UN", pad: 4 };

export const computeNextCode = (
  existingCodes: string[],
  unitTypeCode: string
): string => {
  const { prefix, pad } =
    UNIT_CODE_CONFIG[unitTypeCode?.toUpperCase()] ?? DEFAULT_CODE_CONFIG;

  const nums = existingCodes
    .filter(c => c?.toUpperCase().startsWith(prefix.toUpperCase()))
    .map(c => parseInt(c.slice(prefix.length), 10))
    .filter(n => !isNaN(n));

  const next = nums.length > 0 ? Math.max(...nums) + 1 : 1;
  return `${prefix}${String(next).padStart(pad, "0")}`;
};

const BLANK_FORM: AdminUnitDetails = {
  identity: "",
  adminUnitTypeIdentity: "",
  branchCode: "",
  branchName: "",
  branchShortName: "",
  branchStatusIdentity: "",
  branchTypeIdentity: "",
  branchCategoryIdentity: "",
  parentBranchIdentity: null,
  parentBranchName: null,
  mergedToBranchIdentity: null,
  mergedToBranchName: null,
  mergedOn: null,
  registrationDate: null,
  openingDate: null,
  closingDate: null,
  dateOfShift: null,
  doorNumber: "",
  addressLine1: "",
  addressLine2: "",
  landmark: "",
  placeName: "",
  pincodeIdentity: "",
  pincode: "",
  postOfficeIdentity: "",
  postOffice: "",
  cityIdentity: "",
  cityName: "",
  districtIdentity: "",
  districtName: "",
  stateIdentity: "",
  stateName: "",
  countryIdentity: "",
  countryName: DEFAULT_COUNTRY,
  language: "",
  latitude: null,
  longitude: null,
  timezone: DEFAULT_TIMEZONE,
  locationCode: "",
  parentAdminCode: "",
  micrCode: "",
  ifscCode: "",
  swiftBicCode: "",
  bsrCode: "",
  authDealerCode: "",
  tbaMainKey: "",
  regDirectoryCode: "",
  sizeId: undefined,
  numExtensionCounters: undefined,
  linkServiceMainBranchId: undefined,
  numSplitPremises: undefined,
  numOfficersAvailable: undefined,
  baseCurrency: DEFAULT_CURRENCY,
  isMainBranchInLocation: false,
  isActive: true,
  isSplitPremises: false,
  localClearingMember: false,
  nationalClearingMember: false,
  highValueClearingMember: false,
  clearingBasedOnMicr: false,
  cashMgmtBranch: false,
  rtgsDepEnabled: false,
  authDealForex: false,
  authForeignCurrencyDeposit: false,
  ddIssueAllowed: false,
  ttIssueAllowed: false,
  dedicatedIssueOperations: "",
};

export const UNIT_TYPE_CODES_WITH_PAGES = [
  "CORPORATE",
  "STATE",
  "REGION",
  "AREA",
  "BRANCH",
] as const;

export type UnitTypeCode = (typeof UNIT_TYPE_CODES_WITH_PAGES)[number];

export interface UseAdminUnitManagerOptions {
  lockedUnitTypeCode?: UnitTypeCode;
  editIdentity?: string;
}

export const useAdminUnitManagerBase = ({
  lockedUnitTypeCode,
  editIdentity,
}: UseAdminUnitManagerOptions = {}) => {
  const {
    data: rawAdminUnitTypeOptions = [] as AdminUnitTypeOption[],
    isLoading: isUnitTypesLoading,
    isSuccess: isUnitTypesSuccess,
  } = useGetAdminUnitTypesQuery();

  const adminUnitTypeOptions = useMemo(
    () =>
      [...rawAdminUnitTypeOptions]
        .sort((a, b) => (a.hierarchyLevel ?? 0) - (b.hierarchyLevel ?? 0))
        .map(o => ({ ...o, label: toTitleCase(o.label) })),
    [rawAdminUnitTypeOptions]
  );

  const { data: allBranchList = [] } = useGetAllBranchesQuery();
  const { data: statusOptions = [] } = useGetBranchStatusQuery();
  const { data: categoryOptions = [] } = useGetBranchCategoryQuery();
  const { data: branchTypeOptions = [] } = useGetBranchTypesQuery();
  const { data: mergedToOptions = [] } = useGetMergedToBranchesQuery();
  const { data: timezoneOptions = [] } = useGetTimezonesQuery();
  const { data: languageOptions = [] } = useGetLanguagesQuery();
  const [fetchPincodeDetails] = useLazyGetPincodeDetailsQuery();
  const [saveBranch, { isLoading: isSaving }] = useSaveBranchMutation();
  const [updateBranch, { isLoading: isUpdating }] = useUpdateBranchMutation();

  const [postOfficeOptions, setPostOfficeOptions] = useState<DropdownOption[]>(
    []
  );
  const [showPostOfficeDropdown, setShowPostOfficeDropdown] = useState(false);
  const [postOfficeLoading, setPostOfficeLoading] = useState(false);
  const [postOfficeError, setPostOfficeError] = useState<string | undefined>();
  const [selectedPostOffice, setSelectedPostOffice] =
    useState<DropdownOption | null>(null);
  const  pincodeRecordRef = useRef<PincodeApiResponse | null>(null);

  const schema = useMemo(() => adminUnitRegistrationSchema(), []);

  const {
    control,
    register,
    handleSubmit,
    watch,
    trigger,
    reset,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<AdminUnitDetails>({
    resolver: yupResolver(schema),
    defaultValues: BLANK_FORM,
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const selectedUnitType = watch("adminUnitTypeIdentity");
  const selectedStatus = watch("branchStatusIdentity");
  const pincodeValue = watch("pincode");

  const selectedUnitCode = useMemo(
    () =>
      (adminUnitTypeOptions as AdminUnitTypeOption[]).find(
        o => o.value === selectedUnitType
      )?.code ?? "",
    [adminUnitTypeOptions, selectedUnitType]
  );

  const isBranch = selectedUnitCode === ADMIN_UNIT_CODES.BRANCH;
  const isCorporate = selectedUnitCode.toUpperCase() === "CORPORATE";

  const { data: parentOptions = [] } = useGetParentBranchesQuery(
    selectedUnitType,
    { skip: !selectedUnitType || isCorporate }
  );

  const allBranchListRef = useRef(allBranchList);
  const adminUnitTypeOptsRef = useRef(adminUnitTypeOptions);
  const setValueRef = useRef(setValue);
  const getValuesRef = useRef(getValues);
  const resetRef = useRef(reset);
  const selectedUnitCodeRef = useRef(selectedUnitCode);

  allBranchListRef.current = allBranchList;
  adminUnitTypeOptsRef.current = adminUnitTypeOptions;
  setValueRef.current = setValue;
  getValuesRef.current = getValues;
  resetRef.current = reset;
  selectedUnitCodeRef.current = selectedUnitCode;

  const applyNextCode = useCallback((overrideUnitCode?: string) => {
    const unitCode = overrideUnitCode ?? selectedUnitCodeRef.current;
    const allCodes = allBranchListRef.current.map(
      (b: { branchCode: string }) => b.branchCode
    );
    setValueRef.current("branchCode", computeNextCode(allCodes, unitCode));
  }, []);

  const buildReset = useCallback(
    (unitTypeIdentity?: string): AdminUnitDetails => {
      const opts = adminUnitTypeOptsRef.current as AdminUnitTypeOption[];

      const resolvedIdentity = lockedUnitTypeCode
        ? (opts.find(o => o.code === lockedUnitTypeCode)?.value ?? "")
        : (unitTypeIdentity ??
          opts.find(o => o.code === ADMIN_UNIT_CODES.BRANCH)?.value ??
          "");

      return {
        ...BLANK_FORM,
        adminUnitTypeIdentity: resolvedIdentity,
        branchCode: "",
      };
    },
    [lockedUnitTypeCode]
  );

  const initialisedRef = useRef(false);

  useEffect(() => {
    if (editIdentity) return;
    if (!isUnitTypesSuccess) return;
    if (adminUnitTypeOptions.length === 0) return;
    if (initialisedRef.current) return;
    initialisedRef.current = true;

    const targetCode = lockedUnitTypeCode ?? ADMIN_UNIT_CODES.BRANCH;
    const targetOption = adminUnitTypeOptions.find(
      (o: AdminUnitTypeOption) => o.code === targetCode
    );

    if (targetOption) {
      setValueRef.current("adminUnitTypeIdentity", targetOption.value);
      applyNextCode(targetOption.code);
    }
  }, [
    editIdentity,
    isUnitTypesSuccess,
    adminUnitTypeOptions,
    applyNextCode,
    lockedUnitTypeCode,
  ]);

  useEffect(() => {
    if (languageOptions.length === 0) return;
    const currentLanguage = getValuesRef.current("language");
    if (currentLanguage) return;

    const english = languageOptions.find(o =>
      o.label.toLowerCase().includes("english")
    );
    if (english) {
      setValueRef.current("language", english.value);
    }
  }, [languageOptions]);

  useEffect(() => {
    if (branchTypeOptions.length !== 1) return;
    const currentType = getValuesRef.current("branchTypeIdentity");
    if (currentType) return;

    setValueRef.current("branchTypeIdentity", branchTypeOptions[0].value);
  }, [branchTypeOptions]);

  const prevUnitTypeRef = useRef<string>("");

  useEffect(() => {
    if (!selectedUnitType) return;

    if (prevUnitTypeRef.current === "") {
      prevUnitTypeRef.current = selectedUnitType;
      return;
    }
    if (prevUnitTypeRef.current === selectedUnitType) return;

    prevUnitTypeRef.current = selectedUnitType;
    setValueRef.current("branchTypeIdentity", "");
    setValueRef.current("branchCategoryIdentity", "");
    setValueRef.current("parentBranchIdentity", null);

    applyNextCode(selectedUnitCodeRef.current);

    if (branchTypeOptions.length === 1) {
      setValueRef.current("branchTypeIdentity", branchTypeOptions[0].value);
    }
  }, [selectedUnitType, applyNextCode, branchTypeOptions]);

  const { data: branchData } = useGetBranchByIdQuery(editIdentity!, {
    skip: !editIdentity,
  });

  useEffect(() => {
    if (!branchData) return;
    resetRef.current({
      ...BLANK_FORM,
      ...branchData,
      branchTypeIdentity: branchData.branchTypeIdentity ?? "",
      branchCategoryIdentity: branchData.branchCategoryIdentity ?? "",
      branchStatusIdentity: branchData.branchStatusIdentity ?? "",
      parentBranchIdentity: branchData.parentBranchIdentity ?? null,
      mergedToBranchIdentity: branchData.mergedToBranchIdentity ?? null,
      mergedOn: branchData.mergedOn ?? null,
      closingDate: branchData.closingDate ?? null,
      dateOfShift: branchData.dateOfShift ?? null,
      timezone: branchData.timezone ?? DEFAULT_TIMEZONE,
      language: branchData.language ?? "",
      locationCode: branchData.locationCode ?? "",
      parentAdminCode: branchData.parentAdminCode ?? "",
      micrCode: branchData.micrCode ?? "",
      ifscCode: branchData.ifscCode ?? "",
      swiftBicCode: branchData.swiftBicCode ?? "",
      bsrCode: branchData.bsrCode ?? "",
      authDealerCode: branchData.authDealerCode ?? "",
      tbaMainKey: branchData.tbaMainKey ?? "",
      regDirectoryCode: branchData.regDirectoryCode ?? "",
      dedicatedIssueOperations: branchData.dedicatedIssueOperations ?? "",
      countryName: DEFAULT_COUNTRY,
      baseCurrency: branchData.baseCurrency ?? DEFAULT_CURRENCY,
      stateIdentity: branchData.stateIdentity ?? "",
      districtIdentity: branchData.districtIdentity ?? "",
    });
  }, [branchData]);

  useEffect(() => {
    if (!selectedPostOffice) return;
    const record = pincodeRecordRef.current;
    if (!record) return;

    const sv = setValueRef.current;
    sv("postOfficeIdentity", selectedPostOffice.value, {
      shouldValidate: true,
    });
    sv("postOffice", selectedPostOffice.label, { shouldValidate: true });
    sv("pincodeIdentity", record.identity, { shouldValidate: true });
    sv("pincode", record.pincode, { shouldValidate: true });
    sv("districtName", record.districtName ?? "", { shouldValidate: true });
    sv("districtIdentity", record.districtIdentity ?? "", {
      shouldValidate: true,
    });
    sv("stateName", record.stateName ?? "", { shouldValidate: true });
    sv("stateIdentity", record.stateIdentity ?? "", { shouldValidate: true });
    sv("countryName", DEFAULT_COUNTRY, { shouldValidate: true });

    setSelectedPostOffice(null);
    setShowPostOfficeDropdown(false);
  }, [selectedPostOffice]);

  const onPincodeSearch = useCallback(async (): Promise<void> => {
    if (!pincodeValue || pincodeValue.length < 6) return;

    setPostOfficeOptions([]);
    setShowPostOfficeDropdown(false);
    setPostOfficeError(undefined);
    pincodeRecordRef.current = null;
    setPostOfficeLoading(true);

    try {
      const results = await fetchPincodeDetails(pincodeValue).unwrap();
      const record = results?.[0];
      if (!record) {
        setPostOfficeError("No data found for this PIN code.");
        setShowPostOfficeDropdown(true);
        return;
      }

      pincodeRecordRef.current = record;

      const offices = record.postOffices.map(po => ({
        label: po.officeName,
        value: po.identity,
      }));

      setPostOfficeOptions(offices);

      if (offices.length === 1) {
        setSelectedPostOffice(offices[0]);
        setShowPostOfficeDropdown(false);
      } else {
        setShowPostOfficeDropdown(true);
      }
    } catch (error: unknown) {
      const message =
        typeof error === "object" && error !== null && "data" in error
          ? (error as { data?: { message?: string } }).data?.message
          : undefined;
      setPostOfficeError(message ?? "PIN code not found. Please try again.");
      setShowPostOfficeDropdown(true);
    } finally {
      setPostOfficeLoading(false);
    }
  }, [fetchPincodeDetails, pincodeValue]);

  const onPostOfficeSelect = useCallback((option: DropdownOption): void => {
    setSelectedPostOffice(option);
  }, []);

  const mapToBackend = useCallback(
    (data: AdminUnitDetails): BranchCreatePayload => {
      const raw = {
        branchCode: data.branchCode ?? "",
        branchName: data.branchName ?? "",
        branchStatusIdentity: data.branchStatusIdentity ?? "",
        adminUnitTypeIdentity: data.adminUnitTypeIdentity ?? "",
        registrationDate: data.registrationDate ?? "",
        openingDate: data.openingDate ?? "",
        doorNumber: data.doorNumber ?? "",
        addressLine1: data.addressLine1 ?? "",
        baseCurrencyCode: data.baseCurrency ?? DEFAULT_CURRENCY,
        timezone: data.timezone ?? DEFAULT_TIMEZONE,

        branchTypeIdentity: data.branchTypeIdentity || null,
        branchCategoryIdentity: data.branchCategoryIdentity || null,
        branchShortName: data.branchShortName || null,
        parentBranchIdentity: data.parentBranchIdentity || null,
        mergedToIdentity: data.mergedToBranchIdentity || null,
        mergedOnDate: data.mergedOn || null,
        closingDate: data.closingDate || null,
        dateOfShift: data.dateOfShift || null,
        addressLine2: data.addressLine2 || null,
        landmark: data.landmark || null,
        placeName: data.placeName || null,
        postOfficeIdentity: data.postOfficeIdentity || null,
        locationCode: data.locationCode || null,
        parentAdminCode: data.parentAdminCode || null,
        micrCode: data.micrCode || null,
        ifscCode: data.ifscCode || null,
        swiftBicCode: data.swiftBicCode || null,
        bsrCode: data.bsrCode || null,
        language:
          languageOptions.find(l => l.value === data.language)?.label || null,

        isMainBranchInLocation: data.isMainBranchInLocation ?? false,
        isSplitPremises: data.isSplitPremises ?? false,
        localClearingMember: data.localClearingMember ?? false,
        nationalClearingMember: data.nationalClearingMember ?? false,
        highValueClearingMember: data.highValueClearingMember ?? false,
        clearingBasedOnMicr: data.clearingBasedOnMicr ?? false,
        cashMgmtBranch: data.cashMgmtBranch ?? false,
        rtgsDepEnabled: data.rtgsDepEnabled ?? false,
        authDealForex: data.authDealForex ?? false,
        authForeignCurrencyDeposit: data.authForeignCurrencyDeposit ?? false,
        ddIssueAllowed: data.ddIssueAllowed ?? false,
        ttIssueAllowed: data.ttIssueAllowed ?? false,
      };

      return toUpperCasePayload(raw) as unknown as BranchCreatePayload;
    },
    [languageOptions]
  );

  const onSubmit = useCallback(
    async (data: AdminUnitDetails): Promise<void> => {
      try {
        const payload = mapToBackend(data);

        if (editIdentity) {
          const result = await updateBranch({
            id: editIdentity,
            payload,
          }).unwrap();
          toast.success(result?.message ?? "Updated successfully");
        } else {
          const result = await saveBranch(payload).unwrap();
          toast.success(result?.message ?? "Saved successfully");
        }

        resetRef.current(buildReset(data.adminUnitTypeIdentity));

        const savedUnitCode =
          (adminUnitTypeOptsRef.current as AdminUnitTypeOption[]).find(
            o => o.value === data.adminUnitTypeIdentity
          )?.code ?? selectedUnitCodeRef.current;

        applyNextCode(savedUnitCode);
      } catch (error: unknown) {
        const message =
          typeof error === "object" && error !== null && "data" in error
            ? (error as { data?: { message?: string } }).data?.message
            : undefined;
        console.error("Backend error:", error);
        toast.error(message ?? "Failed to save. Please try again.");
      }
    },
    [
      editIdentity,
      mapToBackend,
      saveBranch,
      updateBranch,
      buildReset,
      applyNextCode,
    ]
  );

  const onReset = useCallback((): void => {
    resetRef.current(buildReset(selectedUnitType));
    applyNextCode(selectedUnitCodeRef.current);
    setPostOfficeOptions([]);
    setShowPostOfficeDropdown(false);
    setPostOfficeError(undefined);
    setSelectedPostOffice(null);
    pincodeRecordRef.current = null;

    if (languageOptions.length > 0) {
      const english = languageOptions.find(o =>
        o.label.toLowerCase().includes("english")
      );
      if (english) {
        setValueRef.current("language", english.value);
      }
    }

    if (branchTypeOptions.length === 1) {
      setValueRef.current("branchTypeIdentity", branchTypeOptions[0].value);
    }
  }, [
    buildReset,
    applyNextCode,
    selectedUnitType,
    languageOptions,
    branchTypeOptions,
  ]);

  return {
    control,
    register,
    handleSubmit,
    watch,
    trigger,
    setValue,
    errors,
    isSubmitting: isSubmitting || isSaving || isUpdating,
    isUnitTypesLoading,
    isBranch,
    selectedStatus,
    selectedUnitType,
    selectedUnitCode,
    isUnitTypeLocked: !!lockedUnitTypeCode,
    onSubmit,
    onReset,
    onPincodeSearch,
    onPostOfficeSelect,
    postOfficeOptions,
    showPostOfficeDropdown,
    setShowPostOfficeDropdown,
    postOfficeLoading,
    postOfficeError,
    adminUnitTypeOptions,
    statusOptions,
    branchTypeOptions,
    categoryOptions,
    parentOptions,
    mergedToOptions,
    timezoneOptions,
    languageOptions,
  };
};
