import { useState } from "react"
import { CircleX, PlusCircle, RefreshCcw, Save } from "lucide-react"

import { FormContainer } from "@/components/ui/form-container"
import { Form, Flex } from "@/components"

import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button"

import { SupplierDetailsForm } from "./SupplierDetails"
import { SupplierContactManagementForm } from "./SupplierContactManagement"
import { SupplierContactManagementTable } from "../Table/SupplierContactManagementTable"
import { SupplierAssetGroupForm } from "./SupplierAssetGroup"
import { SupplierAssetGroupTable } from "../Table/SupplierAssetGroupTable"
import { AddressInfoForm } from "./AddressInfoForm"
import { BankInfoForm } from "./BankInfoForm"

import { useSupplierInformationForm } from "../Hooks/useSupplierInformationForm"

import {
  CONTACT_TYPE_OPTIONS,
  ASSET_GROUP_OPTIONS,
  GST_REGISTRATION_TYPE_OPTIONS,
  MSME_TYPE_OPTIONS,
  SUPPLIER_RISK_CATEGORY_OPTIONS,
  TDS_SECTION_OPTIONS,
  BANK_NAME_OPTIONS
} from "@/mocks/asset-management-system/supplier-management/supplier-information"

export const SupplierInformationForm = () => {

  const {
    supplierForm,
    addressForm,
    bankForm,
    contacts,
    setContacts,
    assetGroups,
    setAssetGroups,
    onSubmit,
    onReset,
  } = useSupplierInformationForm()


  return (

    <FormContainer className="px-0">

      <Form onSubmit={supplierForm.handleSubmit(onSubmit)}>

        <SupplierDetailsForm
          control={supplierForm.control}
          register={supplierForm.register}
          errors={supplierForm.formState.errors}
          isEditMode={true}
          supplierRiskCategoryOptions={SUPPLIER_RISK_CATEGORY_OPTIONS}
          gstRegistrationTypeOptions={GST_REGISTRATION_TYPE_OPTIONS}
          msmeTypeOptions={MSME_TYPE_OPTIONS}
        />

        {/* CONTACT SECTION */}

        <Flex justify="between" align="center" className="mt-6">
         <h3 className="text-xs font-semibold mb-2">
                 Supplier Contact Management
               </h3>

         
        </Flex>

        
  
  <SupplierContactManagementForm
    contactTypeOptions={CONTACT_TYPE_OPTIONS}
    setContacts={setContacts}
   
  />



        <SupplierContactManagementTable data={contacts} />

        {/* ASSET GROUP */}

        <Flex justify="between" align="center" className="mt-6">
      <h3 className="text-xs font-semibold mb-2">Supplier Asset Group</h3>

          
        </Flex>

      <SupplierAssetGroupForm
  assetGroupOptions={ASSET_GROUP_OPTIONS}
  setAssetGroups={setAssetGroups}
/>

        <SupplierAssetGroupTable data={assetGroups} />

        {/* ADDRESS */}

        <h3 className="text-xs font-semibold mb-2 mt-10">Address Info</h3>


        <AddressInfoForm
          control={addressForm.control}
          register={addressForm.register}
          errors={addressForm.formState.errors}
          isEditMode={true}
        />

        {/* BANK */}

        <h3 className="text-xs font-semibold mb-2 mt-10">Bank Info</h3>


        <BankInfoForm
          control={bankForm.control}
          register={bankForm.register}
          errors={bankForm.formState.errors}
          tdsSectionOptions={TDS_SECTION_OPTIONS}
          bankNameOptions={BANK_NAME_OPTIONS}
          isEditMode={true}
          getValues={bankForm.getValues}
        />

        {/* ACTION BUTTONS */}

        <Flex.ActionGroup className="mt-4 justify-end gap-4">

          <NeumorphicButton
            type="button"
            variant="grey"
            onClick={onReset}
          >
            <CircleX className="h-3 w-3" />
            Cancel
          </NeumorphicButton>

          <NeumorphicButton
            type="button"
            variant="secondary"
            onClick={onReset}
          >
            <RefreshCcw className="h-3 w-3" />
            Reset
          </NeumorphicButton>

          <NeumorphicButton
            type="submit"
            variant="default"
          >
            <Save className="h-3 w-3" />
            Save Supplier
          </NeumorphicButton>

        </Flex.ActionGroup>

      </Form>

    </FormContainer>
  )
}