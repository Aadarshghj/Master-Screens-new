import { Controller, type Control, type FieldErrors, type UseFormRegister } from 'react-hook-form';
import type { PurchaseReqItemForm } from '../../../../../../../types/asset-mgmt/purchase-req';
import { Button, Flex, Form, FormContainer, Input, InputWithSearch, Label, Select, Textarea, Switch} from '@/components';
import { MODEL_MANUFACTURER_OPTIONS } from '../../constants/PurchaseReq.constant';
import { Plus, PlusCircle, RefreshCcw, UploadIcon } from 'lucide-react';
import React, { useState } from 'react';
import NeumorphicButton from '@/components/ui/neumorphic-button/neumorphic-button';

interface PurchaseReqItemProps{
    control: Control<PurchaseReqItemForm>;
    register: UseFormRegister<PurchaseReqItemForm>;
    errors: FieldErrors<PurchaseReqItemForm>;
}

export const PurchaseItemPage = ({
    control,
    errors,
    register,
}: PurchaseReqItemProps) => {

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

const handleFileSelect = (file: File) => {
  setSelectedFile(file);
  setSelectedFile(file.name);
};

const handleRemoveFile = () => {
  setSelectedFile(null);
  setSelectedFileName(null);
};

    return (
        <FormContainer className="px-2">
      <Form>
        <h3 className="text-m font-semibold text-gray-700 mb-4">
            Request Item Details</h3>
        <div className="mt-2">
          <Form.Row className="mt-6 gap-10">
            <Form.Col lg={4} md={6} span={9}  className='w-80'>
              <Form.Field
                label="Request Item"
                required
                // error={errors.product}
              >
                <InputWithSearch
                  {...register("itemId")}
                  placeholder="Search and select the item      Eg:Laptop"
                  size="form"
                  variant="form"
                  className="border-gray-300 placeholder:text-gray-300"
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={4} md={6} span={9}>
              <Form.Field
                label="Asset Group"
                required
                // error={errors.product}
              >
                <Input
                  {...register("assetGroupId")}
                  placeholder="//AutoFetch eg,Computer and Accessories"
                  size="form"
                  variant="form"
                  className="border-gray-300 placeholder:text-gray-300"
                  readOnly
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={4} md={6} span={9} className='ml-2'>
              <Form.Field
                label="Asset Type"
                required
                // error={errors.product}
              >
                <Input
                  {...register("assetTypeId")}
                  placeholder="//AutoFetch eg,fixed asset"
                  size="form"
                  variant="form"
                  className="border-gray-300 placeholder:text-gray-300"
                  readOnly
                />
              </Form.Field>
            </Form.Col>
            </Form.Row>

            <Form.Row className='mt-3'>
                 <Form.Col lg={1} md={6} span={9} className='w-30'>
              <Form.Field
                label="Item Quantity"
                required
                // error={errors.product}
              >
                <Input
                  {...register("quantity")}
                  placeholder="Enter Quantity"
                  size="form"
                  variant="form"
                  className="border-gray-300 placeholder:text-gray-300"
                />
              </Form.Field>
            </Form.Col>

             <Form.Col lg={3} md={6} span={9} className="ml-18 w-39">
              <Form.Field
                label="Unit of Measurement"
                required
                // error={errors.product}
              >
                <Input
                  {...register("unit")}
                  placeholder="//Autofetch"
                  size="form"
                  variant="form"
                  className="border-gray-300 placeholder:text-gray-300"
                  readOnly
                />
              </Form.Field>
            </Form.Col>

             <Form.Col lg={4} md={6} span={9} className='ml-2 w-83'>
              <Form.Field
                label="Requested Model/Manufacturer"
                // error={errors.product}
              >
                <Controller
                  control={control}
                  name="modelManufacturer"
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={MODEL_MANUFACTURER_OPTIONS}
                      value={field.value}
                      onValueChange={(value) => field.onChange(value)}
                      size="form"
                      placeholder='Select Requested Model/Manufacturer'
                      variant="form"
                      fullWidth
                      className='placeholder:text-gray-200 border-gray-300'
                    />
                  )}
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={2} md={6} span={9} className="ml-5 w-35">
              <Form.Field
                label="Estimated Amount"
                // error={errors.product}
              >
                <Input
                  {...register("estimatedAmount")}
                  placeholder="Enter Estimated Amount"
                  size="form"
                  variant="form"
                  className="border-gray-300 placeholder:text-gray-300"
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={2} md={6} span={12}>
            <Form.Field
              label="Supporting Document"
    error={errors.supportingDocument}
  >
    <NeumorphicButton
      type="button"
      disabled={isSubmitting}
      onClick={() => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".pdf,.jpg,.jpeg,.png";

        input.onchange = (e) => {
          const file = (e.target as HTMLInputElement).files?.[0];

          if (file) {
            handleFileSelect(file);
          }
        };

        input.click();
      }}
      className="mb-2"
    >
      {selectedFile ? "Change File" : "Upload File"}
    </NeumorphicButton>

    {selectedFileName ? (
      <div className="flex items-center gap-2 text-status-success text-xss">
        <span>
          {selectedFileName} (
          {selectedFile &&
            (selectedFile.size / 1024 / 1024).toFixed(2)}{" "}
          MB)
        </span>

        <button
          type="button"
          onClick={handleRemoveFile}
          className="text-red-500 hover:text-red-700 text-xs"
        >
          ✕
        </button>
      </div>
    ) : (
      <p className="text-nano text-muted-foreground ml-3 text-center">
        Accepted format JPG, PNG, JPEG, PDF Max size: 2MB
      </p>
    )}
  </Form.Field>
