import React, { useCallback, useState } from "react"
import {
  Controller,
  type Control,
  type FieldErrors,
  type UseFormGetValues,
  type UseFormRegister,
} from "react-hook-form"

import { Flex, Input, Switch, Label, Select } from "@/components/ui"
import { Form } from "@/components"

import type {
  
  BankInfoType,Option,

} from "@/types/asset-management-system/supplier-management/supplier-information"
import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button"
import { BadgeCheck, BadgeX } from "lucide-react"
import { useWatch } from "react-hook-form"

interface BankInfoProps {
  control: Control<BankInfoType>
  errors: FieldErrors<BankInfoType>
  register: UseFormRegister<BankInfoType>
  isEditMode: boolean
  tdsSectionOptions:Option[]
  bankNameOptions:Option[]
  getValues: UseFormGetValues<BankInfoType>
}
export const BankInfoForm: React.FC<BankInfoProps> = ({
  errors,
  register,
  isEditMode,
  control,
  tdsSectionOptions,
  bankNameOptions,
  getValues,
}) => {
  const [accountVerifyStatus, setAccountVerifyStatus] = useState<
    "verified" | "denied" | null
  >(null);

  const handleVerifyAccountNumber = useCallback(() => {
    const accountValue = getValues("accountNumber");

    const isValidAccount =
      typeof accountValue === "string" &&
      /^[0-9]{14}$/.test(accountValue);

    setAccountVerifyStatus(isValidAccount ? "verified" : "denied");
  }, [getValues]);
  const isTdsApplicable = useWatch({
  control,
  name: "isTds",
});
  return (
    <div>

      <Form.Row>
         <Form.Col lg={2} md={6} span={12}>
                                 <Form.Field label="Bank Name" required error={errors.bankName}>
                                   <Controller
                                     name="bankName"
                                     control={control}
                                     render={({ field }) => (
                                       <Select
                                         value={field.value}
                                         onValueChange={field.onChange}
                                         options={bankNameOptions}
                                         placeholder="Select Bank Name"
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
            <Form.Col lg={3} md={6} span={12}>
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
          <Form.Field label="Penny Drop Verification">
            <NeumorphicButton type="button" className="mb-1 w-35" onClick={handleVerifyAccountNumber}>
              <span>Verify Account</span>
            </NeumorphicButton>

            <p className="text-nano text-green-600 ml-2">
              Display name as per Penny Drop
            </p>
          </Form.Field>
        </Form.Col>

    {accountVerifyStatus && (
  <Form.Col lg={1} md={6} span={12} className="pt-5 -ms-4">
    {accountVerifyStatus === "verified" && (
      <div className="flex items-center gap-1 text-[9px] font-medium text-green-600">
        <BadgeCheck className="h-4 w-3" />
        <span>Verified!</span>
      </div>
    )}

    {accountVerifyStatus === "denied" && (
      <div className="flex items-center gap-1 text-[9px] font-medium text-red-600">
        <BadgeX className="h-4 w-3" />
        <span>Denied!</span>
      </div>
    )}
  </Form.Col>
)}            <Form.Col lg={2} md={6} span={12}>
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
     {isTdsApplicable && (
  <>
    <Form.Col lg={3} md={6} span={12}>
      <Form.Field label="TDS Section" required error={errors.tdsSection}>
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
          <Label>Reverse Charge</Label>
        </Flex>
      </Flex>
    </Form.Col>
  </>
)}
      </Form.Row>
    </div>
  )
}