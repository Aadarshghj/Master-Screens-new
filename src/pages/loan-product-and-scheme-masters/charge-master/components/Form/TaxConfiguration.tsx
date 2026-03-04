import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { TaxSwitchSection } from "./TaxSwitchSection";
import { Flex, HeaderWrapper, TitleHeader } from "@/components";
import type { ChargeMasterFormData } from "@/types/loan-product-and-scheme-masters/charge-master.types";

export const TaxConfiguration: React.FC = () => {
  const { control, watch } = useFormContext<ChargeMasterFormData>();

  const ifTaxApplicable = watch("taxConfiguration.ifTaxApplicable");
  const singleTaxMethod = watch("taxConfiguration.singleTaxMethod");

  // Other tax toggles should be disabled when:
  // 1. ifTaxApplicable is false, OR
  // 2. singleTaxMethod is true
  const otherTaxesDisabled = !ifTaxApplicable || singleTaxMethod;

  return (
    <div className="rounded-sm border border-cyan-600 bg-white p-6">
      <Flex justify="between" align="center" className="mb-6 w-full">
        <HeaderWrapper>
          <TitleHeader title="Tax Configuration" />
        </HeaderWrapper>
      </Flex>

      <div className="space-y-6">
        {/* First Row: If Tax Applicable & Single Tax Method */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Controller
            name="taxConfiguration.ifTaxApplicable"
            control={control}
            render={({ field }) => (
              <TaxSwitchSection
                id="ifTaxApplicable"
                label="If Tax Applicable"
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={false}
                taxType="taxInclusive" // ADD THIS
                showForm={true} // CHANGE TO true
              />
            )}
          />

          <Controller
            name="taxConfiguration.singleTaxMethod"
            control={control}
            render={({ field }) => (
              <TaxSwitchSection
                id="singleTaxMethod"
                label="Single Tax Method"
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={!ifTaxApplicable}
                taxType="single"
                showForm={true}
                // disabledReason={
                //   !ifTaxApplicable
                //     ? "Enable 'If Tax Applicable' to configure this option"
                //     : undefined
                // }
              />
            )}
          />
        </div>

        {/* Second Row: CGST Applicable & SGST Applicable */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Controller
            name="taxConfiguration.cgstApplicable"
            control={control}
            render={({ field }) => (
              <TaxSwitchSection
                id="cgstApplicable"
                label="CGST Applicable"
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={otherTaxesDisabled}
                taxType="cgst"
                showForm={true}
              />
            )}
          />

          <Controller
            name="taxConfiguration.sgstApplicable"
            control={control}
            render={({ field }) => (
              <TaxSwitchSection
                id="sgstApplicable"
                label="SGST Applicable"
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={otherTaxesDisabled}
                taxType="sgst"
                showForm={true}
              />
            )}
          />
        </div>

        {/* Third Row: IGST Applicable & CESS Applicable */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Controller
            name="taxConfiguration.igstApplicable"
            control={control}
            render={({ field }) => (
              <TaxSwitchSection
                id="igstApplicable"
                label="IGST Applicable"
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={otherTaxesDisabled}
                taxType="igst"
                showForm={true}
              />
            )}
          />

          <Controller
            name="taxConfiguration.cessApplicable"
            control={control}
            render={({ field }) => (
              <TaxSwitchSection
                id="cessApplicable"
                label="CESS Applicable"
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={otherTaxesDisabled}
                taxType="cess"
                showForm={true}
              />
            )}
          />
        </div>
      </div>
    </div>
  );
};
