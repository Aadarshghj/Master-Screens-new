import { Form, FormContainer, Input, TitleHeader } from "@/components";
import type { PurchaseReqHeader } from "@/types/asset-mgmt/purchase-req"
import { Calendar } from "lucide-react";
import { Controller, type Control, type FieldErrors, type UseFormRegister } from "react-hook-form";

interface PurchaseReqFormProps{
    control: Control<PurchaseReqHeader>;
    errors: FieldErrors<PurchaseReqHeader>;
    register: UseFormRegister<PurchaseReqHeader>;
}
   
export const PurchaseFormHeader = ({
  control,
  errors,
  register,
}: PurchaseReqFormProps) => {
    return (
        <FormContainer className="px-2">
      <Form>
        <h3 className="text-m font-semibold text-gray-700 mb-4">
            Request Header</h3>
        <div className="mt-2">
          <Form.Row className="mt-5 gap-6">
            <Form.Col lg={2} md={6} span={9}>
              <Form.Field
                label="Request ID"
                required
                // error={errors.product}
              >
                <Input
                  {...register("requestedId")}
                  placeholder="//AutoFetch eg,13409"
                  size="form"
                  variant="form"
                  className="bg-white/80 border border-gray-300 placeholder:text-gray-300 cursor-not-allowed"
                  readOnly
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={2} md={6} span={9} className="ml-3">
              <Form.Field
                label="Request Date"
                required
                // error={errors.product}
              >
                <div className="relative w-32">
                <Controller
                 control={control}
                 name="requestedDate"
                render={({ field }) => (
                 <Input
                  type="date"
                  {...field}
                  size="form"
                  variant="form"
                  readOnly
                  className="bg-white/80 border border-gray-300 px-3 py-2 placeholder:text-gray-300 cursor-not-allowed"
                     />
                 )}
                />
                <Calendar className=" absolute right-3 top-1/2 -translate-y-1/2 text-red-400 pointer-events-none" size={14}/>
                </div>
              </Form.Field>
            </Form.Col>

              <Form.Col lg={4} md={6} span={9} className="ml-2 w-90">
              <Form.Field
                label="Request Office"
                required
                // error={errors.product}
              >
                <div className="mr-6">
                <Input
                  {...register("requestedOfficeId")}
                  placeholder="//AutoFetch eg,152-Kalamassery Branch"
                  size="form"
                  variant="form"
                  className="bg-white/80 border border-gray-300 placeholder:text-gray-300 cursor-not-allowed"
                  readOnly
                />
                </div>
              </Form.Field>
            </Form.Col>
            

              <Form.Col lg={4} md={6} span={9} className="ml-4">
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
                  className="bg-white/80 border border-gray-300 placeholder:text-gray-300 cursor-not-allowed"
                  readOnly
                />
              </Form.Field>
            </Form.Col>

          </Form.Row>
        </div>
      </Form>
    </FormContainer>
    )
}