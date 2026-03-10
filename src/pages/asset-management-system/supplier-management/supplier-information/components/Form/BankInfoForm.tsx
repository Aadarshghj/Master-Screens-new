import React from "react"
import {
  Controller,
  type Control,
  type FieldErrors,
  type UseFormRegister,
} from "react-hook-form"

import { Flex, Input, Switch, Label, Select } from "@/components/ui"
import { Form } from "@/components"

import type {
  
  BankInfoType,

} from "@/types/asset-management-system/supplier-management/supplier-information"

interface BankInfoProps {
  control: Control<BankInfoType>
  errors: FieldErrors<BankInfoType>
  register: UseFormRegister<BankInfoType>
  isEditMode: boolean
  tdsSectionOptions:Option[]
}

export const BankInfoForm: React.FC<BankInfoProps> = ({
  errors,
  register,
  isEditMode,
  control,
  tdsSectionOptions
}) => {
  return (
    <div>
      <h3 className="text-xs font-semibold mb-2">Bank Info</h3>

      <Form.Row>
            <Form.Col lg={2} md={6} span={12}>
                 <Form.Field label="Bank Name" required error={errors.bankName}>
                   <Input
                     {...register("bankName")}
                     placeholder="Enter Bank Name"
                     size="form"
                     variant="form"
                   />
                 </Form.Field>
               </Form.Col>
           
            <Form.Col lg={2} md={6} span={12}>
                 <Form.Field label="Branch Name" required error={errors.branchName}>
                   <Input
                     {...register("branchName")}
                     placeholder="Enter Branch Name"
                     size="form"
                     variant="form"
                   />
                 </Form.Field>
               </Form.Col>
            <Form.Col lg={2} md={6} span={12}>
                 <Form.Field label="Account Holder Name" required error={errors.accountHolderName}>
                   <Input
                     {...register("accountHolderName")}
                     placeholder="Enter account holder name"
                     size="form"
                     variant="form"
                   />
                 </Form.Field>
               </Form.Col>
            <Form.Col lg={2} md={6} span={12}>
                 <Form.Field label="Account Number" required error={errors.accountNumber}>
                   <Input
                     {...register("accountNumber")}
                     placeholder="Enter Account Number"
                     size="form"
                     variant="form"
                   />
                 </Form.Field>
               </Form.Col>
            <Form.Col lg={2} md={6} span={12}>
                 <Form.Field label="Confirm Account Number" required error={errors.confirmAccountNumber}>
                   <Input
                     {...register("confirmAccountNumber")}
                     placeholder="Confirm Account Number"
                     size="form"
                     variant="form"
                   />
                 </Form.Field>
               </Form.Col>
            <Form.Col lg={2} md={6} span={12}>
                 <Form.Field label="IFSC Code" required error={errors.ifscCode}>
                   <Input
                     {...register("ifscCode")}
                     placeholder="Enter IFSC Code"
                     size="form"
                     variant="form"
                   />
                 </Form.Field>
               </Form.Col>
            <Form.Col lg={2} md={6} span={12}>
                 <Form.Field label="Default GST Rate" required error={errors.defaultGstRate}>
                   <Input
                     {...register("defaultGstRate")}
                     placeholder="Enter Default GST Rate"
                     size="form"
                     variant="form"
                   />
                 </Form.Field>
               </Form.Col>
                <Form.Col lg={2} md={6} span={12}>
                         <Flex direction="col" gap={1} style={{ paddingTop: 22 }}>
                           <Flex align="center" gap={2}>
                             <Controller
                               control={control}
                               name="isTds"
                               render={({ field }) => (
                                 <Switch
                                   checked={field.value}
                                   onCheckedChange={field.onChange}
                                 disabled={!isEditMode}
                                 />
                               )}
                             />
                             <Label>TDS Applicable</Label>
                           </Flex>
                         </Flex>
                       </Form.Col>
                        <Form.Col lg={2} md={6} span={12}>
                                 <Form.Field label="Contact Type" required error={errors.tdsSection}>
                                   <Controller
                                     name="tdsSection"
                                     control={control}
                                     render={({ field }) => (
                                       <Select
                                         value={field.value}
                                         onValueChange={field.onChange}
                                         options={tdsSectionOptions}
                                         placeholder="Select TDS Section"
                                         size="form"
                                         variant="form"
                                         fullWidth
                                         itemVariant="form"
                                       />
                                     )}
                                   />
                                 </Form.Field>
                               </Form.Col>
            <Form.Col lg={2} md={6} span={12}>
                 <Form.Field label="TDS Rate" required error={errors.tdsRate}>
                   <Input
                     {...register("tdsRate")}
                     placeholder="Enter TDS Rate"
                     size="form"
                     variant="form"
                   />
                 </Form.Field>
               </Form.Col>
                <Form.Col lg={2} md={6} span={12}>
                         <Flex direction="col" gap={1} style={{ paddingTop: 22 }}>
                           <Flex align="center" gap={2}>
                             <Controller
                               control={control}
                               name="isReverseChange"
                               render={({ field }) => (
                                 <Switch
                                   checked={field.value}
                                   onCheckedChange={field.onChange}
                                 disabled={!isEditMode}
                                 />
                               )}
                             />
                             <Label>Reverse Change</Label>
                           </Flex>
                         </Flex>
                       </Form.Col>
      </Form.Row>
    </div>
  )
}