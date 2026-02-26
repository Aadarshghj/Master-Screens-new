import React, { useCallback, useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { InputWithSearch } from "@/components/ui/input-with-search";
import type { ChargeMasterFormData } from "@/types/loan-product-and-scheme-masters/charge-master.types";
import {
  useGetSingleTaxMethodsQuery,
  useGetTaxTreatmentsQuery,
  useLazySearchGLAccountsFourQuery,
} from "@/global/service/end-points/loan-product-and-service-masters/charge-master";
import { logger } from "@/global/service";

interface TaxConfigurationFormProps {
  taxType: "single" | "cgst" | "sgst" | "igst" | "cess" | "taxInclusive";
}

interface SelectedGLAccount {
  identity: string;
  glCode: string;
  glName: string;
}

export const TaxConfigurationForm: React.FC<TaxConfigurationFormProps> = ({
  taxType,
}) => {
  const { control, setValue, trigger } = useFormContext<ChargeMasterFormData>();

  const { data: taxTreatmentOptions = [], isLoading: isLoadingTaxTreatments } =
    useGetTaxTreatmentsQuery();

  const {
    data: singleTaxMethodOptions = [],
    isLoading: isLoadingSingleTaxMethods,
  } = useGetSingleTaxMethodsQuery();

  const [triggerGLAccountSearch, { isLoading: isSearchingGLAccount }] =
    useLazySearchGLAccountsFourQuery();

  // GL Account states for each tax type
  const [selectedGLAccount, setSelectedGLAccount] =
    useState<SelectedGLAccount | null>(null);
  const [glAccountSearchTerm, setGLAccountSearchTerm] = useState("");
  const [glAccountResults, setGLAccountResults] = useState<SelectedGLAccount[]>(
    []
  );
  const [showGLAccountResults, setShowGLAccountResults] = useState(false);

  const getTaxLabel = () => {
    switch (taxType) {
      case "taxInclusive":
        return "Tax Inclusive";
      case "single":
        return "Single Tax Method";
      case "cgst":
        return "CGST";
      case "sgst":
        return "SGST";
      case "igst":
        return "IGST";
      case "cess":
        return "CESS";
      default:
        return "";
    }
  };

  const getGLAccountFieldName = ():
    | "taxConfiguration.cgstGLAccount"
    | "taxConfiguration.sgstGLAccount"
    | "taxConfiguration.igstGLAccount"
    | "taxConfiguration.cessGLAccount"
    | null => {
    switch (taxType) {
      case "cgst":
        return "taxConfiguration.cgstGLAccount";
      case "sgst":
        return "taxConfiguration.sgstGLAccount";
      case "igst":
        return "taxConfiguration.igstGLAccount";
      case "cess":
        return "taxConfiguration.cessGLAccount";
      default:
        return null;
    }
  };

  const handleGLAccountSearch = useCallback((value: string) => {
    setGLAccountSearchTerm(value);

    if (value.length < 3) {
      setSelectedGLAccount(null);
      setGLAccountResults([]);
    }
  }, []);

  const handleGLAccountSearchClick = useCallback(async () => {
    const trimmedSearchTerm = glAccountSearchTerm.trim();

    if (!trimmedSearchTerm || trimmedSearchTerm.length < 3) {
      logger.info("Please enter at least 3 characters to search", {
        toast: true,
      });
      return;
    }

    try {
      const response = await triggerGLAccountSearch(trimmedSearchTerm);
      const results = response.data;

      if (results && results.length > 0) {
        setGLAccountResults(results);
        setShowGLAccountResults(true);
      } else {
        setGLAccountResults([]);
        setShowGLAccountResults(true);
        logger.error("No GL accounts found for this search term.", {
          toast: true,
        });
      }
    } catch (error) {
      logger.error(error, { toast: true });
      setGLAccountResults([]);
      setShowGLAccountResults(false);
    }
  }, [glAccountSearchTerm, triggerGLAccountSearch]);

  const handleGLAccountSelect = useCallback(
    (option: {
      value: string;
      label: string;
      glCode: string;
      glName: string;
    }) => {
      const fieldName = getGLAccountFieldName();
      if (!fieldName) return;

      if (!option || !option.value) {
        logger.error("Invalid GL account data", { toast: true });
        return;
      }

      const selected: SelectedGLAccount = {
        identity: option.value,
        glCode: option.glCode,
        glName: option.glName,
      };

      setSelectedGLAccount(selected);
      setValue(fieldName, option.value);
      setGLAccountSearchTerm("");
      setGLAccountResults([]);
      setShowGLAccountResults(false);
      void trigger(fieldName);
    },
    [setValue, trigger]
  );

  const handleClearGLAccount = useCallback(() => {
    const fieldName = getGLAccountFieldName();
    if (!fieldName) return;

    setSelectedGLAccount(null);
    setValue(fieldName, "");
    setGLAccountSearchTerm("");
    setGLAccountResults([]);
    setShowGLAccountResults(false);
    void trigger(fieldName);
  }, [setValue, trigger]);

  return (
    <div className="grid grid-cols-2 gap-4">
      {taxType === "taxInclusive" && (
        <Form.Field label="Tax Inclusive" required>
          <Controller
            name="taxConfiguration.taxInclusive"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={field.onChange}
                placeholder="Select Tax Treatment"
                size="form"
                variant="form"
                fullWidth={true}
                itemVariant="form"
                options={taxTreatmentOptions}
                loading={isLoadingTaxTreatments}
                disabled={isLoadingTaxTreatments}
              />
            )}
          />
        </Form.Field>
      )}

      {taxType === "single" && (
        <Form.Field label="Single Tax Method" required>
          <Controller
            name="taxConfiguration.singleTaxMethodValue"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={field.onChange}
                placeholder="Select Single Tax Method"
                size="form"
                variant="form"
                fullWidth={true}
                itemVariant="form"
                options={singleTaxMethodOptions}
                loading={isLoadingSingleTaxMethods}
                disabled={isLoadingSingleTaxMethods}
              />
            )}
          />
        </Form.Field>
      )}

      {(taxType === "cgst" ||
        taxType === "sgst" ||
        taxType === "igst" ||
        taxType === "cess") && (
        <>
          <Form.Field label={`${getTaxLabel()} Percentage`} required>
            <Controller
              name={`taxConfiguration.${taxType}Percentage` as const}
              control={control}
              render={({ field }) => (
                <Input
                  value={field.value || ""}
                  onChange={field.onChange}
                  placeholder="Enter Percentage"
                  size="form"
                  variant="form"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                />
              )}
            />
          </Form.Field>

          <Form.Field label={`${getTaxLabel()} GL Account`} required>
            <InputWithSearch
              placeholder="Search GL Account"
              size="form"
              variant="form"
              value={
                selectedGLAccount
                  ? `${selectedGLAccount.glName} - ${selectedGLAccount.glCode}`
                  : glAccountSearchTerm
              }
              onChange={e => {
                const value = e.target.value;
                const expectedValue = selectedGLAccount
                  ? `${selectedGLAccount.glName} - ${selectedGLAccount.glCode}`
                  : "";

                if (selectedGLAccount && value !== expectedValue) {
                  setSelectedGLAccount(null);
                  const fieldName = getGLAccountFieldName();
                  if (fieldName) {
                    setValue(fieldName, "");
                    void trigger(fieldName);
                  }
                }
                handleGLAccountSearch(value);
              }}
              onDoubleClick={() => {
                if (selectedGLAccount) {
                  handleClearGLAccount();
                }
              }}
              onKeyDown={e => {
                if (e.key === "Escape" && selectedGLAccount) {
                  handleClearGLAccount();
                }
              }}
              onSearch={handleGLAccountSearchClick}
              isSearching={isSearchingGLAccount}
              showDropdown={showGLAccountResults}
              onClose={() => setShowGLAccountResults(false)}
              dropdownOptions={glAccountResults.map(account => ({
                value: account.identity,
                label: `${account.glName} - ${account.glCode}`,
                glCode: account.glCode,
                glName: account.glName,
              }))}
              onOptionSelect={
                handleGLAccountSelect as (option: unknown) => void
              }
              dropdownLoading={isSearchingGLAccount}
            />
          </Form.Field>
        </>
      )}
    </div>
  );
};
