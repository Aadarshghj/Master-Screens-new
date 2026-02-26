import { useAppSelector } from "@/hooks/store";

export const useCustomerIdentity = () => {
  const customerIdentity = useAppSelector(state => state.customerIdentity);

  return {
    identity: customerIdentity.identity,
    customerCode: customerIdentity.customerCode,
    status: customerIdentity.status,
    isInitialized: customerIdentity.isInitialized,
    hasIdentity: Boolean(customerIdentity.identity),
  };
};
