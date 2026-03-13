import React from "react"
import { FormContainer } from "@/components/ui/form-container"
import { SupplierInformationForm } from "./components/Form/SupplierInformationForm"
import {
  PageWrapper,

} from "@/components";
export const SupplierInformationPage: React.FC = () => {
  return (
     <PageWrapper
            variant="default"
            padding="xl"
            maxWidth="xl"
            contentPadding="sm"
            className="m-0 min-h-fit pb-4"
          >
            <section className="p-4 lg:p-8 xl:p-10">
    <FormContainer>
      <h2 className="text-lg font-semibold mb-1">
        Supplier Information
      </h2>
     <div className="mt-3 pb-7 rounded-lg border border-gray-300 bg-white p-6 shadow-sm">
      <SupplierInformationForm />
      </div>
    </FormContainer>
    </section>
    </PageWrapper>
  )
}

export default SupplierInformationPage