
import React, { useState } from "react"
import { Check, File, Plus, RefreshCw, Send, Upload } from "lucide-react"
import { Controller, type Control, type FieldErrors, useWatch } from "react-hook-form"

import { FormContainer } from "@/components/ui/form-container"
import { Form, Textarea } from "@/components"
import { Flex, Input, InputWithSearch, Select } from "@/components/ui"
import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button"

import { EMPANELMENT_TYPE_OPTIONS } from "@/mocks/asset-management-system/supplier-empanelment"
import { EmpanelmentItemsTable } from "../Table/SupplierEmpanelItemTable"
import { SupplierSearchModal } from "../Modal/SearchModal"

import type {
  supplierEmpanelmentForm,
  empanelItem,
  SupplierSearchResult
} from "@/types/asset-management-system/supplier-empanelment"

interface EmpanelItemsTableState {
  tableData: empanelItem[]
  ITEM_OPTIONS: { label: string; value: string }[]
  MODEL_OPTIONS: { label: string; value: string }[]
  addRow: () => void
  removeRow: (index: number) => void
  updateRow: (
    index: number,
    field: keyof empanelItem,
    value: string | number
  ) => void
  resetTable: () => void
}

interface SupplierEmpanelmentFormProps {
  control: Control<supplierEmpanelmentForm>
  errors: FieldErrors<supplierEmpanelmentForm>
  isSubmitting: boolean
  onSubmit: () => void
  onReset: () => void
  openSearchModal: () => void
  closeSearchModal: () => void
  isSearchModalOpen: boolean
  handleSupplierSelect: (supplier: SupplierSearchResult) => void
  empanelItemsTable: EmpanelItemsTableState
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
  handleSupplierSelect,
  empanelItemsTable
}) => {

  const [dragActive, setDragActive] = useState(false)

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
              <Form.Field label="Empanelment Date" required >
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
              <Form.Field label="Empanelled By" required >
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
              <Form.Field label="Description" required >
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
              <Form.Field label="Valid Upto Date" required >
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
              <Form.Field label="Supplier Name" required error={errors.supplierNameSearch}>
                <Controller
                  control={control}
                  name="supplierNameSearch"
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
              <Form.Field label="Registration Number" required >
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
              <Form.Field label="Email" required >
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
              <Form.Field label="Contact" required >
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
            <Form.Col lg={2}>
              <Form.Field label="Empanelment Type" required >
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

          {empanelmentType === "RATEWISE" && (
            <EmpanelmentItemsTable {...empanelItemsTable} />
          )}

        </section>


        <section className="border rounded-lg p-5">

          <Form.Row className="mb-3 items-center">

            <Form.Col lg={7}>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold">Terms & Conditions</h3>
                <button
                  type="button"
                  className="w-6 h-6 flex items-center justify-center rounded-md bg-blue-700 text-white"
                >
                  <Plus size={15} />
                </button>
              </div>
            </Form.Col>

            <Form.Col lg={5}>
              <h3 className="text-sm font-semibold">Authorization Document</h3>
            </Form.Col>

          </Form.Row>


          <Form.Row>

            <Form.Col lg={7}>
              <Form.Field error={errors.termsAndConditions}>
                <Controller
                  control={control}
                  name="termsAndConditions"
                  render={({ field }) => (
                    <Textarea {...field} rows={6}  size="form" variant="form" />
                  )}
                />
              </Form.Field>
            </Form.Col>


            <Form.Col lg={5}>
              <Form.Field >
                <Controller
                  control={control}
                  name="document"
                  render={({ field }) => (

                    <div className="w-full">

                      <div
                        className={`border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center text-center cursor-pointer transition
                        ${dragActive ? "border-primary bg-blue-50" : "border-blue-300"}`}
                        onDragOver={(e) => {
                          e.preventDefault()
                          setDragActive(true)
                        }}
                        onDragLeave={() => setDragActive(false)}
                        onDrop={(e) => {
                          e.preventDefault()
                          setDragActive(false)
                          const file = e.dataTransfer.files[0]
                          if (file) field.onChange(file)
                        }}
                      >

                        <input
                          type="file"
                          className="hidden"
                          id="documentUpload"
                          onChange={(e) => field.onChange(e.target.files?.[0] || null)}
                        />

                        <label
                          htmlFor="documentUpload"
                          className="flex flex-col items-center gap-1 cursor-pointer"
                        >

                          <div className="w-8 h-8 flex items-center justify-center bg-blue-700 text-white rounded-md">
                            <Upload size={16} />
                          </div>

                          <p className="text-sm text-gray-600">
                            Drag and drop files or <span className="text-primary">browse</span>
                          </p>

                          <p className="text-xs text-gray-400">
                            PDF, DOC · Max 2MB
                          </p>

                        </label>

                      </div>


                      {field.value && (

                        <div className="mt-3 flex items-center justify-between bg-primary text-white px-3 py-2 rounded-md text-sm">

                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 flex items-center justify-center bg-blue-600 text-white rounded-md">
                              <File size={16} />
                            </div>
                            <span>{field.value.name}</span>
                          </div>

                          <button
                            type="button"
                            onClick={() => field.onChange(null)}
                            className="hexagon bg-white text-primary flex items-center justify-center w-7 h-7"
                          >
                            <Check size={16} />
                          </button>

                        </div>

                      )}

                    </div>

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
            onClick={() => {
              onReset()
              empanelItemsTable.resetTable()
            }}
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

