import React from "react"
import { RefreshCw, Send } from "lucide-react"
import { Controller, type Control, type FieldErrors, useWatch } from "react-hook-form"

import { FormContainer } from "@/components/ui/form-container"
import { Form, Textarea } from "@/components"
import { Flex, Input, Select } from "@/components/ui"
import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button"

import { EMPANELMENT_TYPE_OPTIONS } from "../../constants/SupplierEmpanelmentDefault"
import { EmpanelmentItemsTable } from "../Table/SupplierEmpanelItemTable"

import type { supplierEmpanelmentForm } from "@/types/asset-management-system/supplier-empanelment"

interface SupplierEmpanelmentFormProps {
  control: Control<supplierEmpanelmentForm>
  errors: FieldErrors<supplierEmpanelmentForm>
  isSubmitting: boolean
  onSubmit: () => void
  onReset: () => void
}

export const SupplierEmpanelmentForm: React.FC<SupplierEmpanelmentFormProps> = ({
  control,
  errors,
  isSubmitting,
  onSubmit,
  onReset
}) => {

  const empanelmentType = useWatch({
    control,
    name: "empanelmentType"
  })

  return (
    <FormContainer className="px-0">
      <Form onSubmit={onSubmit}>
        <div className="space-y-6">

          <div>
            <Form.Row>

              <Form.Col lg={3}>
                <Form.Field label="Empanelment Date" required error={errors.empanelmentDate}>
                  <Controller
                    control={control}
                    name="empanelmentDate"
                    render={({ field }) => (
                      <Input {...field} type="date" size="form" variant="form" />
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
                      <Input {...field} placeholder="Empanelled By" size="form" variant="form" />
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
                      <Input {...field} placeholder="Description" size="form" variant="form" />
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
                      <Input {...field} type="date" size="form" variant="form" />
                    )}
                  />
                </Form.Field>
              </Form.Col>

            </Form.Row>
          </div>

          <div>

            <Form.Row>

              <Form.Col lg={4}>
                <Form.Field label="Supplier Name" required error={errors.supplierName}>
                  <Controller
                    control={control}
                    name="supplierName"
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Search and select supplier"
                        size="form"
                        variant="form"
                      />
                    )}
                  />
                </Form.Field>
              </Form.Col>

              <Form.Col lg={2}>
                <Form.Field label="Registration Number" required error={errors.registrationNumber}>
                  <Controller
                    control={control}
                    name="registrationNumber"
                    render={({ field }) => (
                      <Input {...field} size="form" variant="form" disabled />
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
                      <Input {...field} size="form" variant="form" disabled />
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
                      <Input {...field} size="form" variant="form" disabled />
                    )}
                  />
                </Form.Field>
              </Form.Col>

            </Form.Row>

            <Form.Row>

              <Form.Col lg={3}>
                <Form.Field label="Empanelment Type" required error={errors.empanelmentType}>
                  <Controller
                    control={control}
                    name="empanelmentType"
                    render={({ field }) => (
                      <Select
                        options={EMPANELMENT_TYPE_OPTIONS}
                        value={field.value}
                        onValueChange={(value) => field.onChange(value)}
                        size="form"
                        variant="form"
                      />
                    )}
                  />
                </Form.Field>
              </Form.Col>

            </Form.Row>

            {empanelmentType === "RATEWISE" && (
              <div className="mt-4">
                <EmpanelmentItemsTable />
              </div>
            )}

          </div>

          <div>

            <Form.Row>

              <Form.Col lg={6}>
                <Form.Field label="Terms & Conditions" error={errors.termsAndConditions}>
                  <Controller
                    control={control}
                    name="termsAndConditions"
                    render={({ field }) => (
                      <Textarea {...field} rows={6} size="form" variant="form" />
                    )}
                  />
                </Form.Field>
              </Form.Col>

              <Form.Col lg={6}>
                <Form.Field label="Authorization Document">
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

          </div>

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

        </div>
      </Form>
    </FormContainer>
  )
}