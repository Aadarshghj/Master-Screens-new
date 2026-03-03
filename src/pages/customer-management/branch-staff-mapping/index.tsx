import { useNavigate } from "react-router-dom";
import { Breadcrumb, type BreadcrumbItem } from "@/components";
import { BranchStaffMappingContainer } from "./components/Form/BranchStaffMappingForm";

const BranchStaffMappingPage = () => {
  const navigate = useNavigate();

  const breadcrumbItems: BreadcrumbItem[] = [
    {
      label: "Home",
      href: "/",
      onClick: () => navigate("/"),
    },
    {
      label: "Customer Management",
      href: "/customer-management",
      onClick: () => navigate("/customer-management"),
    },
    {
      label: "Master",
      href: "/customer-management/master",
      onClick: () => navigate("/customer-management/master"),
    },
    {
      label: "Branch Staff Mapping",
      href: "/customer-management/master/branch-staff-mapping",
      onClick: () =>
        navigate("/customer-management/master/branch-staff-mapping"),
    },
  ];

  return (
     <div className="space-y-6">
      <section className="space-y-6 px-6 pt-12">
        <Breadcrumb
          items={breadcrumbItems}
          variant="default"
          size="sm"
          className="mb-1"
        />
      </section>
      <BranchStaffMappingContainer />
    </div>
  );
};

export default BranchStaffMappingPage;