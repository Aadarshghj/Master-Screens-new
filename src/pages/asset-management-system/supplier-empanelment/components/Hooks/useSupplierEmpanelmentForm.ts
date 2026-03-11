import { useState } from "react"
import { useForm, type Resolver } from "react-hook-form"
import type {  supplierEmpanelmentForm, SupplierSearchResult } from "@/types/asset-management-system/supplier-empanelment"
import { SUPPLIER_EMPANELMENT } from "../../constants/SupplierEmpanelmentDefault"
import { yupResolver } from "@hookform/resolvers/yup"
import { supplierEmpanelSchema } from "@/global/validation/asset-management-system/supplier-empanelment-validation"

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
    resolver: yupResolver(supplierEmpanelSchema) as Resolver<supplierEmpanelmentForm>,
    mode:"onChange",
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

  empanelItems: [],
   amount:""
}
  const onReset = () => {
    reset(SUPPLIER_EMPANELMENT)
    setValue("document", null)

  }

  const openSearchModal = () => setIsSearchModalOpen(true)
  const closeSearchModal = () => setIsSearchModalOpen(false)

 const handleSupplierSelect = (supplier: SupplierSearchResult) => {

  setValue("supplierNameSearch", supplier.supplierName)

  setValue("registrationNumber", supplier.msmeRegistrationNo)

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