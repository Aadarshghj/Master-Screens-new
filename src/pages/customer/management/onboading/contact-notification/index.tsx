import React, { useCallback, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { ContactNotificationForm } from "./components/Form/Contact";
import { ContactTable } from "./components/Table/Contact";
import { NotificationPreference } from "./components/Form/Notification";
import type {
  ContactFormData,
  ContactNotificationPageProps,
} from "@/types/customer/contact.types";

export const ContactNotificationPage: React.FC<
  ContactNotificationPageProps & {
    onFormSubmit?: () => void;
  }
> = ({
  customerIdentity,
  onFormSubmit,
  isView = false,
  readOnly = false,
  handleSetConfirmationModalData,
  confirmationModalData,
}) => {
  const [editingContact, setEditingContact] = useState<ContactFormData | null>(
    null
  );
  const [editForm, setEditForm] = useState(false);

  const handleFormSubmit = useCallback(() => {
    // Form submission handled by the form component itself
    onFormSubmit?.();
  }, [onFormSubmit]);
  const formRef = React.useRef<HTMLDivElement | null>(null);
  const handleEditContact = (contact: ContactFormData) => {
    setEditingContact(contact);
    setEditForm(true);
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const handleCloseEditForm = () => {
    setEditForm(false);
  };

  return (
    <div className="space-y-6" ref={formRef}>
      {!readOnly && (
        <ErrorBoundary fallback={null}>
          <ContactNotificationForm
            onFormSubmit={handleFormSubmit}
            initialData={editingContact || {}}
            onEditComplete={() => setEditingContact(null)}
            customerIdentity={customerIdentity}
            customerId={customerIdentity ?? ""}
            editForm={editForm}
            onCloseEdit={handleCloseEditForm}
            isView={isView}
            handleSetConfirmationModalData={handleSetConfirmationModalData}
            confirmationModalData={confirmationModalData}
          />
        </ErrorBoundary>
      )}
      <ErrorBoundary fallback={null}>
        <ContactTable
          onEditContact={handleEditContact}
          customerIdentity={customerIdentity}
          isView={isView}
          readOnly={readOnly}
          handleSetConfirmationModalData={handleSetConfirmationModalData}
          confirmationModalData={confirmationModalData}
        />
      </ErrorBoundary>
      <ErrorBoundary fallback={null}>
        <NotificationPreference
          customerId={customerIdentity ?? ""}
          readOnly={readOnly}
        />
      </ErrorBoundary>
    </div>
  );
};
