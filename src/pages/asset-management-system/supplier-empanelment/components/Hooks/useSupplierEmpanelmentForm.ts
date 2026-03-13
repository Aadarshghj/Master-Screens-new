import { useState } from "react"
import { useForm, type Resolver } from "react-hook-form"
import type { supplierEmpanelmentForm, SupplierSearchResult } from "@/types/asset-management-system/supplier-empanelment"
import { SUPPLIER_EMPANELMENT } from "../../constants/SupplierEmpanelmentDefault"
import { yupResolver } from "@hookform/resolvers/yup"
import { supplierEmpanelSchema } from "@/global/validation/asset-management-system/supplier-empanelment-validation"
import { logger } from "@/global/service"
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query"
import toast from "react-hot-toast"

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
    mode: "onChange",
    defaultValues: SUPPLIER_EMPANELMENT
  })

  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false)
  const [showTerms, setShowTerms] = useState(false)

  const onSubmit = async (data: supplierEmpanelmentForm) => {
    try {
      console.log("Empanelment Form Data", data)
      logger.info("Supplier empanelment sends for approval", { toast: true })
    } catch (error) {
      const err = error as FetchBaseQueryError;

      const message =
        typeof err?.data === "object" && err?.data !== null
          ? (err.data as { message?: string }).message
          : undefined;

      toast.error(message ?? `Failed to send`);
    }
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
    amount: ""
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