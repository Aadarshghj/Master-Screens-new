import { useForm } from "react-hook-form"
import { useState } from "react"

import type {
  SupplierInformationType,
  SupplierContactManagementType,
  SupplierAssetGroupType,
  AddressInfoType,
  BankInfoType
} from "@/types/asset-management-system/supplier-management/supplier-information"

import {
  DEFAULT_SUPPLIER_DETAILS,
  DEFAULT_CONTACT,
  DEFAULT_ASSET_GROUP,
  DEFAULT_ADDRESS,
  DEFAULT_BANK
} from "../../constants/SupplierInformation"

export const useSupplierInformationForm = () => {

  const {
    control,
    register,
    handleSubmit,
    reset,
    
    formState: { errors, isSubmitting }
  } = useForm<SupplierInformationType>({
    defaultValues: DEFAULT_SUPPLIER_DETAILS
  })

  const {
    control: addressControl,
    register: addressRegister
  } = useForm<AddressInfoType>({
    defaultValues: DEFAULT_ADDRESS
  })

  const {
    control: bankControl,
    register: bankRegister
  } = useForm<BankInfoType>({
    defaultValues: DEFAULT_BANK
  })
 

  const [contacts, setContacts] = useState<SupplierContactManagementType[]>([])
  const [assetGroups, setAssetGroups] = useState<SupplierAssetGroupType[]>([])

  const onSubmit = (data: SupplierInformationType) => {
    console.log("Supplier Details", data)
    console.log("Contacts", contacts)
    console.log("Asset Groups", assetGroups)
  }

  const onReset = () => {
    reset(DEFAULT_SUPPLIER_DETAILS)
    setContacts([])
    setAssetGroups([])
  }

  return {
    control,
    register,
    handleSubmit,
    errors,
    isSubmitting,
    onSubmit,
    onReset,
    

    addressControl,
    addressRegister,

    bankControl,
    bankRegister,

    contacts,
    setContacts,

    assetGroups,
    setAssetGroups
  }
}