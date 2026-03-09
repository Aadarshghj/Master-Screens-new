import React from "react";
import {
    Controller,type Control,
  type FieldErrors,
  type UseFormRegister,
} from "react-hook-form";

import { Flex, Input, Switch,Label, Select } from "@/components/ui";
import { Form } from "@/components";
import type {
  SupplierInformationType,Option,

} from "@/types/asset-management-system/supplier-management/supplier-information";


interface SupplierDetailsProps {
  control: Control<SupplierInformationType>;
  errors: FieldErrors<SupplierInformationType>;
  register: UseFormRegister<SupplierInformationType>;
  isEditMode: boolean;
  supplierRiskCategoryOptions: Option[];
  gstRegistrationTypeOptions: Option[];
  msmeTypeOptions: Option[];
}

export const SupplierDetailsForm: React.FC<SupplierDetailsProps> = ({
  errors,
  register,
   control,
  isEditMode,
  supplierRiskCategoryOptions,
  gstRegistrationTypeOptions,
  msmeTypeOptions
  
}) => { 
  return (
    <div>
         <h3 className="text-xs font-semibold mb-2">Supplier Details</h3>

          <Form.Row>
            <Form.Col lg={2} md={6} span={12}>
              <Form.Field
                label="Supplier Name" required error={errors.supplierName}
              >
                <Input
                  {...register("supplierName")}
                  placeholder="Enter Supplier Name"
                  size="form"
                  variant="form"
                  className="uppercase"
                />
              </Form.Field>
            </Form.Col>
            <Form.Col lg={2} md={6} span={12}>
              <Form.Field
                label="Trade Name" error={errors.tradeName}
               
              >
                <Input
                  {...register("tradeName")}
                  placeholder="Enter trade Name"
                  size="form"
                  variant="form"
                  className="uppercase"
                />
              </Form.Field>
            </Form.Col>
             <Form.Col lg={2} md={6} span={12}>
          <Form.Field label="Supplier Risk Category" required error={errors.supplierRiskCategory}>
            <Controller
              name="supplierRiskCategory"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  options={supplierRiskCategoryOptions}
                  placeholder="Select Supplier Risk Category"
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
          <Form.Field label="GST Registration Type" required error={errors.gstRegistrationType}>
            <Controller
              name="gstRegistrationType"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  options={gstRegistrationTypeOptions}
                  placeholder="Select GST Register Type"
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
          <Form.Field label="MSME Type"  error={errors.msmeType}>
            <Controller
              name="msmeType"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  options={msmeTypeOptions}
                  placeholder="Select MSME Type"
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
              <Form.Field
                label="PAN Number" required error={errors.panNumber}
              >
                <Input
                  {...register("panNumber")}
                  placeholder="Enter PAN Number"
                  size="form"
                  variant="form"
                  className="uppercase"
                />
              </Form.Field>
            </Form.Col>
            <Form.Col lg={2} md={6} span={12}>
              <Form.Field
                label="GSTIN" required error={errors.gstin}
              >
                <Input
                  {...register("gstin")}
                  placeholder="Enter GSTIN"
                  size="form"
                  variant="form"
                  className="uppercase"
                />
              </Form.Field>
            </Form.Col>
            <Form.Col lg={2} md={6} span={12}>
              <Form.Field
                label="MSME Registration No" required error={errors.msmeRegistrationNo}
              >
                <Input
                  {...register("msmeRegistrationNo")}
                  placeholder="Enter MSME Registration No"
                  size="form"
                  variant="form"
                  className="uppercase"
                />
              </Form.Field>
            </Form.Col>
            <Form.Col lg={2} md={6} span={12}>
              <Form.Field
                label="MSME CIN/LLPIN" required error={errors.cinOrLlpin}
              >
                <Input
                  {...register("cinOrLlpin")}
                  placeholder="Enter CIN/LLPIN"
                  size="form"
                  variant="form"
                  className="uppercase"
                />
              </Form.Field>
            </Form.Col>
            <Form.Col lg={2} md={6} span={12}>
              <Form.Field
                label="Contact Person Name" required error={errors.contactPersonName}
              >
                <Input
                  {...register("contactPersonName")}
                  placeholder="Enter Contact Person Name"
                  size="form"
                  variant="form"
                  className="uppercase"
                />
              </Form.Field>
            </Form.Col>
            <Form.Col lg={2} md={6} span={12}>
              <Form.Field
                label="Designation" required error={errors.designation}
              >
                <Input
                  {...register("designation")}
                  placeholder="Enter Designation"
                  size="form"
                  variant="form"
                  className="uppercase"
                />
              </Form.Field>
            </Form.Col>

            
            
                        <Form.Col lg={2} md={6} span={12}>
                          <Flex direction="col" gap={1} style={{ paddingTop: 22, paddingLeft: 20 }}>
                            <Flex align="center" gap={2}>
                              <Controller
                                control={control}
                                name="isActive"
                                render={({ field }) => (
                                  <Switch
                                    checked={!!field.value}
                                    onCheckedChange={field.onChange}
                                    disabled={!isEditMode}
                                  />
                                )}
                              />
                              <Label>Active</Label>
                            </Flex>
                          </Flex>
                        </Form.Col>
          </Form.Row>

        </div>
   
  );
};