</Form.Col>
          </Form.Row>

          <Form.Row>
              <Form.Col lg={4} md={6} span={9} className='w-80 mt-2'>
              <Form.Field
                label="Request Description"
                // error={errors.product}
              >
                <Textarea
                  {...register("desc")}
                  size="form"
                  variant="form"
                  className="border-gray-300 h-20"
                />
              </Form.Field>
            </Form.Col>

              <Form.Col lg={4} md={6} span={9} className='w-83 ml-2 mt-2'>
              <Form.Field
                label="Request Justification"
                // error={errors.product}
              >
                <Textarea
                  {...register("justification")}
                  size="form"
                  variant="form"
                  className="border-gray-300 h-20"
                />
              </Form.Field>
            </Form.Col>

              <Form.Col lg={4} md={6} span={9} className='w-83 ml-5'>
              <Form.Field>
                <div className="flex items-center gap-1 mb-1">
                  <label className="text-[10px] font-medium">Item Specification</label>
                     <NeumorphicButton
                        type="button"
                        size="primary"
                        className="w-5 p-0 rounded-md items-center justify-center bg-blue-700"
                      >
                         <Plus className='h-3 w-3'/>
                    </NeumorphicButton>
              </div>
                <Textarea
                {...register("specification")}
                  size="form"
                  variant="form"
                  className="border-gray-300 h-18"
                />
             </Form.Field>
            </Form.Col>
            </Form.Row>

            <Form.Row>
              <Form.Col lg={4} md={6} span={9}>
              <Flex direction="col" gap={2} >
                <Flex align="center" gap={3}>
                  <Controller
                    control={control}
                    name="highPriority"
                    render={({ field }) => (
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                  <Label>High Priority</Label>
                </Flex>
              </Flex>
            </Form.Col>
          </Form.Row>

            <Flex.ActionGroup className="mt-2 justify-end gap-4">
            <NeumorphicButton
              type="button"
              variant="secondary"
              size="default"
            >
              <RefreshCcw className="h-3 w-3" />
              Reset
            </NeumorphicButton>

            <NeumorphicButton
              type="button"
              variant="default"
              size="secondary"
            >
              <PlusCircle className="h-3 w-3" />
              Add Item
            </NeumorphicButton>
            </Flex.ActionGroup>
        </div>
      </Form>
    </FormContainer>
    )
}