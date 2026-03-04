import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Breadcrumb,
  HeaderWrapper,
  TitleHeader,
  type BreadcrumbItem,
} from "@/components";
import { Button } from "@/components/ui/button";
import { Plus, Save, Search } from "lucide-react";
import { Flex } from "@/components/ui/flex";
import { ChargeMasterTabs } from "./components/Form/ChargeMasterTabs";
import { ChargeDetailsForm } from "./components/Form/ChargeDetailsForm";
import { CalculationLogicForm } from "./components/Form/CalculationLogicForm";
import { StateSpecificConfiguration } from "./components/Form/StateSpecificConfiguration";
import { TaxConfiguration } from "./components/Form/TaxConfiguration";
import CapsuleButton from "@/components/ui/capsule-button/capsule-button";
import { ChargeSearchModal } from "./components/Modal/ChargeSearchModal";
import { chargeMasterValidationSchema } from "@/global/validation/loan-product-and-scheme-masters/chargeMaster-schema";
import type {
  ChargeMasterFormData,
  ChargeSearchData,
} from "@/types/loan-product-and-scheme-masters/charge-master.types";
import { logger } from "@/global/service";
import { useAppSelector, useAppDispatch } from "@/hooks/store";
import {
  setEditMode,
  resetChargeMasterState,
} from "@/global/reducers/loan/charge-master.reducer";
import {
  useSaveChargeMasterConfigurationMutation,
  useGetStateZoneConfigQuery,
} from "@/global/service/end-points/loan-product-and-service-masters/charge-master";
import {
  transformChargeMasterFormToPayload,
  validateChargeMasterData,
} from "@/utils/charge-master-utils";

