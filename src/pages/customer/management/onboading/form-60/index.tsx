import { Form60Form } from "./components/Form/Form60";
import { Form60Table } from "./components/Table";
import {
  useGetForm60ByIdQuery,
  useGetCustomerAllDetailsQuery,
  logger,
} from "@/global/service";
import { useAppDispatch, useAppSelector } from "@/hooks/store";
import { setForm60Identity } from "@/global/reducers/customer/form60-identity.reducer";
import type { Form60PageProps } from "@/types/customer/form60.types";
import { useEffect } from "react";

export function Form60Page({
  customerIdentity,
  onFormSubmit,
  readOnly = false,
}: Form60PageProps & {
  onFormSubmit?: () => void;
}) {
  const dispatch = useAppDispatch();
  const storedForm60Id = useAppSelector(
    state => state.form60Identity?.form60Id
  );
  // Get Form60 ID from sessionStorage first, then Redux store
  const sessionForm60Data = sessionStorage.getItem("form60Identity");
  let sessionForm60Id = "";

  if (sessionForm60Data) {
    try {
      // Check if it's a JSON object or just a string
      if (sessionForm60Data.startsWith("{")) {
        const parsed = JSON.parse(sessionForm60Data);
        sessionForm60Id = parsed.form60Id || "";
      } else {
        // It's already just the ID string
        sessionForm60Id = sessionForm60Data;
      }
    } catch (error) {
      logger.error({ error });
      // If parsing fails, treat it as a string ID
      sessionForm60Id = sessionForm60Data;
    }
  }

  // const effectiveForm60Id = sessionForm60Id || storedForm60Id || "";

  // Sync sessionStorage with Redux store
  useEffect(() => {
    if (sessionForm60Id && !storedForm60Id) {
      dispatch(
        setForm60Identity({
          form60Id: sessionForm60Id,
          customerId: customerIdentity ?? "",
          status: "CREATED",
        })
      );
    }
  }, [sessionForm60Id, storedForm60Id, customerIdentity ?? "", dispatch]);

  // Get Form60 data - only skip if we don't have a customer ID or form60Id
  const { data: form60Data } = useGetForm60ByIdQuery(
    {
      customerId: customerIdentity ?? "",
    },
    { skip: !customerIdentity }
  );

  // Get customer details
  const { data: customerDetails } = useGetCustomerAllDetailsQuery(
    { customerId: customerIdentity ?? "" },
    { skip: !customerIdentity }
  );

  return (
    <div className="space-y-1">
      {!readOnly && (
        <Form60Form
          customerIdentity={customerIdentity}
          onFormSubmit={onFormSubmit}
          form60Identity={form60Data?.identity ?? ""}
        />
      )}
      <Form60Table
        customerIdentity={customerIdentity}
        form60Data={form60Data}
        customerDetails={customerDetails}
        readOnly={readOnly}
      />
    </div>
  );
}
