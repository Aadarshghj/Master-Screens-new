import { useState, useEffect } from "react";
import { Modal, TitleHeader } from "@/components";
import type { CKYCData, CustomerData, SearchModalProps } from "@/types";
import { logger } from "@/global/service";
import { CKYCSearchModal } from "./CKYCSearchModal";
import { CustomerSearch } from "./CustomerSearchModal";
import { OnboardingView } from "../../../customer-view/onboarding-view";
import { useAppSelector } from "@/hooks/store";

export function SearchModal({
  isOpen = true,
  onClose,
  onSelectCustomer,
  defaultTab = "CKYC",
}: SearchModalProps) {
  const [activeSearchTab, setActiveSearchTab] = useState<"Customer" | "CKYC">(
    defaultTab
  );
  const customerIdentityView = useAppSelector(
    state => state.customerIdentityView?.identity
  );
  const [viewMode, setViewMode] = useState(false);
  const [customerIdentity, setCustomerIdentity] = useState("");
  const toggleViewMode = () => {
    setViewMode(view => !view);
  };
  const handleClose = () => {
    onClose();
    setViewMode(false);
  };
  useEffect(() => {
    if (defaultTab) {
      setActiveSearchTab(defaultTab);
    }
  }, [defaultTab]);
  const handleSetCustomerId = (id: string) => {
    setCustomerIdentity(id);
  };
  return (
    <Modal
      isOpen={isOpen}
      close={handleClose}
      width="3xl"
      isClosable={true}
      compact={true}
      className="relative mx-4 max-h-[98vh] min-h-[95vh] w-full"
      titleVariant="default"
      emptyScreen
      backButton={viewMode}
      onBack={toggleViewMode}
      headerAlignEnd={!viewMode}
      padding="p-2 md:p-4 lg:p-10"
    >
      {viewMode && (
        <OnboardingView
          customerIdentity={customerIdentity ?? customerIdentityView}
        />
      )}
      <div
        style={{ display: viewMode ? "none" : "block" }}
        className=" max-h-[80vh] overflow-scroll"
      >
        {/* <div className="mb-2">
          <Flex justify="end" align="center">
            <nav role="tablist" aria-label="Customer search type selection">
              <Flex gap={1} className="bg-muted rounded-full p-1">
                {(
                  [
                    "Customer",
                    // , "CKYC"
                  ] as const
                ).map(tab => (
                  <Toggle
                    key={tab}
                    variant={activeSearchTab === tab ? "active" : "inactive"}
                    className="rounded-full px-4 py-1.5 text-[11px] font-medium"
                    onClick={() => setActiveSearchTab(tab)}
                    role="tab"
                    aria-selected={activeSearchTab === tab}
                    aria-controls={`${tab.toLowerCase()}-search-panel`}
                    id={`${tab.toLowerCase()}-search-tab`}
                  >
                    {tab}
                  </Toggle>
                ))}
              </Flex>
            </nav>
          </Flex>
        </div> */}
        <TitleHeader
          title={
            activeSearchTab === "CKYC"
              ? "Central KYC Search"
              : "Customer Search"
          }
          className="mb-5"
          as="h3"
          variant="default"
        />
        <div className="space-y-4">
          {activeSearchTab === "CKYC" ? (
            <section
              id="ckyc-search-panel"
              role="tabpanel"
              aria-labelledby="ckyc-search-tab"
            >
              <CKYCSearchModal
                onSelectCustomer={(customer: CKYCData) => {
                  logger.info("Selected CKYC customer");
                  if (onSelectCustomer) {
                    onSelectCustomer(customer);
                  }
                  if (onClose) {
                    onClose();
                  }
                }}
                onSearchResults={(_results: CKYCData[]) => {
                  logger.error(_results);
                }}
              />
            </section>
          ) : (
            <section
              id="customer-search-panel"
              role="tabpanel"
              aria-labelledby="customer-search-tab"
            >
              <CustomerSearch
                onSelectCustomer={(customer: CustomerData) => {
                  logger.info("Selected customer");
                  if (onSelectCustomer) {
                    onSelectCustomer(customer);
                  }
                  if (onClose) {
                    onClose();
                  }
                }}
                onSearchResults={(_results: CustomerData[]) => {
                  logger.error(_results);
                }}
                handleSetCustomerId={handleSetCustomerId}
                toggleViewCustomerDetails={toggleViewMode}
              />
            </section>
          )}
        </div>
      </div>
    </Modal>
  );
}
