import { useForm } from "react-hook-form"
import { useState } from "react"

import type {
  SupplierInformationType,
    AddressInfoType,
  BankInfoType,
  SupplierContactManagementType,
  SupplierAssetGroupType,

} from "@/types/asset-management-system/supplier-management/supplier-information"

import {
  DEFAULT_SUPPLIER_DETAILS,
  DEFAULT_ADDRESS,
  DEFAULT_BANK
} from "../../constants/SupplierInformation"

export const useSupplierInformationForm = () => {

  const supplierForm = useForm<SupplierInformationType>({
    defaultValues: DEFAULT_SUPPLIER_DETAILS
  })
  const [contacts, setContacts] = useState<SupplierContactManagementType[]>([])
  const [assetGroups, setAssetGroups] = useState<SupplierAssetGroupType[]>([])
 
  const addressForm = useForm<AddressInfoType>({
    defaultValues: DEFAULT_ADDRESS
  })

  const bankForm = useForm<BankInfoType>({
    defaultValues: DEFAULT_BANK
  })



  const onSubmit = (supplierData: SupplierInformationType) => {

    const payload = {
      supplierDetails: supplierData,
      contacts,
      assetGroups,
      address: addressForm.getValues(),
      bank: bankForm.getValues(),
      
    }

    console.log("Supplier Payload", payload)
  }

  const onReset = () => {
    supplierForm.reset(DEFAULT_SUPPLIER_DETAILS)
        setContacts([])
    setAssetGroups([])
    addressForm.reset(DEFAULT_ADDRESS)
    bankForm.reset(DEFAULT_BANK)

  }

  return {

    supplierForm,
    contacts,
    setContacts,
    assetGroups,
    setAssetGroups,
    addressForm,
    bankForm,
    onSubmit,
    onReset
  }
}