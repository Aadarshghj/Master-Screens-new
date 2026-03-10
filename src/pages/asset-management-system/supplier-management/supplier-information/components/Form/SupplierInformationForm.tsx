import React from "react";
import { CircleX, RefreshCcw, Save } from "lucide-react";
import {
    Controller,useForm,type Control,
  type FieldErrors,
  type UseFormRegister,
} from "react-hook-form";

import { FormContainer } from "@/components/ui/form-container";
import { Flex, Input, Switch,Label } from "@/components/ui";
import { Form, Textarea } from "@/components";
import type {
  SupplierInformationType,

} from "@/types/asset-management-system/supplier-management/supplier-information";

import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button";
import { SupplierDetailsForm } from "./SupplierDetails";
//import { SupplierContactManagementForm } from "./SupplierContactManagement";
import { useSupplierInformationForm } from "../Hooks/useSupplierInformationForm";
import { GST_REGISTRATION_TYPE_OPTIONS, MSME_TYPE_OPTIONS, SUPPLIER_RISK_CATEGORY_OPTIONS } from "@/mocks/asset-management-system/supplier-management/supplier-information";
export const SupplierInformationForm= () => {

  const {
    control,
    register,
    handleSubmit,
    errors,
    isSubmitting,
    onSubmit,
    onCancel,
    onReset,
  } = useSupplierInformationForm();

  return (
   
     <FormContainer className="px-0">
      <Form onSubmit={handleSubmit(onSubmit)}>
        <SupplierDetailsForm
        register={register}
        control={control}
        errors={errors}
         isEditMode={true}
         supplierRiskCategoryOptions={SUPPLIER_RISK_CATEGORY_OPTIONS}
         gstRegistrationTypeOptions={GST_REGISTRATION_TYPE_OPTIONS}
         msmeTypeOptions={MSME_TYPE_OPTIONS}
         
      />
{/* 
      <SupplierContactManagementForm
        register={register}
        control={control}
        errors={errors}
      /> */}
    

          <Flex.ActionGroup className="mt-2 justify-end gap-4">
            <NeumorphicButton
              type="button"
              variant="grey"
              size="default"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              <CircleX className="h-3 w-3" />
              Cancel
            </NeumorphicButton>

            <NeumorphicButton
              type="button"
              variant="secondary"
              size="secondary"
              onClick={onReset}
              disabled={isSubmitting}
            >
              <RefreshCcw className="h-3 w-3" />
              Reset
            </NeumorphicButton>

            <NeumorphicButton
              type="submit"
              variant="default"
              size="default"
              disabled={isSubmitting}
            >
              <Save className="h-3 w-3" />
              {isSubmitting ? "Saving..." : "Save Supplier"}
            </NeumorphicButton>
          </Flex.ActionGroup>
        
      </Form>
    </FormContainer>
  );
};
