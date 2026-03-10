import { CircleX, RefreshCcw, Save } from "lucide-react";
import { FormContainer } from "@/components/ui/form-container";
import { Flex } from "@/components/ui";
import { Form } from "@/components";

import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button";
import { SupplierDetailsForm } from "./SupplierDetails";
//import { SupplierContactManagementForm } from "./SupplierContactManagement";
import { useSupplierInformationForm } from "../Hooks/useSupplierInformationForm";
import { CONTACT_TYPE_OPTIONS, GST_REGISTRATION_TYPE_OPTIONS, MSME_TYPE_OPTIONS, SUPPLIER_RISK_CATEGORY_OPTIONS } from "@/mocks/asset-management-system/supplier-management/supplier-information";
// import { SupplierContactManagementForm } from "./SupplierContactManagement";
export const SupplierInformationForm= () => {

  const {
  control,
  register,
  handleSubmit,
  errors,
  isSubmitting,
  onSubmit,
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
        {/* <SupplierContactManagementForm
        register={register}
        control={control}
        errors={errors}
         isEditMode={true}
         contactTypeOptions={CONTACT_TYPE_OPTIONS}
      />
     */}

          <Flex.ActionGroup className="mt-2 justify-end gap-4">
            <NeumorphicButton
              type="button"
              variant="grey"
              size="default"
              onClick={onReset}
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
