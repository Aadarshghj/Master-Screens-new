import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { FormContainer } from "@/components/ui/form-container";
import { Input, InputWithSearch, DatePicker, Form, Button, TitleHeader } from "@/components";
import type { QuotReqDetails, SupplierDetails } from "@/types/asset-management/quotation-registration-type";
import { QuotationDetailsDataTable } from "../Table/QuotationDetailsTable";

interface QuotRegWithSupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  onToggleDisable?: () => void;
}

export function QuotRegWithSupplierModal({ isOpen, onClose, onToggleDisable = () => {} }: QuotRegWithSupplierModalProps) {
  const handleClose = () => {
    onToggleDisable();
    onClose();
  };

  // Combined form state (could be split if needed)
  const { register, handleSubmit, control, formState: { errors } } = useForm<{
    quotReq: QuotReqDetails;
    supplier: SupplierDetails;
  }>({
    defaultValues: {
      quotReq: {},
      supplier: {},
    },
  });

  const [description, setDescription] = useState("");

  const onSubmit = (data: { quotReq: QuotReqDetails; supplier: SupplierDetails }) => {
    console.log("Form Submitted:", data);
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-[90vw] max-w-6xl p-6 rounded shadow-lg overflow-auto max-h-[95vh] relative">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          onClick={handleClose}
        >
          ✕
        </button>
        <TitleHeader
          title="Quotation List"
          className="py-4"
        />
        <FormContainer>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <h2 className="mb-4 text-base font-medium">Quotation Request Details</h2>

            <Form.Row className="mt-4 gap-6">
              <Form.Col span={3}>
                <Form.Field label="Quotation Request Date*" error={errors?.quotReq?.quotReqDate}>
                  <Controller
                    name="quotReq.quotReqDate"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        value={field.value || undefined}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        placeholder="dd/mm/yyyy"
                        allowManualEntry
                        size="form"
                        variant="form"
                      />
                    )}
                  />
                </Form.Field>
              </Form.Col>

              <Form.Col span={3}>
                <Form.Field label="Quotation Request ID*" error={errors?.quotReq?.quotReqId}>
                  <Input
                    {...register("quotReq.quotReqId")}
                    placeholder="Enter Quotation Request ID"
                    size="form"
                    variant="form"
                    className="uppercase"
                  />
                </Form.Field>
              </Form.Col>

              <Form.Col span={3}>
                <Form.Field label="Requested By*" error={errors?.quotReq?.reqBy}>
                  <Input
                    {...register("quotReq.reqBy")}
                    placeholder="Enter Requested By"
                    size="form"
                    variant="form"
                    disabled
                  />
                </Form.Field>
              </Form.Col>

              <Form.Col span={3}>
                <Form.Field label="Description">
                  <Input
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Enter Description"
                    size="form"
                    variant="form"
                  />
                </Form.Field>
              </Form.Col>
            </Form.Row>

            <h2 className="mt-8 mb-4 text-base font-medium">Supplier Details</h2>
            <Form.Row className="mt-4 gap-6">
              <Form.Col span={3}>
                <Form.Field label="Supplier Name" error={errors?.supplier?.supplierName}>
                  <InputWithSearch
                    placeholder="Select Supplier Name"
                    size="form"
                    variant="form"
                  />
                </Form.Field>
              </Form.Col>

              <Form.Col span={3}>
                <Form.Field label="Quotation Number*" error={errors?.supplier?.quotationNumber}>
                  <Input
                    {...register("supplier.quotationNumber")}
                    placeholder="Enter Quotation Number"
                    size="form"
                    variant="form"
                    className="uppercase"
                  />
                </Form.Field>
              </Form.Col>

              <Form.Col span={3}>
                <Form.Field label="Quotation Date*" error={errors?.supplier?.quotationDate}>
                  <Controller
                    name="supplier.quotationDate"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        value={field.value || undefined}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        placeholder="dd/mm/yyyy"
                        allowManualEntry
                        size="form"
                        variant="form"
                        disableFutureDates={false}
                      />
                    )}
                  />
                </Form.Field>
              </Form.Col>

              <Form.Col span={3}>
                <Form.Field label="Quotation Amount*" error={errors?.supplier?.quotationAmount}>
                  <Input
                    {...register("supplier.quotationAmount")}
                    placeholder="Enter Quotation Amount"
                    size="form"
                    variant="form"
                  />
                </Form.Field>
              </Form.Col>
            </Form.Row>

            <div className="mt-8">
            <h2 className="mb-4 text-base font-medium">Quotation Details</h2>
            <QuotationDetailsDataTable />
            </div>  
            </Form>
          </FormContainer>
      
            <h2 className="mt-8 mb-4 text-base font-medium">Other Charges</h2>


          <div className="flex gap-2 justify-end mt-6">
            <Button variant="primary" size="default" onClick={() => setDescription("")}>
              Reset
            </Button>
            <Button variant="primary" size="default" type="submit">
              Save Quotation Details
            </Button>
          </div>
        </div>
      </div>
  );
}
// import React from "react";
// import { 
//   Controller, 
//   type Control,
//   type FieldErrors, 
//   type UseFormRegister, 
// } from "react-hook-form";

