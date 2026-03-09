import React from "react";
import {
  TitleHeader,

  PageWrapper,
} from "@/components";


import { SupplierInformationForm } from "./components/Form/SupplierInformationForm";
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


        <TitleHeader title="Supplier Information" className="py-4" />

        <div className="rounded-lg border border-gray-300 bg-white p-6 shadow-sm">

          <SupplierInformationForm/>

        </div>

      </section>
    </PageWrapper>
  );
};
