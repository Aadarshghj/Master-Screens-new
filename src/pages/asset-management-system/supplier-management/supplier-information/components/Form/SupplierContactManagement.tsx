import React from "react"
import { Controller, useForm } from "react-hook-form"

import { Flex, Input, Switch, Label, Select } from "@/components/ui"
import { Form } from "@/components"
import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button"

import type {
  SupplierContactManagementType,
  Option,
} from "@/types/asset-management-system/supplier-management/supplier-information"

import { DEFAULT_CONTACT } from "../../constants/SupplierInformation"
import { PlusCircle } from "lucide-react"

interface SupplierContactManagementProps {
  contactTypeOptions: Option[]
  setContacts: React.Dispatch<
    React.SetStateAction<SupplierContactManagementType[]>
  >
}

export const SupplierContactManagementForm: React.FC<
  SupplierContactManagementProps
> = ({ contactTypeOptions, setContacts }) => {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SupplierContactManagementType>({
    defaultValues: DEFAULT_CONTACT,
  })

  const onSubmit = (data: SupplierContactManagementType) => {
    setContacts(prev => [...prev, data])
    reset(DEFAULT_CONTACT)
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>

      <Form.Row>
        <Form.Col lg={3} md={6} span={12}>
          <Form.Field label="Contact Type" required error={errors.contactType}>
            <Controller
              name="contactType"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  options={contactTypeOptions}
                  placeholder="Select Contact Type"
                  size="form"
                  variant="form"
                  fullWidth
                  itemVariant="form"
                />
              )}
            />
          </Form.Field>
        </Form.Col>

        <Form.Col lg={3} md={6} span={12}>
          <Form.Field
            label="Contact Value"
            required
            error={errors.contactValue}
          >
            <Input
              {...register("contactValue")}
              placeholder="Enter phone number or email"
              size="form"
              variant="form"
            />
          </Form.Field>
        </Form.Col>

        <Form.Col lg={2} md={6} span={12} className="ml-12">
          <Flex direction="col" gap={1} style={{ paddingTop: 22 }}>
            <Flex align="center" gap={2}>
              <Controller
                control={control}
                name="isActive"
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <Label>Active</Label>
            </Flex>
          </Flex>
        </Form.Col>

        <Form.Col lg={3} md={6} span={12}>
          <Flex direction="col" gap={1} style={{ paddingTop: 22 }}>
            <Flex align="center" gap={2}>
              <Controller
                control={control}
                name="isPrimary"
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <Label>Primary</Label>
            </Flex>
          </Flex>
        </Form.Col>


      <Flex.ActionGroup className="mt-3 justify-end">
        <NeumorphicButton type="submit" variant="default">
          <PlusCircle className="mr-1 h-3 w-3" />
          Save Contact
        </NeumorphicButton>
      </Flex.ActionGroup>
      </Form.Row>
    </Form>
  )
}