export const ChargeMasterPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [activeTab, setActiveTab] = useState<
    "charge-details" | "calculation-logic" | "state-config" | "tax-config"
  >("charge-details");
  const [showSearchModal, setShowSearchModal] = useState(false);

  const { isEditMode } = useAppSelector(state => state.chargeMaster);

  const [saveChargeMaster, { isLoading: isSaving }] =
    useSaveChargeMasterConfigurationMutation();

  const { data: allStates = [] } = useGetStateZoneConfigQuery();

  const methods = useForm<ChargeMasterFormData>({
    resolver: yupResolver(chargeMasterValidationSchema),
    mode: "onBlur",
    context: { isEditMode },
    defaultValues: {
      chargeDetails: {
        chargeCode: "",
        chargeName: "",
        module: "",
        subModule: "",
        calculationOn: "",
        chargeCalculation: "",
        chargeIncomeGLAccount: "",
        monthAmount: "",
        calculationCriteria: "",
        chargesPostingRequired: false,
        isActive: true,
      },
      calculationLogic: {
        calculationLogics: [],
      },
      stateConfiguration: {
        specificToState: false,
        selectedStates: [],
        northZoneEnabled: false,
        southZoneEnabled: false,
      },
      taxConfiguration: {
        ifTaxApplicable: false,
        singleTaxMethod: false,
        cgstApplicable: false,
        sgstApplicable: false,
        igstApplicable: false,
        cessApplicable: false,
      },
    },
  });

  const {
    handleSubmit,
    formState: { isValid },
    trigger,
    setValue,
    clearErrors,
    reset,
  } = methods;

  const breadcrumbItems: BreadcrumbItem[] = [
    {
      label: "Home",
      href: "/",
      onClick: () => navigate("/"),
    },
    {
      label: "Loan Product",
      href: "/loan",
      onClick: () => navigate("/loan"),
    },
    {
      label: "Loan Scheme Creation",
      href: "/loan/scheme-creation",
      onClick: () => navigate("/loan/scheme-creation"),
    },
    {
      label: "Loan Charge Master",
      href: "/loan/charge-master",
      onClick: () => navigate("/loan/charge-master"),
    },
  ];

  const handleTabChange = useCallback(
    async (
      tab:
        | "charge-details"
        | "calculation-logic"
        | "state-config"
        | "tax-config"
    ) => {
      const tabValidationMap = {
        "charge-details": "chargeDetails",
        "calculation-logic": "calculationLogic",
        "state-config": "stateConfiguration",
        "tax-config": "taxConfiguration",
      };

      const fieldToValidate = tabValidationMap[
        activeTab
      ] as keyof ChargeMasterFormData;
      const isTabValid = await trigger(fieldToValidate);

      if (isTabValid) {
        setActiveTab(tab);
      } else {
        logger.error(
          "Please fill the mandatory fields in the current tab before proceeding",
          {
            toast: true,
          }
        );
      }
    },
    [activeTab, trigger]
  );

  const handleSaveConfiguration = handleSubmit(async data => {
    try {
      // Additional validation before save
      const validationResult = validateChargeMasterData(data);

      if (!validationResult.isValid) {
        logger.error(validationResult.errors[0], { toast: true });
        return;
      }

      const payload = transformChargeMasterFormToPayload(data, allStates);

      console.log("Saving charge configuration with payload:", payload);

      const response = await saveChargeMaster(payload).unwrap();

      logger.info(
        isEditMode
          ? "Charge configuration updated successfully"
          : `Charge configuration saved successfully. Charge Code: ${response.chargeCode}`,
        { toast: true }
      );

      reset();
      dispatch(resetChargeMasterState());
      setActiveTab("charge-details");
    } catch (error) {
      console.error("Save error:", error);

      if (typeof error === "object" && error !== null) {
        const apiError = error as {
          status?: number;
          data?: {
            message?: string;
            error?: string;
            errorCode?: string;
          };
        };

        const errorMessage =
          apiError.data?.message ||
          apiError.data?.error ||
          "Failed to save charge configuration";

        logger.error(errorMessage, { toast: true });
      } else {
        logger.error("Failed to save charge configuration", { toast: true });
      }
    }
  });

  const handleSelectCharge = useCallback(
    async (charge: ChargeSearchData) => {
      try {
        dispatch(setEditMode({ isEdit: true, chargeId: charge.chargeId }));

        clearErrors();

        setValue("chargeDetails.chargeCode", charge.chargeCode);
        setValue("chargeDetails.chargeName", charge.chargeName);

        if (charge.originalData) {
          setValue("chargeDetails.module", charge.originalData.module);
          setValue("chargeDetails.subModule", charge.originalData.subModule);
          setValue(
            "chargeDetails.calculationOn",
            charge.originalData.calculationOn
          );
          setValue(
            "chargeDetails.chargeCalculation",
            charge.originalData.chargeCalculation
          );
          setValue(
            "chargeDetails.chargeIncomeGLAccount",
            charge.originalData.chargeIncomeGLAccount
          );
          setValue(
            "chargeDetails.monthAmount",
            charge.originalData.monthAmount
          );
          setValue(
            "chargeDetails.calculationCriteria",
            charge.originalData.calculationCriteria
          );
        }

        setValue(
          "chargeDetails.chargesPostingRequired",
          charge.chargesPostingRequired === "Yes"
        );
        setValue("chargeDetails.isActive", charge.isActive);

        setShowSearchModal(false);
        setActiveTab("charge-details");
      } catch (error) {
        logger.error("Failed to load charge details", { toast: true });
        logger.error(error, { toast: false });
      }
    },
    [setValue, dispatch, clearErrors, setShowSearchModal, setActiveTab]
  );

  const handleNewCharge = useCallback(() => {
    reset();
    dispatch(resetChargeMasterState());
    setActiveTab("charge-details");
    logger.info("Form reset for new charge creation", { toast: false });
  }, [reset, dispatch]);

  return (
    <div className="space-y-6">
      <section>
        <Breadcrumb
          items={breadcrumbItems}
          variant="default"
          size="sm"
          className="mt-4 mb-6 ml-4"
        />
      </section>

      <section className="px-4">
        <Flex justify="between" align="center" className="mb-6 w-full">
          <HeaderWrapper>
            <TitleHeader
              title={isEditMode ? "Edit Charge Master" : "Charge Master"}
            />
          </HeaderWrapper>
          <div className="flex gap-3">
            {isEditMode && (
              <CapsuleButton
                onClick={handleNewCharge}
                label="New Charge"
                icon={Plus}
              />
            )}
            <CapsuleButton
              onClick={() => setShowSearchModal(true)}
              label="Search"
              icon={Search}
            />
          </div>
        </Flex>

        <ChargeMasterTabs activeTab={activeTab} onTabChange={handleTabChange} />

        <div className="mt-1">
          {activeTab === "charge-details" && <ChargeDetailsForm />}
          {activeTab === "calculation-logic" && <CalculationLogicForm />}
          {activeTab === "state-config" && <StateSpecificConfiguration />}
          {activeTab === "tax-config" && <TaxConfiguration />}
        </div>

        <div className="mt-8 rounded-sm border border-cyan-600 bg-cyan-100 p-6">
          <Flex justify="between" align="center">
            <div>
              <p className="text-sm text-gray-600">
                Complete all the charge configurations and Save
              </p>
              {!isValid && (
                <p className="mt-1 text-xs text-red-600">
                  Please complete all required fields in all tabs
                </p>
              )}
            </div>
            <Button
              variant="resetPrimary"
              size="compactWhite"
              onClick={handleSaveConfiguration}
              disabled={!isValid || isSaving}
            >
              <Save className="mr-2 h-4 w-4" />
              {isSaving
                ? "Saving..."
                : isEditMode
                  ? "Update Charge Configuration"
                  : "Save Charge Configuration"}
            </Button>
          </Flex>
        </div>
      </section>

      {showSearchModal && (
        <ChargeSearchModal
          isOpen={showSearchModal}
          onClose={() => setShowSearchModal(false)}
          onSelectCharge={handleSelectCharge}
        />
      )}
    </div>
  );
};
