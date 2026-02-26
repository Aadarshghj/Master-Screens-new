import React from "react";

interface CustomerData {
  name: string | null;
  address: string | null;
  dob: string | null;
  gender: string | null;
  contactNumbers: string[] | null;
  extractedFrom: string | null;
}

interface Props {
  open: boolean;
  loading: boolean;
  error?: string;
  data?: CustomerData | null;
  onClose: () => void;
  onAccept: (data: CustomerData) => void;
}

function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-auto rounded-lg bg-white shadow-xl">
        <div className="sticky top-0 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-2xl leading-none text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

function Spinner({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
      <p className="mt-4 text-gray-600">{label}</p>
    </div>
  );
}

function ErrorMessage({ text }: { text: string }) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
      {text}
    </div>
  );
}

function CustomerInfoTable({ data }: { data: CustomerData }) {
  const fields = [
    { label: "Name", value: data.name },
    { label: "Address", value: data.address },
    { label: "Date of Birth (DOB)", value: data.dob },
    { label: "Gender", value: data.gender },
    { label: "Contact Numbers", value: data.contactNumbers },
    { label: "Document Type", value: data.extractedFrom },
  ];

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
      {fields.map((field, index) => (
        <div
          key={index}
          className={`flex ${index !== fields.length - 1 ? "border-b border-gray-200" : ""}`}
        >
          <div className="w-1/3 bg-white px-6 py-4">
            <span className="font-medium text-gray-700">{field.label}</span>
          </div>
          <div className="w-2/3 bg-gray-50 px-6 py-4">
            <span className="text-gray-900">{field.value || "N/A"}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function Button({
  children,
  variant = "primary",
  onClick,
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  onClick: () => void;
}) {
  const baseClasses = "px-4 py-2 rounded-lg font-medium transition-colors";
  const variantClasses =
    variant === "primary"
      ? "bg-blue-600 text-white hover:bg-blue-700"
      : "bg-gray-200 text-gray-700 hover:bg-gray-300";

  return (
    <button onClick={onClick} className={`${baseClasses} ${variantClasses}`}>
      {children}
    </button>
  );
}

export function CustomerExtractionModal({
  open,
  loading,
  error,
  data,
  onClose,
  onAccept,
}: Props) {
  if (!open) return null;

  return (
    <Modal title="Extracted Customer Information" onClose={onClose}>
      {loading && <Spinner label="Extracting information..." />}
      {error && <ErrorMessage text={error} />}
      {data && (
        <>
          <CustomerInfoTable data={data} />
          <div className="mt-6 flex justify-end gap-3">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={() => onAccept(data)}>Use This Data</Button>
          </div>
        </>
      )}
    </Modal>
  );
}
