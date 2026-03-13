import React from "react"
import {

  type Control,
  type FieldErrors,
  type UseFormRegister,
} from "react-hook-form"

import { Input, } from "@/components/ui"
import { Form } from "@/components"

import type {
  AddressInfoType,

} from "@/types/asset-management-system/supplier-management/supplier-information"

interface AddressInfoProps {
  control: Control<AddressInfoType>
  errors: FieldErrors<AddressInfoType>
  register: UseFormRegister<AddressInfoType>
  isEditMode: boolean
}

export const AddressInfoForm: React.FC<AddressInfoProps> = ({
  errors,
  register,

}) => {
  return (
    <div>

      <Form.Row>
            <Form.Col lg={4} md={6} span={12}>
                 <Form.Field label="Address Line 1" required error={errors.addressLine1}>
                   <Input
                     {...register("addressLine1")}
                     placeholder="Enter Address Line 1"
                     size="form"
                     variant="form"
                   />
                 </Form.Field>
               </Form.Col>
            <Form.Col lg={4} md={6} span={12}>
                 <Form.Field label="Address Line 2" required error={errors.addressLine2}>
                   <Input
                     {...register("addressLine2")}
                     placeholder="Enter Address Line 2"
                     size="form"
                     variant="form"
                   />
                 </Form.Field>
               </Form.Col>
            <Form.Col lg={3} md={6} span={12}>
                 <Form.Field label="Pincode" required error={errors.pincode}>
                   <Input
                     {...register("pincode")}
                     placeholder="Enter pincode"
                     size="form"
                     variant="form"
                   />
                 </Form.Field>
               </Form.Col>
            <Form.Col lg={3} md={6} span={12}>
                 <Form.Field label="City" required error={errors.city}>
                   <Input
                     {...register("city")}
                     placeholder="//Auto fetch from pincode"
                     size="form"
                     variant="form"
                   />
                 </Form.Field>
               </Form.Col>
            <Form.Col lg={3} md={6} span={12}>
                 <Form.Field label="state" required error={errors.state}>
                   <Input
                     {...register("state")}
                     placeholder="//Auto fetch from pincode"
                     size="form"
                     variant="form"
                   />
                 </Form.Field>
               </Form.Col>
            <Form.Col lg={3} md={6} span={12}>
                 <Form.Field label="Country" required error={errors.country}>
                   <Input
                     {...register("country")}
                     placeholder="//Auto fetch from pincode"
                     size="form"
                     variant="form"
                   />
                 </Form.Field>
               </Form.Col>
      </Form.Row>
    </div>
  )
}