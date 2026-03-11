import { useState } from "react"
import { useForm } from "react-hook-form"
import type {  supplierEmpanelmentForm, SupplierSearchResult } from "@/types/asset-management-system/supplier-empanelment"
import { SUPPLIER_EMPANELMENT } from "../../constants/SupplierEmpanelmentDefault"

export function useSupplierEmpanelmentForm() {
  const {
    control,
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<supplierEmpanelmentForm>({
    defaultValues: SUPPLIER_EMPANELMENT
  })

  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false)
  const [showTerms, setShowTerms] = useState(false)

  const onSubmit = (data: supplierEmpanelmentForm) => {
    console.log("Empanelment Form Data", data)
  }
const defaultValues: supplierEmpanelmentForm = {
  empanelmentDate: "",
  empanelmentBy: "",
  description: "",
  validuptoDate: "",

  supplierNameSearch: "",
  registrationNumber: "",
  email: "",
  contact: "",
  empanelmentType: "",

  termsAndConditions: "",
  document: null,

  empanelItems: []
}
  const onReset = () => {
    reset(SUPPLIER_EMPANELMENT)
    setValue("document", null)

  }

  const openSearchModal = () => setIsSearchModalOpen(true)
  const closeSearchModal = () => setIsSearchModalOpen(false)

 const handleSupplierSelect = (supplier: SupplierSearchResult) => {

  setValue("supplierNameSearch", supplier.supplierName)

  setValue("registrationNumber", supplier.gstNumber)

  setValue("email", "")

  setValue("contact", "")

  closeSearchModal()
}

  const empanelmentType = watch("empanelmentType")

  return {
    control,
    register,
    errors,
    isSubmitting,
    handleSubmit,
    onSubmit,
    onReset,
    reset,
    defaultValues,
    openSearchModal,
    closeSearchModal,
    isSearchModalOpen,
    handleSupplierSelect,
    showTerms,
    setShowTerms,
    empanelmentType
  }
}