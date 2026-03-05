import { Controller, type Control, type FieldErrors, type UseFormRegister } from 'react-hook-form';
import type { PurchaseReqItemForm } from '../../../../../../../types/asset-mgmt/purchase-req';
import { Form, FormContainer, Input, InputWithSearch, Select } from '@/components';
import { MODEL_MANUFACTURER_OPTIONS } from '../../constants/PurchaseReq.constant';

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

            <Form.Row className='mt-5'>
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
                required
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
                      className='placeholder:text-gray-200'
                    />
                  )}
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={3} md={6} span={9} className="ml-5 w-35">
              <Form.Field
                label="Estimated Amount"
                required
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

            <Form.Col lg={2} md={6} span={9}>
              <Form.Field
                label="Request Date"
                required
                // error={errors.product}
              >
                <div className="relative w-34">
                <Controller
                 control={control}
                 name="requestedDate"
                render={({ field }) => (
                 <Input
                  type="date"
                  {...field}
                  size="form"
                  variant="form"
                  className="bg-white/80 border border-gray-300 px-3 py-2 placeholder:text-gray-300 cursor-not-allowed"
                     />
                 )}
                />
                </div>
              </Form.Field>
            </Form.Col>

              <Form.Col lg={4} md={6} span={9}>
              <Form.Field
                label="Request Office"
                required
                // error={errors.product}
              >
                <Input
                  {...register("requestedOfficeId")}
                  placeholder="//AutoFetch eg,152-Kalamassery Branch"
                  size="form"
                  variant="form"
                  className="border-gray-300 placeholder:text-gray-300"
                />
              </Form.Field>
            </Form.Col>
            

              <Form.Col lg={4} md={6} span={9}>
              <Form.Field
                label="Requested By"
                required
                // error={errors.product}
              >
                <Input
                  {...register("requestedById")}
                  placeholder="//AutoFetch Eg,13409-rahul"
                  size="form"
                  variant="form"
                  className="border-gray-300 placeholder:text-gray-300"
                  
                />
              </Form.Field>
            </Form.Col>

          </Form.Row>
        </div>
      </Form>
    </FormContainer>
    )
}