import React from "react"
import { Plus, RefreshCw, Send } from "lucide-react"
import { Controller, type Control, type FieldErrors, useWatch } from "react-hook-form"

import { FormContainer } from "@/components/ui/form-container"
import { Form, Textarea } from "@/components"
import { Flex, Input, InputWithSearch, Select } from "@/components/ui"
import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button"

import { EMPANELMENT_TYPE_OPTIONS } from "@/mocks/asset-management-system/supplier-empanelment"
import { EmpanelmentItemsTable } from "../Table/SupplierEmpanelItemTable"
import { SupplierSearchModal } from "../Modal/SearchModal"

import type { supplierEmpanelmentForm } from "@/types/asset-management-system/supplier-empanelment"

interface SupplierEmpanelmentFormProps {
  control: Control<supplierEmpanelmentForm>
  errors: FieldErrors<supplierEmpanelmentForm>
  isSubmitting: boolean
  onSubmit: () => void
  onReset: () => void
  openSearchModal: () => void
  closeSearchModal: () => void
  isSearchModalOpen: boolean
  handleSupplierSelect: (supplier: any) => void
}

export const SupplierEmpanelmentForm: React.FC<SupplierEmpanelmentFormProps> = ({
  control,
  errors,
  isSubmitting,
  onSubmit,
  onReset,
  openSearchModal,
  closeSearchModal,
  isSearchModalOpen,
  handleSupplierSelect
}) => {
  const empanelmentType = useWatch({
    control,
    name: "empanelmentType"
  })

  return (
    <FormContainer className="px-0">
      <Form onSubmit={onSubmit} className="space-y-6">

        <section className="border rounded-lg p-5 bg-blue-100">
          <h3 className="text-sm font-semibold mb-4">Empanelment Header</h3>

          <Form.Row>
            <Form.Col lg={3}>
              <Form.Field label="Empanelment Date" required error={errors.empanelmentDate}>
                <Controller
                  control={control}
                  name="empanelmentDate"
                  render={({ field }) => (
                    <Input {...field} type="date" size="form" variant="form" disabled />
                  )}
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={3}>
              <Form.Field label="Empanelled By" required error={errors.empanelmentBy}>
                <Controller
                  control={control}
                  name="empanelmentBy"
                  render={({ field }) => (
                    <Input {...field} size="form" variant="form" disabled placeholder="//Autofetch" />
                  )}
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={4}>
              <Form.Field label="Description" required error={errors.description}>
                <Controller
                  control={control}
                  name="description"
                  render={({ field }) => (
                    <Input {...field} size="form" variant="form" disabled placeholder="//Autofetch" />
                  )}
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={2}>
              <Form.Field label="Valid Upto Date" required error={errors.validuptoDate}>
                <Controller
                  control={control}
                  name="validuptoDate"
                  render={({ field }) => (
                    <Input {...field} type="date" size="form" variant="form" disabled />
                  )}
                />
              </Form.Field>
            </Form.Col>
          </Form.Row>
        </section>

        <section className="border rounded-lg p-5">
          <h3 className="text-sm font-semibold mb-4">Supplier Details</h3>

          <Form.Row>
            <Form.Col lg={3}>
              <Form.Field label="Supplier Name" required error={errors.supplierName}>
                <Controller
                  control={control}
                  name="supplierName"
                  render={({ field }) => (
                    <InputWithSearch
                      {...field}
                      placeholder="Search and select supplier"
                      size="form"
                      variant="form"
                      onSearch={openSearchModal}
                    />
                  )}
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={3}>
              <Form.Field label="Registration Number" required error={errors.registrationNumber}>
                <Controller
                  control={control}
                  name="registrationNumber"
                  render={({ field }) => (
                    <Input {...field} disabled size="form" variant="form" placeholder="//Autofetch" />
                  )}
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={3}>
              <Form.Field label="Email" required error={errors.email}>
                <Controller
                  control={control}
                  name="email"
                  render={({ field }) => (
                    <Input {...field} disabled size="form" variant="form" placeholder="//Autofetch" />
                  )}
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={3}>
              <Form.Field label="Contact" required error={errors.contact}>
                <Controller
                  control={control}
                  name="contact"
                  render={({ field }) => (
                    <Input {...field} disabled size="form" variant="form" placeholder="//Autofetch" />
                  )}
                />
              </Form.Field>
            </Form.Col>
          </Form.Row>

          <Form.Row>
            <Form.Col lg={2} md={6} span={12} >
                          <Form.Field label="Empanelment Type" required error={errors.empanelmentType}>
                            <Controller
                              name="empanelmentType"
                              control={control}
                              render={({ field }) => (
                                <Select
                                  value={field.value}
                                  onValueChange={field.onChange}
                                  options={EMPANELMENT_TYPE_OPTIONS}
                                  placeholder="Select"
                                  size="form"
                                  variant="form"
                                  fullWidth
                                  itemVariant="form"
                                />
                              )}
                            />
                          </Form.Field>
                        </Form.Col>
          </Form.Row>

          {empanelmentType === "RATEWISE" && <EmpanelmentItemsTable />}
        </section>

        <section className="border rounded-lg p-5">

          <Form.Row className="mb-3 items-center">
            <Form.Col lg={8}>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold">Terms & Conditions</h3>
                <button type="button" className="w-6 h-6 flex items-center justify-center rounded-md bg-blue-700 text-white">
                  <Plus size={15} />
                </button>
              </div>
            </Form.Col>

            <Form.Col lg={4}>
              <h3 className="text-sm font-semibold">Authorization Document</h3>
            </Form.Col>
          </Form.Row>

          <Form.Row>
            <Form.Col lg={8}>
              <Form.Field error={errors.termsAndConditions}>
                <Controller
                  control={control}
                  name="termsAndConditions"
                  render={({ field }) => (
                    <Textarea {...field} rows={6} size="form" variant="form" />
                  )}
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={4}>
              <Form.Field>
                <Controller
                  control={control}
                  name="document"
                  render={({ field }) => (
                    <Input
                      type="file"
                      onChange={(e) => field.onChange(e.target.files?.[0])}
                      size="form"
                      variant="form"
                    />
                  )}
                />
              </Form.Field>
            </Form.Col>
          </Form.Row>
        </section>

        <Flex.ActionGroup className="justify-end gap-4">
          <NeumorphicButton
            type="button"
            variant="secondary"
            size="secondary"
            onClick={onReset}
            disabled={isSubmitting}
          >
            <RefreshCw width={12} />
            Reset
          </NeumorphicButton>

          <NeumorphicButton
            type="submit"
            variant="default"
            size="default"
            disabled={isSubmitting}
          >
            <Send width={13} />
            Send for Approval
          </NeumorphicButton>
        </Flex.ActionGroup>

      </Form>

      <SupplierSearchModal
        isOpen={isSearchModalOpen}
        onClose={closeSearchModal}
        onSelect={handleSupplierSelect}
      />

    </FormContainer>
  )
}