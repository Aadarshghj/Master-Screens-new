import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/store";
import { setCurrentStepSaved } from "@/global/reducers/firm/firmOnboarding.reducer";
import { useGetCustomerAddressQuery } from "@/global/service/end-points/Firm/addressDetails";
import { AddressDetails } from "./components/AddressDetails";

interface AddressDetailsPageProps {
  firmIdentity?: string;
  customerId?: string | null;
  onFormSubmit?: () => void;
  onSaveSuccess?: () => void;
  readonly?: boolean;
}

export const AddressDetailsPage: React.FC<AddressDetailsPageProps> = ({
  customerId: propCustomerId,
  readonly = false,
}) => {
  const dispatch = useAppDispatch();
  const { customerId: reduxCustomerId } = useAppSelector(
    state => state.firmOnboarding
  );
  const customerId = propCustomerId || reduxCustomerId;
  console.log(customerId, "customerId");

  // Fetch customer addresses to check if  exist
  const { data: customerAddresses = [] } = useGetCustomerAddressQuery(
    customerId || "",
    {
      skip: !customerId,
    }
  );

  // Enable/disable next button based on saved addresses
  useEffect(() => {
    const hasAddresses =
      Array.isArray(customerAddresses) && customerAddresses.length > 0;
    dispatch(setCurrentStepSaved(hasAddresses));
  }, [customerAddresses, dispatch]);

  return (
    <div className="space-y-6">
      <AddressDetails readonly={readonly} />
    </div>
  );
};
