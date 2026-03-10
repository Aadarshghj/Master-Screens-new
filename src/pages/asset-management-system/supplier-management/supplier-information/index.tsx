import React, { useState } from "react"
import { useForm } from "react-hook-form"

import { FormContainer } from "@/components/ui/form-container"
import { Form, Flex } from "@/components"
import {
  DEFAULT_SUPPLIER_DETAILS,
  DEFAULT_CONTACT,
  DEFAULT_ASSET_GROUP,
  DEFAULT_ADDRESS,
  DEFAULT_BANK,
} from "./constants/SupplierInformation"

import type {
  SupplierInformationType,
  SupplierContactManagementType,
  Option,
  SupplierAssetGroupType,
  AddressInfoType,
  BankInfoType,
} from "@/types/asset-management-system/supplier-management/supplier-information"

import { SupplierInformationForm } from "./components/Form/SupplierInformationForm"
import { SupplierContactManagementForm } from "./components/Form/SupplierContactManagement"
import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button"
import { SupplierContactManagementTable } from "./components/Table/SupplierContactManagementTable"
import { SupplierAssetGroupForm } from "./components/Form/SupplierAssetGroup"
import { SupplierAssetGroupTable } from "./components/Table/SupplierAssetGroupTable"
import { AddressInfoForm } from "./components/Form/AddressInfoForm"
import { BankInfoForm } from "./components/Form/BankInfoForm"

const CONTACT_TYPE_OPTIONS: Option[] = [
  { label: "Mobile", value: "MOBILE" },
  { label: "Phone", value: "PHONE" },
  { label: "Email", value: "EMAIL" },
]
const ASSET_GROUP_OPTIONS: Option[] = [
  { label: "Mobile", value: "MOBILE" },
  { label: "Phone", value: "PHONE" },
  { label: "Email", value: "EMAIL" },
]

export const SupplierInformationPage: React.FC = () => {
  const [contacts, setContacts] = useState<SupplierContactManagementType[]>([])
  const [assetGroup, setAssetGroup] = useState<SupplierAssetGroupType[]>([])
const [addressInfo, setAddressInfo] = useState<AddressInfoType | null>(null) 
const [bankInfo, setBankInfo] = useState<BankInfoType | null>(null) 
 const [showContactForm, setShowContactForm] = useState(false)
  const [showAssetGroupForm, setShowAssetGroupForm] = useState(false)


  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SupplierInformationType>({
    defaultValues: DEFAULT_SUPPLIER_DETAILS,
  })

 
  const {
    control: contactControl,
    register: contactRegister,
    handleSubmit: contactSubmit,
    reset: contactReset,
    formState: { errors: contactErrors },
  } = useForm<SupplierContactManagementType>({
    defaultValues: DEFAULT_CONTACT,
  })
  const {
    control: assetGroupControl,
    register: assetGroupRegister,
    handleSubmit: assetGroupSubmit,
    reset: assetGroupReset,
    formState: { errors: assetGroupErrors },
  } = useForm<SupplierAssetGroupType>({
    defaultValues: DEFAULT_ASSET_GROUP,
  })
  const {
    control: addressInfoControl,
    register: addressInfoRegister,
    formState: { errors: addressInfoErrors },
  } = useForm<AddressInfoType>({
    defaultValues: DEFAULT_ADDRESS,
  })
  const {
    control: bankInfoControl,
    register: bankInfoRegister,
    formState: { errors: bankInfoErrors },
  } = useForm<BankInfoType>({
    defaultValues: DEFAULT_BANK,
  })


  const onSubmitSupplier = (data: SupplierInformationType) => {
    const payload = {
      ...data,
      contacts,
      assetGroup,
      addressInfo,
      bankInfo
    }

    console.log("Supplier Payload:", payload)
  }

  /* ---------------- Add Contact ---------------- */

  const onSubmitContact = (data: SupplierContactManagementType) => {
    setContacts(prev => [...prev, data])

    contactReset(DEFAULT_CONTACT)
    setShowContactForm(false)
  }
  const onSubmitAssetGroup = (data: SupplierAssetGroupType) => {
    setAssetGroup(prev => [...prev, data])

    assetGroupReset(DEFAULT_ASSET_GROUP)
    setShowAssetGroupForm(false)
  }
  const onSubmitAddressInfo = (data: AddressInfoType) => {
  setAddressInfo(data)
}

  return (
    <FormContainer>
  <h2 className="text-lg font-semibold mb-4">
    Supplier Information
  </h2>
      {/* ---------------- Supplier Form ---------------- */}

      <form onSubmit={handleSubmit(onSubmitSupplier)}>
        <SupplierInformationForm
          control={control}
          register={register}
          errors={errors}
          isEditMode={true}
        />

        {/* ---------------- Contact Section ---------------- */}

        <Flex justify="between" align="center" style={{ marginTop: 20 }}>
          <h3 className="text-sm font-semibold">Contact Management</h3>

          <NeumorphicButton
            type="button"
            onClick={() => setShowContactForm(true)}
          >
            Add Contact
          </NeumorphicButton>
        </Flex>

        {/* ---------------- Contact Form ---------------- */}

        {showContactForm && (
          <form onSubmit={contactSubmit(onSubmitContact)}>
            <SupplierContactManagementForm
              control={contactControl}
              register={contactRegister}
              errors={contactErrors}
              isEditMode={true}
              contactTypeOptions={CONTACT_TYPE_OPTIONS}
            />

          </form>
        )}


        <SupplierContactManagementTable />

<Flex justify="between" align="center" style={{ marginTop: 20 }}>
          <h3 className="text-sm font-semibold">Supplier Asset Group</h3>

          <NeumorphicButton
            type="button"
            onClick={() => setShowAssetGroupForm(true)}
          >
            Add Asset Group
          </NeumorphicButton>
        </Flex>


        {showAssetGroupForm && (
          <form onSubmit={assetGroupSubmit(onSubmitAssetGroup)}>
            <SupplierAssetGroupForm
              control={assetGroupControl}
              register={assetGroupRegister}
              errors={assetGroupErrors}
              isEditMode={true}
              assetGroupOptions={ASSET_GROUP_OPTIONS}
            />

          </form>
        )}
        <SupplierAssetGroupTable/>
        {/* ---------------- Address Information ---------------- */}

<h3 className="text-sm font-semibold mt-6 mb-2">
  Address Information
</h3>

<AddressInfoForm
  control={addressInfoControl}
  register={addressInfoRegister}
  errors={addressInfoErrors}
  isEditMode={true}
/>
<h3 className="text-sm font-semibold mt-6 mb-2">
Bank Info
</h3>

<BankInfoForm
  control={bankInfoControl}
  register={bankInfoRegister}
  errors={bankInfoErrors}
  isEditMode={true}
  bankInfoOptions={DEFAULT_BANK}
/>
        

       
      </form>
    </FormContainer>
  )
}

export default SupplierInformationPage