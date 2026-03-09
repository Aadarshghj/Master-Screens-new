import { Breadcrumb, PageWrapper, TitleHeader, type BreadcrumbItem } from "@/components";
import type { PurchaseRequestForm } from "@/types/asset-mgmt/purchase-req";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { PurchaseFormHeader } from "./components/form/PurchaseReqHeader";
import { PurchaseItemPage } from "./components/form/PurchaseReqItemDetails";
import { PurchaseItemTable } from "./components/table/PurchaseReqTable";

export const PurchaseRequestPage = () => {
    const navigate = useNavigate();

    const today = new Date().toISOString().split("T")[0];

const {
  control,
  register,
  formState: { errors },
} = useForm<PurchaseRequestForm>({
  defaultValues: {
    requestedDate: today,
     requestedItemId:1,
            assetGroupId:"",
            assetTypeId:"",
            quantity:0,
            unit:"",
            modelManufacturer:"",
            estimatedAmount:0,
            desc:"",
            justification:"",
            specification:"",
            highPriority: false,
  },
});

    // const onSumbit = (data: PurchaseReqItemFor) => {
    //     console.log("Purchase Request Submitted:",data);
    // };

    const BreadcrumbItems : BreadcrumbItem[]= [
        { label: "Home", href:"/", onClick: () => navigate("/")},
        {
            label:"Asset Management System",
            href:"/customer/asset-mgmt",
            onClick: () => navigate("/customer/asset-mgmt"),
        },
        { label:"Purchase Request", active: true},
    ];

    return (
        <>
        <PageWrapper
        variant="default"
        padding="xl"
        maxWidth="xl"
        contentPadding="sm"
        className="m-0 min-h-fit pb-4"
        >
        <section className="p-4 lg:p-8 xl:p-10">
            <Breadcrumb items={BreadcrumbItems} variant="default" size="sm"/>

            <TitleHeader
            title="Purchase Request"
            className="text-xl font-medium py-4"
            />

            <div className="rounded-lg border border-blue-10 p-5 bg-blue-50">
                <PurchaseFormHeader
                 control={control}
                 errors={errors}
                 register={register}/>
            </div>

             <div className="rounded-lg border border-blue-10 p-5 bg-default mt-7">
                <PurchaseItemPage
                 control={control}
                 errors={errors}
                 register={register}/>
            </div>

            <div className="mt-2">
                <PurchaseItemTable/>
                </div>
        </section>
        </PageWrapper>
        </>
    )

}