// import { FormContainer } from "@/components/ui/form-container";
// import { 
//   // Flex,
//   Input, 
//   DatePicker
//  } from "@/components/ui";
// import { Form } from "@/components";
// import type { QuotReqDetails } from "@/types/asset-management/quotation-registration-type";

// interface QuotReqDetailsFormProps {
//   control: Control<QuotReqDetails>;
//   errors: FieldErrors<QuotReqDetails>;
//   register: UseFormRegister<QuotReqDetails>;
//   isEdit: boolean;
//   isSubmitting: boolean;
//   isOpen: boolean;
//   onClose: () => void;
//   onToggleDisable: () => void;
//   onSubmit: () => void;
//   onCancel: () => void;
//   onReset: () => void;
// }


// export const QuotRegForm: React.FC<QuotReqDetailsFormProps> = ({
//   control,
//   errors,
//   register,
//   isOpen,
//   onClose,
//   onToggleDisable,
//   // isEdit,
//   // isSubmitting,
//   onSubmit,
//   // onCancel,
//   // onReset,
// }) => {

// return (
//   <FormContainer className="px-0">
//     <Form onSubmit={onSubmit}>
//       <div className="mt-2">
//         <Form.Row className="py-2">
//           <Form.Col lg={2} md={6} span={12}>
//             <Form.Field
//               label="Leave From"
//               error={errors.quotReqDate}
//               required
//             >
//               <Controller
//                 name="quotReqDate"
//                 control={control}
//                 render={({ field }) => (
//                   <DatePicker
//                     value={field.value || undefined}
//                     onChange={(value: string) => {
//                       field.onChange(value);
//                       // trigger?.("leaveFrom");
//                     }}
//                     onBlur={() => field.onBlur()}
//                     placeholder="dd/mm/yyyy"
//                     allowManualEntry={true}
//                     size="form"
//                     variant="form"
//                     disableFutureDates={false}
//                   />
//                 )}
//               />
//             </Form.Field>
//           </Form.Col>

//           <Form.Col lg={3} md={3} span={12}>
//             <Form.Field
//                 label="Quotation Request ID"
//                 required
//                 error={errors.quotReqId}
//             >
//               <Input
//                   {...register("quotReqId")}
//                   placeholder="Enter Quotation Request ID"
//                   size="form"
//                   variant="form"
//                   className="uppercase"
//                   textTransform="uppercase"
//                   restriction="alphabetic"
//               />
//             </Form.Field>
//           </Form.Col>

//           <Form.Col lg={3} md={3} span={12}>
//             <Form.Field
//                 label="Requested By"
//                 required
//                 error={errors.reqBy}
//             >
//               <Input
//                   {...register("reqBy")}
//                   placeholder="Enter Quotation Request ID"
//                   size="form"
//                   variant="form"
//                   className="uppercase"
//                   textTransform="uppercase"
//                   disabled
//               />
//             </Form.Field>
//           </Form.Col>

//           <Form.Col lg={3} md={6} span={12}>
//             <Form.Field label="Description">
//               <Input
//                   {...register("description")}
//                   placeholder="Enter Description"
//                   size="form"
//                   variant="form"
//                   disabled
//               />
//             </Form.Field>
//           </Form.Col>
//         </Form.Row>

       
//         </div>
//       </Form>
//     </FormContainer>
//   );
// };