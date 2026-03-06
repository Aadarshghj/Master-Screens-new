import { useState } from "react";
import { useForm } from "react-hook-form";
import type { supplierEmpanelmentForm } from "@/types/asset-management-system/supplier-empanelment";

interface SupplierData {
  supplierName: string;
  registrationNumber: string;
  email: string;
  contact: string;
}

export function useSupplierEmpanelmentForm() {

  const {
    control,
    register,
    handleSubmit,
    setValue,
    reset,

    formState: { errors, isSubmitting }
  } = useForm<supplierEmpanelmentForm>();

  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const onSubmit = (data: supplierEmpanelmentForm) => {
    console.log("Empanelment Form Data", data);
  };

  const handleReset = () => {
    reset();
  };

  const openSearchModal = () => {
    setIsSearchModalOpen(true);
  };

  const closeSearchModal = () => {
    setIsSearchModalOpen(false);
  };

  const handleSupplierSelect = (supplier: SupplierData) => {

    setValue("supplierName", supplier.supplierName);
    setValue("registrationNumber", supplier.registrationNumber);
    setValue("email", supplier.email);
    setValue("contact", supplier.contact);

    setIsSearchModalOpen(false);
  };

  return {
    control,
    register,
    errors,
    reset,
    isSubmitting,
    handleSubmit,
    onSubmit,
    handleReset,
    openSearchModal,
    closeSearchModal,
    isSearchModalOpen,
    handleSupplierSelect
  };
}